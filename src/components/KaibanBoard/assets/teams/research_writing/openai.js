export const researchWritingOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';
import { ExaSearch } from '@kaibanjs/tools';

// Configure Exa tool for research
const exaSearch = new ExaSearch({
apiKey: 'ENV_EXA_API_KEY',
type: 'neural',
contents: {
  text: true,
  summary: true,
  highlights: true
},
useAutoprompt: true,
limit: 10
});

// Research Agent
const researcher = new Agent({
name: 'DataMiner',
role: 'Research Specialist',
goal: 'Gather comprehensive information and data from reliable sources',
background: 'Expert in data collection and research methodology',
tools: [exaSearch]
});

// Writer Agent
const writer = new Agent({
name: 'Wordsmith',
role: 'Content Writer',
goal: 'Transform research data into engaging and informative content',
background: 'Experienced in creating compelling narratives and clear explanations',
tools: [] // Writer doesn't need search tools
});

// Research Task
const researchTask = new Task({
description:
    'Research and analyze the following topic: {query}. Focus on high-quality sources and recent developments. Please use markdown format for the output.',
  expectedOutput:
    'A detailed analysis in markdown format with insights from reputable sources, including academic papers and expert opinions.',
agent: researcher
});

// Writing Task
const writingTask = new Task({
description: \`Using the research provided, create a compelling {format} about {topic}.

Requirements:
- Clear structure with introduction, body, and conclusion
- Engaging writing style
- Include relevant citations
- Length: approximately 1000 words
- Use markdown formatting

Make it accessible to a general audience while maintaining accuracy.\`,
expectedOutput: 'A well-structured {format} in markdown format',
agent: writer,
dependencies: [researchTask] // Writer needs research results first
});

// Create and start the team
const team = new Team({
name: 'Research and Writing Team',
agents: [researcher, writer],
tasks: [researchTask, writingTask],
inputs: { 
    topic: 'The Impact of Artificial Intelligence on Modern Healthcare',
    format: 'essay' // Could be 'article', 'report', etc.
},
env: { OPENAI_API_KEY: 'ENV_OPENAI_API_KEY' }
});

team.start();
`,
    keys: [
        { key: "ENV_OPENAI_API_KEY", value: "NEXT_PUBLIC_OPENAI_API_KEY" },
        { key: "ENV_EXA_API_KEY", value: "NEXT_PUBLIC_EXA_API_KEY" }  
    ],
    user: 'AI Champions Team'
};
};