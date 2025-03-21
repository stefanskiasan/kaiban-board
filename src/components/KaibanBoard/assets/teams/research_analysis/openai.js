export const researchAnalysisOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';
import { TavilySearchResults, Serper } from '@kaibanjs/tools';

// Define tools
const tavilyTool = new TavilySearchResults({
    apiKey: 'ENV_TAVILY_API_KEY',
    maxResults: 5,
});

const serperTool = new Serper({
    apiKey: 'ENV_SERPER_API_KEY',
    type: 'news',
});

// Define agents
const webResearcher = new Agent({
    name: 'WebResearcher',
    role: 'Information Gatherer',
    goal: 'Search for comprehensive information on the given topic.',
    background: 'Research',
    tools: [tavilyTool],
});

const newsAnalyzer = new Agent({
    name: 'NewsAnalyzer',
    role: 'News Observer',
    goal: 'Find recent news articles related to the topic.',
    background: 'Journalism',
    tools: [serperTool],
});

const reportCompiler = new Agent({
    name: 'ReportCompiler',
    role: 'Report Creator',
    goal: 'Compile and format the gathered research and news into a cohesive report.',
    background: 'Technical Writing',
});

// Define tasks
const webSearchTask = new Task({
    description: 'Use Tavily to gather detailed information on the topic: {topic}.',
    expectedOutput: 'A set of articles and informational pieces about the topic.',
    agent: webResearcher,
});

const newsSearchTask = new Task({
    description: 'Search for news related to the topic: {topic} between the dates: {dateRange}.',
    expectedOutput: 'A list of news articles and summaries regarding recent developments.',
    agent: newsAnalyzer,
});

const compileReportTask = new Task({
    description: 'Create a Markdown report incorporating data from the web: {taskResult:task1} and recent news: {taskResult:task2}.',
    expectedOutput: 'A Markdown formatted comprehensive report.',
    agent: reportCompiler,
});

// Define team
const team = new Team({
    name: 'Research Analysis Team',
    agents: [webResearcher, newsAnalyzer, reportCompiler],
    tasks: [webSearchTask, newsSearchTask, compileReportTask],
    inputs: { 
        topic: 'The impact of AI innovations in healthcare',
        dateRange: '01-01-2023 to 12-31-2023'
    },  
    env: { 
        OPENAI_API_KEY: 'ENV_OPENAI_API_KEY',
        TAVILY_API_KEY: 'ENV_TAVILY_API_KEY',
        SERPER_API_KEY: 'ENV_SERPER_API_KEY'
    }
});

team.start();
`,
    keys: [
      { key: 'ENV_TAVILY_API_KEY', value: 'NEXT_PUBLIC_TAVILY_API_KEY' },
      { key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' },
      { key: 'ENV_SERPER_API_KEY', value: 'NEXT_PUBLIC_SERPER_API_KEY' },
    ],
    user: 'AI Champions Team',
  };
};
