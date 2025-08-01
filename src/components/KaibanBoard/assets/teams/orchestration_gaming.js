export const orchestrationGamingOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Custom Game Development Tools
class GameBalancerTool {
  constructor() {
    this.name = 'game_balancer';
    this.description = 'Analyze and balance game mechanics';
  }

  async invoke(input) {
    const { mechanic, currentValues } = input;
    return JSON.stringify({
      mechanic,
      balanceScore: Math.random() * 0.3 + 0.6,
      issues: ['DPS too high for warrior class', 'Healing potions too common'],
      suggestions: {
        damageReduction: '15%',
        healingCooldown: '30 seconds',
        dropRates: 'Reduce by 20%'
      },
      playerFeedback: 'Players report combat feels unbalanced'
    });
  }
}

class PlaytestAnalyzerTool {
  constructor() {
    this.name = 'playtest_analyzer';
    this.description = 'Analyze playtest data and player feedback';
  }

  async invoke(input) {
    const { testGroup, metrics } = input;
    return JSON.stringify({
      testGroup,
      sessionLength: '45 minutes average',
      completionRate: '72%',
      funScore: 8.2,
      frustrationPoints: ['Boss fight difficulty spike', 'Unclear objectives in level 3'],
      recommendations: ['Adjust difficulty curve', 'Add tutorial hints']
    });
  }
}

// Create game development agents
const gameDesignerAgent = new Agent({
  name: 'Alex Kim',
  role: 'Lead Game Designer',
  goal: 'Create engaging, balanced gameplay experiences',
  background: 'Veteran designer with 10+ shipped titles',
  tools: [new GameBalancerTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.7, // Higher creativity for game design
  },
});

const levelDesignerAgent = new Agent({
  name: 'Sarah Chen',
  role: 'Level Designer',
  goal: 'Design memorable, well-paced game levels',
  background: 'Specialist in action-adventure level design',
  tools: [],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.6,
  },
});

const qaLeadAgent = new Agent({
  name: 'Tom Wilson',
  role: 'QA Lead',
  goal: 'Ensure bug-free, polished gaming experience',
  background: 'QA expert with focus on player experience',
  tools: [new PlaytestAnalyzerTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.3,
  },
});

// Game development task repository
const gameTaskRepository = [
  new Task({
    title: 'Core Mechanics Design',
    description: 'Design and prototype core gameplay mechanics',
    expectedOutput: 'Playable prototype with core mechanics',
    agent: gameDesignerAgent,
    adaptable: true,
    splitStrategy: 'auto',
    priority: 'critical',
  }),
  new Task({
    title: 'Level Design - World 1',
    description: 'Create first world levels with progression',
    expectedOutput: '5 polished levels with increasing difficulty',
    agent: levelDesignerAgent,
    adaptable: true,
    mergeCompatible: ['level-world-2', 'level-world-3'],
    priority: 'high',
  }),
  new Task({
    title: 'Playtesting Round 1',
    description: 'Conduct initial playtesting with focus group',
    expectedOutput: 'Playtest report with actionable feedback',
    agent: qaLeadAgent,
    adaptable: false,
    priority: 'medium',
  }),
  new Task({
    title: 'Balance Tuning',
    description: 'Fine-tune game balance based on metrics',
    expectedOutput: 'Balanced gameplay with smooth difficulty curve',
    agent: gameDesignerAgent,
    adaptable: true,
    dynamicPriority: true,
    priority: 'high',
  }),
];

// Game project inputs
const gameInputs = {
  gameDetails: {
    title: 'Mystic Legends: Shadow Realm',
    genre: 'Action RPG',
    platform: ['PC', 'PlayStation', 'Xbox'],
    targetAudience: 'Teen to Adult',
  },
  designGoals: {
    corePillars: ['Exploration', 'Combat', 'Character Progression'],
    uniqueFeatures: ['Dynamic weather system', 'Branching storylines', 'Co-op mode'],
    monetization: 'Premium with DLC',
    targetMetacritic: 85,
  },
  development: {
    phase: 'Alpha',
    teamSize: 25,
    timeline: '18 months to release',
    budget: 3500000,
  },
  techStack: {
    engine: 'Unreal Engine 5',
    version: '5.3',
    middleware: ['Wwise Audio', 'Havok Physics'],
  },
};

// Create team with innovative mode and AI-driven prioritization
const gameTeam = new Team({
  name: 'Indie Game Development Team',
  agents: [gameDesignerAgent, levelDesignerAgent, qaLeadAgent],
  tasks: [],
  inputs: gameInputs,
  
  // ===== UNIQUE CONFIGURATION: Innovative mode with learning =====
  enableOrchestration: true,
  continuousOrchestration: true,
  backlogTasks: gameTaskRepository,
  allowTaskGeneration: true,
  
  orchestrationStrategy: \`
    You are orchestrating an innovative game development team creating a new IP.
    
    CREATIVE VISION:
    - Push boundaries while maintaining fun factor
    - Iterate based on player feedback
    - Balance innovation with proven mechanics
    - Adapt to emerging trends and feedback
    
    DEVELOPMENT APPROACH:
    - Rapid prototyping and iteration
    - Data-driven design decisions
    - Player-first mentality
    - Flexible scope based on what works
    
    QUALITY TARGETS:
    - Fun factor: Must score 8+ in playtests
    - Polish level: AAA quality despite indie budget
    - Innovation: At least one industry-first feature
  \`,
  
  mode: 'innovative', // Encourage creative solutions
  maxActiveTasks: 6,
  taskPrioritization: 'ai-driven', // Let AI optimize based on playtest data
  workloadDistribution: 'skills-based',
  
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.6, // Higher for creative decisions
  },
  
  env: {
    OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'
  }
});

console.log('Game Development Team configured');
console.log('Game:', gameInputs.gameDetails.title);
console.log('Genre:', gameInputs.gameDetails.genre);
console.log('Mode: Innovative with AI-driven prioritization');
console.log('Task Generation: Enabled for creative development');
`,
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'KaibanJS Gaming Example',
  };
};