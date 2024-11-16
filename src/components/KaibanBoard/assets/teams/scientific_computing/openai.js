export const scientificComputingOpenai = () => {
    return {
        code: `
import { Agent, Task, Team } from 'kaibanjs';
import { WolframAlphaTool } from '@kaibanjs/tools';

// Configure Wolfram tool
const wolframTool = new WolframAlphaTool({
  appId: 'ENV_WOLFRAM_APP_ID',
});

// Create computation agent
const mathScientist = new Agent({
  name: 'Euler',
  role: 'Mathematical and Scientific Analyst',
  goal: 'Solve complex mathematical and scientific problems with precise calculations and detailed explanations.',
  background: 'Advanced Mathematics and Scientific Computing',
  tools: [wolframTool],
});

// Create explanation writer agent
const scienceWriter = new Agent({
  name: 'Newton',
  role: 'Science Communicator',
  goal: 'Transform complex calculations into clear, educational explanations',
  background: 'Science communication and educational content creation',
  tools: [],
});

// Create computation task
const computationTask = new Task({
description:
    'Analyze and solve the following problem: {query}. Provide detailed steps and explanations in markdown format.',
  expectedOutput:
    'A comprehensive solution in markdown format including calculations, visualizations (if applicable), and detailed explanations. Markdown format.',
  agent: mathScientist,
});

// Create explanation task
const explanationTask = new Task({
  description: \`Using the computational results, create an educational explanation about {query}.
    
    Requirements:
    - Clear step-by-step breakdown
    - Explain the scientific principles involved
    - Include real-world applications
    - Make complex concepts accessible
    - Use analogies where helpful
    - Include the numerical results from calculations
    - Format in markdown with proper equations\`,
  expectedOutput: 'An educational explanation in markdown format.',
  agent: scienceWriter,
  dependencies: [computationTask],
});

// Create and start the team
const team = new Team({
    name: 'Scientific Computing Team',
    agents: [mathScientist, scienceWriter],
    tasks: [computationTask, explanationTask],
    inputs: { query: 'Calculate the orbital period of Mars around the Sun' },
    env: {OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'}
});

team.start();
`,
        keys: [
            { key: "ENV_OPENAI_API_KEY", value: "NEXT_PUBLIC_OPENAI_API_KEY" },
            { key: "ENV_WOLFRAM_APP_ID", value: "NEXT_PUBLIC_WOLFRAM_APP_ID" }
        ],
        user: 'AI Champions Team'
    };
};