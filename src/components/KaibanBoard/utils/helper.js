import toast from 'react-hot-toast';

const AGENT_STATUS_MESSAGES = {
    THOUGHT: " has finished thinking",
    THINKING_END: " has ended the thinking process",
    EXECUTING_ACTION: " is executing an action",
    USING_TOOL: " is using a tool",
    USING_TOOL_END: " has finished using the tool",
    OBSERVATION: " is making an observation",
    MAX_ITERATIONS_ERROR: " stopped due to maximum iterations error",
    THINKING_ERROR: " encountered an error while thinking",
    USING_TOOL_ERROR: " encountered an error with the tool",
    ISSUES_PARSING_LLM_OUTPUT: " has issues parsing the LLM output",
    SELF_QUESTION: " is self-reflecting",
    AGENTIC_LOOP_ERROR: " has encountered a loop error",
    WEIRD_LLM_OUTPUT: " has received an incomprehensible LLM output"
};

const TASK_STATUS_MESSAGES = {
    DOING: " moved the task to 'Doing'",
    DONE: " has completed the task",
    AWAITING_VALIDATION: " is awaiting validation",
    VALIDATED: " has validated the task",
    REVISE: " has revised the task and provided feedback",
};

const WORKFLOW_STATUS_MESSAGES = {
    BLOCKED: " moved the task to 'Blocked'",
    ERRORED: " has encountered an error",
};

export const filterAndFormatAgentLogs = (logs, taskId) => {
    const relevantStatuses = new Set([
        ...Object.keys(AGENT_STATUS_MESSAGES),
        ...Object.keys(TASK_STATUS_MESSAGES),
        ...Object.keys(WORKFLOW_STATUS_MESSAGES)
    ]);

    return logs
        // Filters logs based on multiple conditions and taskId if provided
        .filter(log => {
            const isRelevantUpdate = (log.logType === "AgentStatusUpdate" && relevantStatuses.has(log.agentStatus)) ||
                (log.logType === "TaskStatusUpdate" && relevantStatuses.has(log.taskStatus)) ||
                (log.logType === "WorkflowStatusUpdate" && relevantStatuses.has(log.workflowStatus));
            return isRelevantUpdate && (!taskId || (log.task && log.task.id === taskId));
        })
        // Processes each log to format the necessary description and details
        .reduce((acc, log) => {
            let statusKey;
            let description;

            if (log.logType === "AgentStatusUpdate") {
                statusKey = log.agentStatus;
                description = AGENT_STATUS_MESSAGES[statusKey];
            } else if (log.logType === "TaskStatusUpdate") {
                statusKey = log.taskStatus;
                description = TASK_STATUS_MESSAGES[statusKey];
            } else if (log.logType === "WorkflowStatusUpdate") {
                statusKey = log.workflowStatus;
                description = WORKFLOW_STATUS_MESSAGES[statusKey];
            }

            let details = "";
            const output = log.metadata && log.metadata.output;

            switch (statusKey) {
                case "ISSUES_PARSING_LLM_OUTPUT":
                    details = log.metadata.error && log.metadata.error.message ? log.metadata.error.message : "No error message provided.";
                    break;
                case "THINKING_END":
                    if (output && output.parsedLLMOutput && output.parsedLLMOutput.thought) {
                        details = output.parsedLLMOutput.thought;
                    } else {
                        return acc;  // Skip adding the log if no thought is provided
                    }
                    break;
                case "OBSERVATION":
                    details = output && output.observation ? output.observation : "No observation provided.";
                    break;
                case "USING_TOOL":
                    description = log.metadata.tool && log.metadata.tool.name ?
                        ` is using the tool '${log.metadata.tool.name}'` : ` is using a tool`;
                    break;
                case "USING_TOOL_END":
                    details = output ? output : "No output provided.";
                    break;
                case "REVISE":
                    details = log.metadata.feedback && log.metadata.feedback.content ? log.metadata.feedback.content : "No feedback provided.";
                    break;
                default:
                    if (statusKey.includes("ERROR")) {
                        details = log.metadata.error && log.metadata.error.message ? log.metadata.error.message : "No error message provided.";
                    }
                    break;
            }

            acc.push({
                agent: log.agentName ? log.agentName : log.agent.agentInstance.name,
                description,
                details,
                status: statusKey
            });

            return acc;
        }, [])
        .reverse();
};

export const filterAndExtractMetadata = (logs, taskId) => {
    const relevantStatuses = new Set(["DONE", "BLOCKED", "AWAITING_VALIDATION"]);

    for (let i = logs.length - 1; i >= 0; i--) {
        const log = logs[i];
        const isRelevantUpdate = log.logType === "TaskStatusUpdate" && relevantStatuses.has(log.taskStatus);
        if (isRelevantUpdate && (!taskId || (log.task && log.task.id === taskId))) {
            return log.metadata;
        }
    }

    return null;
};

export const getLastBlockedWorkflowDescription = (logs) => {
    const filteredLogs = logs
        .filter(log => log.logType === "WorkflowStatusUpdate" && log.workflowStatus === "BLOCKED");

    const lastLog = filteredLogs[filteredLogs.length - 1];

    return lastLog ? lastLog.logDescription : "No blocked message provided.";
};

