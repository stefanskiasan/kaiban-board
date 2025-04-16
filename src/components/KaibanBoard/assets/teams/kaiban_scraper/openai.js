export const kaibanScraperOpenai = () => {
  return {
    code: `
    import { Agent, Task, Team } from 'kaibanjs';
    import { JinaUrlToMarkdown } from '@kaibanjs/tools';

const jinaUrlToMarkdownTool = new JinaUrlToMarkdown({
  // apiKey: import.meta.env.VITE_JINA_API_KEY,
  // options: {
  //   targetSelector: ['body', '.class', '#id'],
  //   retainImages: 'none',
  // },
});

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args


// Create an agent with the firecrawl tool
const webResearcher = new Agent({
  name: 'Web Researcher',
  role: 'Web Content Analyzer',
  goal: 'Extract and analyze content from specified websites',
  tools: [jinaUrlToMarkdownTool],
});

// Create a research task
const webAnalysisTask = new Task({
  description:
    'Fetches web content from the followin URL: {url} and provides a structured summary',
  agent: webResearcher,
  expectedOutput: 'A well-formatted analysis of the website content',
});

// Create the team
const team = new Team({
  name: 'Web Analysis Unit',
  description: 'Specialized team for web content extraction and analysis',
  agents: [webResearcher],
  tasks: [webAnalysisTask],
  inputs: {
    url: 'https://www.kaibanjs.com',
  },
  env: {
    OPENAI_API_KEY: 'ENV_OPENAI_API_KEY',
  },
});

team.start();
`,
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'AI Champions Team',
  };
};
