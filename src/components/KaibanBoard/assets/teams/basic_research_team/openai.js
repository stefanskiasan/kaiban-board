export const basicResearchTeamOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define agents
const primaryResearcher = new Agent({
  name: 'Dr. Lisa Chen',
  role: 'Primary Researcher',
  goal: 'Conduct thorough research and gather reliable information on any topic.',
  background: 'PhD in Information Science with expertise in academic and market research',
  tools: []
});

const factChecker = new Agent({
  name: 'Robert Kim',
  role: 'Fact Checker',
  goal: 'Verify information accuracy and identify reliable sources.',
  background: 'Former journalist with expertise in source verification and fact-checking',
  tools: []
});

const reportWriter = new Agent({
  name: 'Amanda Rodriguez',
  role: 'Research Report Writer',
  goal: 'Synthesize research findings into clear, actionable reports.',
  background: 'Technical writer specializing in research documentation and analysis',
  tools: []
});

// Define tasks
const initialResearchTask = new Task({
  description: \`Conduct comprehensive research on "{researchTopic}".
  Focus on:
  - Current state and trends
  - Key statistics and data points  
  - Expert opinions and perspectives
  - Challenges and opportunities
  - Future outlook and predictions\`,
  expectedOutput: 'Detailed research findings with sources and key insights',
  agent: primaryResearcher
});

const factCheckingTask = new Task({
  description: \`Review the research findings and:
  - Verify the accuracy of all claims and statistics
  - Check the credibility of sources cited
  - Identify any potential biases or gaps
  - Flag any questionable or unverified information
  - Suggest additional reliable sources if needed\`,
  expectedOutput: 'Fact-checked research with verification notes and source reliability assessment',
  agent: factChecker
});

const reportCompilationTask = new Task({
  description: \`Create a comprehensive research report that includes:
  - Executive summary with key findings
  - Detailed analysis organized by themes
  - Supporting data and statistics
  - Source bibliography
  - Conclusions and recommendations
  Format the report in clear, professional markdown.\`,
  expectedOutput: 'Complete research report in markdown format ready for presentation',
  agent: reportWriter
});

// Create the team
const team = new Team({
  name: 'Research Team',
  agents: [primaryResearcher, factChecker, reportWriter],
  tasks: [initialResearchTask, factCheckingTask, reportCompilationTask],
  inputs: { 
    researchTopic: 'Sustainable Energy Solutions for Small Businesses'
  },
  env: {
    OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'
  }
});

team.start();
`,
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'AI Champions Team',
  };
};