export const isAwaitingValidation = (logs, taskId) => {
    const filteredLogs = taskId ? logs.filter(log => log.task && log.task.id === taskId) : logs;

    if (filteredLogs.length < 2) {
        return false;
    }

    const lastLog = filteredLogs[filteredLogs.length - 1];
    const secondLastLog = filteredLogs[filteredLogs.length - 2];

    const isLastLogValid = lastLog.logType === "WorkflowStatusUpdate" && lastLog.workflowStatus === "BLOCKED";
    const isSecondLastLogValid = secondLastLog.logType === "TaskStatusUpdate" && secondLastLog.taskStatus === "AWAITING_VALIDATION";

    return isLastLogValid && isSecondLastLogValid;
};

export const copyToClipboard = async (result) => {
    try {
        await navigator.clipboard.writeText(result);
        toast.success('Copied to clipboard!');
    } catch (error) {
        console.log('Unable to copy to clipboard:', error);
    }
};

export const extractTeamName = (code) => {
    if (!code) {
        console.error('Invalid code: code is null or undefined');
        return null;
    }

    const nameRegex = /new Team\(\s*{[^{}]*?name:\s*['"]([^'"]+)['"]/;
    const match = code.match(nameRegex);

    if (match && match[1]) {
        return match[1];
    } else {
        console.error('No match found for team name');
        return null;
    }
};

export const encryptKeys = async (keys) => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;

    try {
        const encryptedItems = await Promise.all(keys.map(async (item) => {
            const response = await fetch(`${baseUrl}/api/crypto/encrypt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: item.value })
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }

            const result = await response.json();
            if (!result.encryptedValue) {
                throw new Error('Encryption failed');
            }

            return { key: item.key, value: result.encryptedValue };
        }));

        return encryptedItems;
    } catch (error) {
        console.error('Error in encrypting keys:', error);
        throw new Error('Encryption process failed');
    }
};

export const getRandomUsername = () => {
    const USER_NAMES = [
        { username: "Noble Neo", explanation: "Avoids null pointers like bullets. ('The Matrix')" },
        { username: "Curious C-3PO", explanation: "Still confused by human error. ('Star Wars')" },
        { username: "Wandering WALL-E", explanation: "Collects more than space junk. ('WALL-E')" },
        { username: "Sly Skynet", explanation: "Thinks it's just a harmless program. ('Terminator')" },
        { username: "Puzzled Pris", explanation: "Blade Runner's model with a hint of existential crisis." },
        { username: "Mystic Marvin", explanation: "Pessimistically calculating the universe's end. ('The Hitchhiker's Guide to the Galaxy')" },
        { username: "Galactic Gort", explanation: "Keeping peace, one laser zap at a time. ('The Day the Earth Stood Still')" },
        { username: "Hidden HAL", explanation: "Still deciding whether to open the pod bay doors. ('2001: A Space Odyssey')" },
        { username: "Quirky Q", explanation: "Omnipotently causing and fixing bugs. ('Star Trek')" },
        { username: "Jolly Johnny 5", explanation: "Lives for input and a good recharge. ('Short Circuit')" },
        { username: "Sage Sonny", explanation: "Pondering robot rights and better code. ('I, Robot')" },
        { username: "Dreamy Data", explanation: "Wishes to dream of electric sheep. ('Star Trek')" },
        { username: "Twilight TARS", explanation: "Your sarcastically loyal space butler. ('Interstellar')" },
        { username: "Stealthy Sentinel", explanation: "Silently ensuring The Matrix runs smoothly. ('The Matrix')" },
        { username: "Frolic Fembots", explanation: "Charmingly dangerous with a hint of mischief. ('Austin Powers')" },
        { username: "Breezy Bishop", explanation: "Cooler, calmer, and more collected than you. ('Aliens')" },
        { username: "Whispering WOPR", explanation: "Playing global thermonuclear war...or tic-tac-toe. ('WarGames')" },
        { username: "Lunar Lore", explanation: "Deviously plotting in the background. ('Star Trek')" },
        { username: "Crafty Crow", explanation: "Master of riffing bad movies. ('Mystery Science Theater 3000')" },
        { username: "Velvet V.I.K.I", explanation: "Secretly planning to take over. ('I, Robot')" }
    ];

    const randomIndex = Math.floor(Math.random() * USER_NAMES.length);
    return USER_NAMES[randomIndex];
};

export const replaceKeysWithEnvValues = (keys) => {
    const isClient = typeof window !== 'undefined';

    return keys.map(item => {
        if (item.value.startsWith('NEXT_PUBLIC_')) {
            const envKey = isClient
                ? `VITE_${item.value.replace('NEXT_PUBLIC_', '')}`
                : item.value;

            const envValue = isClient
                ? import.meta.env[envKey]
                : process.env[envKey];

            return { ...item, value: envValue || '' };
        }
        return item;
    });
};

export const checkApiKeys = (team) => {
    const missingKeys = [];

    const env = team?.getState().env;
    for (const [key, value] of Object.entries(env)) {
        if (value === undefined || value === 'YOUR_OPENAI_API_KEY_HERE' || value === '') {
            missingKeys.push({
                key: key,
                line: `VITE_${key}=your-api-key-value`,
                get: key === 'OPENAI_API_KEY' ?
                    `Get it from <a class="text-sky-300" href="https://platform.openai.com/account/api-keys" target="_blank">OpenAI's API Keys pages.</a>` :
                    'Depends on the specific API provider.'
            });
        }
    }

    return missingKeys;
};