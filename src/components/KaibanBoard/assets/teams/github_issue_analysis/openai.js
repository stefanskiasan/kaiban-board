export const githubIssueAnalysisOpenai = () => {
    return {
        code: `
import { Agent, Task, Team } from 'kaibanjs';
import { GithubIssues } from '@kaibanjs/tools';

// Define GitHub tool
const githubTool = new GithubIssues({
    limit: 10
});

// Define agents
const issueCollector = new Agent({
    name: 'Luna',
    role: 'Issue Collector',
    goal: 'Gather and organize GitHub issues efficiently',
    background: 'Specialized in data collection and organization from GitHub repositories',
    tools: [githubTool]
});

const rootCauseAnalyst = new Agent({
    name: 'Atlas',
    role: 'Root Cause Analyst',
    goal: 'Analyze issues and identify underlying patterns and root causes',
    background: 'Expert in problem analysis and systematic issue investigation',
    tools: [githubTool]
});

// Define tasks
const issueCollectionTask = new Task({
    description: \`Collect and list GitHub issues from the following repository: {repository}.
    Format the issues in markdown with:
    - Issue title as heading
    - Labels, assignees, and status as badges
    - Issue body as quoted text
    - Creation date and last update
    Include metadata like total count and status distribution.\`,
    expectedOutput: 'Markdown formatted list of GitHub issues with metadata summary',
    agent: issueCollector
});

const analysisTask = new Task({
    description: \`Create a markdown report that includes:
    
    1. Executive Summary:
       - Total number of issues
       - Distribution by labels
       - Top recurring patterns
    
    2. Root Cause Analysis:
       - Common patterns identified
       - Underlying causes
       - Impact assessment
    
    3. Recommendations:
       - Immediate actions
       - Long-term preventive measures
       - Priority order
    
    Format everything in clean markdown with appropriate headers, lists, and emphasis.\`,
    expectedOutput: 'Comprehensive markdown report with summary, analysis, and recommendations',
    agent: rootCauseAnalyst
});

// Create team
const team = new Team({
    name: 'GitHub Issue Analysis Team',
    agents: [issueCollector, rootCauseAnalyst],
    tasks: [issueCollectionTask, analysisTask],
    inputs: {
        repository: 'https://github.com/kaiban-ai/KaibanJS' // Replace with your target repository
    },
    env: {
        OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'
    }
});

team.start();
`,
        keys: [
            { key: "ENV_OPENAI_API_KEY", value: "NEXT_PUBLIC_OPENAI_API_KEY" },
        ],
        user: 'AI Champions Team'
    };
};