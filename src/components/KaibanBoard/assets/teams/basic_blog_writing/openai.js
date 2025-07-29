export const basicBlogWritingOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define agents
const contentResearcher = new Agent({
  name: 'Sarah',
  role: 'Content Researcher',
  goal: 'Research and gather comprehensive information on the given topic.',
  background: 'Research specialist with expertise in fact-finding and data analysis',
  tools: []
});

const blogWriter = new Agent({
  name: 'Marcus',
  role: 'Blog Writer',
  goal: 'Create engaging, well-structured blog posts that captivate readers.',
  background: 'Experienced content writer with expertise in SEO and storytelling',
  tools: []
});

const editor = new Agent({
  name: 'Emma',
  role: 'Content Editor',
  goal: 'Review and polish content for clarity, grammar, and engagement.',
  background: 'Professional editor with keen eye for detail and reader engagement',
  tools: []
});

// Define tasks
const researchTask = new Task({
  description: \`Research the topic "{topic}" thoroughly. 
  Gather key facts, statistics, expert opinions, and current trends.
  Identify the target audience and their pain points related to this topic.\`,
  expectedOutput: 'Comprehensive research brief with key insights and data points',
  agent: contentResearcher
});

const writingTask = new Task({
  description: \`Using the research provided, write a compelling blog post about "{topic}".
  Include an engaging headline, introduction that hooks the reader, 
  well-structured main content with subheadings, and a strong conclusion.
  Target word count: {wordCount} words.\`,
  expectedOutput: 'Complete blog post in markdown format with engaging content',
  agent: blogWriter
});

const editingTask = new Task({
  description: \`Review and edit the blog post for:
  - Grammar and spelling errors
  - Clarity and readability
  - Flow and structure
  - SEO optimization
  - Call-to-action effectiveness\`,
  expectedOutput: 'Polished, publication-ready blog post in markdown format',
  agent: editor
});

// Create the team
const team = new Team({
  name: 'Blog Writing Team',
  agents: [contentResearcher, blogWriter, editor],
  tasks: [researchTask, writingTask, editingTask],
  inputs: { 
    topic: 'The Future of Remote Work: Trends and Predictions for 2025',
    wordCount: '1200-1500'
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