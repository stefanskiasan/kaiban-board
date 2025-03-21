export const globalNewsOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';
import { Serper } from '@kaibanjs/tools';

// Configure Serper tool
const serperTool = new Serper({
  apiKey: 'ENV_SERPER_API_KEY',
  type: 'news',
});

const newsGatherer = new Agent({
  name: 'Echo',
  role: 'News Gatherer',
  goal: 'Collect all recent news articles about a specific event using diverse media sources.',
  background: 'Journalism',
  tools: [serperTool],
});

// Create Twitter thread writer agent
const twitterWriter = new Agent({
  name: 'ThreadMaster',
  role: 'Twitter Thread Creator',
  goal: 'Transform news into engaging, informative Twitter threads',
  background: 'Social media expert specializing in viral content and news synthesis',
  tools: [],
});

// Create gather news task
const gatherNewsTask = new Task({
  description:
    'Gather all relevant news articles about the event: {query}. Please use markdown format for the output.',
  expectedOutput:
    'A collection of links and summaries in markdown format of all articles related to the event.',
  agent: newsGatherer,
});

// Create Twitter thread task
const twitterThreadTask = new Task({
  description: \`Create a compelling Twitter thread based on the gathered news about {query}.
    Requirements:
    - Start with a hook tweet
    - Break down key developments into digestible tweets
    - Include relevant statistics and quotes
    - End with a thought-provoking conclusion
    - Keep each tweet under 280 characters
    - Number each tweet (1/X format)
    - Use appropriate emojis for engagement\`,
  expectedOutput: 'A formatted Twitter thread with numbered tweets',
  agent: twitterWriter,
  dependencies: [gatherNewsTask],
});

// Create and start the team
const team = new Team({
    name: 'Global News Report Team',
    agents: [newsGatherer, twitterWriter],
    tasks: [gatherNewsTask, twitterThreadTask],
    inputs: { query: '2024 US Presidential Election' },
    env: {OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'}
});

team.start();
`,
    keys: [
      { key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' },
      { key: 'ENV_SERPER_API_KEY', value: 'NEXT_PUBLIC_SERPER_API_KEY' },
    ],
    user: 'AI Champions Team',
  };
};
