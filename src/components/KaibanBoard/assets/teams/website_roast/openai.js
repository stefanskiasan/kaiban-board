export const websiteRoastOpenai = () => {
    return {
        code: `
import { Agent, Task, Team } from 'kaibanjs';
import { Firecrawl } from '@kaibanjs/tools';

// Configure Firecrawl tool
const firecrawlTool = new Firecrawl({
    apiKey: 'ENV_FIRECRAWL_API_KEY',
    format: 'markdown'
});

// Content Analyzer Agent
const contentAnalyzer = new Agent({
    name: 'CriticEye',
    role: 'Content Auditor',
    goal: 'Ruthlessly analyze website content and structure with a critical eye',
    background: 'Professional content critic with a sharp eye for absurdity',
    tools: [firecrawlTool]
});

// Roast Writer Agent
const roastWriter = new Agent({
    name: 'BurnMaster',
    role: 'Comedy Roaster',
    goal: 'Transform website analysis into savage but hilarious burns',
    background: 'Stand-up comedian specializing in tech and content roasts',
    tools: []
});

// Analysis Task
const analyzeContentTask = new Task({
    description: 'Fetches web content from the followin URL: {url} and provides a structured summary',
    expectedOutput: 'A well-formatted analysis of the website content',
    agent: contentAnalyzer
});

// Roasting Task
const createRoastTask = new Task({
    description: \`Take the analysis and turn it into a comedy roast that:
    - Delivers sick burns about the content
    - Mocks any corporate buzzword bingo
    - Roasts confusing site structure
    - Points out hilarious content fails
    - Makes fun of obvious SEO attempts
    
    Rules:
    - Keep it funny but not mean-spirited
    - Focus on content and structure
    - No personal attacks
    - Include constructive criticism
    
    Format as a stand-up comedy routine in markdown.\`,
    expectedOutput: \`A hilarious website roast that's both funny and helpful\`,
    agent: roastWriter,
    dependencies: [analyzeContentTask]
});

// Create the team
const team = new Team({
    name: 'Website Roast Masters',
    agents: [contentAnalyzer, roastWriter],
    tasks: [analyzeContentTask, createRoastTask],
    inputs: {
        url: 'YOUR_WEBSITE_URL'
    },
    env: {
        OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'
    }
});

team.start();
`,
        keys: [
            { key: "ENV_OPENAI_API_KEY", value: "NEXT_PUBLIC_OPENAI_API_KEY" },
            { key: "ENV_FIRECRAWL_API_KEY", value: "NEXT_PUBLIC_FIRECRAWL_API_KEY" }
        ],
        user: 'AI Champions Team'
    };
};