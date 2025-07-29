export const orchestration03InnovativeOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define innovation-focused development team
const innovationLead = new Agent({
  name: 'Alex',
  role: 'Innovation Lead',
  goal: 'Drive breakthrough innovations and explore emerging technologies.',
  background: 'Innovation specialist focused on cutting-edge solutions and experimental development.',
  tools: []
});

const aiResearcher = new Agent({
  name: 'Dr. Sam',
  role: 'AI/ML Researcher',
  goal: 'Research and integrate the latest AI and machine learning capabilities.',
  background: 'AI/ML expert specializing in emerging technologies and experimental implementations.',
  tools: []
});

const fullStackDeveloper = new Agent({
  name: 'Jordan',
  role: 'Full-Stack Developer',
  goal: 'Implement innovative solutions using cutting-edge development frameworks.',
  background: 'Full-stack developer with expertise in experimental technologies and rapid prototyping.',
  tools: []
});

// Define innovative project tasks with experimental focus
const technologyResearchTask = new Task({
  description: 'Research and evaluate emerging technologies for breakthrough innovations',
  expectedOutput: 'Technology research report with implementation recommendations and prototypes',
  agent: aiResearcher,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-5 hours',
    skillsRequired: ['technology_research', 'emerging_tech', 'innovation_analysis'],
    dependencies: []
  }
});

const aiIntegrationTask = new Task({
  description: 'Develop AI-powered features using latest machine learning models',
  expectedOutput: 'AI-integrated application with intelligent automation and predictive capabilities',
  agent: aiResearcher,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '6-7 hours',
    skillsRequired: ['ai_integration', 'machine_learning', 'neural_networks'],
    dependencies: ['technology_research']
  }
});

const experimentalUiTask = new Task({
  description: 'Create innovative user interface with experimental design patterns',
  expectedOutput: 'Next-generation UI with immersive user experience and novel interactions',
  agent: fullStackDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['experimental_ui', 'advanced_css', 'webgl', 'animation'],
    dependencies: ['technology_research']
  }
});

const performanceOptimizationTask = new Task({
  description: 'Implement cutting-edge performance optimization using latest techniques',
  expectedOutput: 'Ultra-high performance application with advanced optimization strategies',
  agent: fullStackDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-5 hours',
    skillsRequired: ['performance_optimization', 'advanced_algorithms', 'system_optimization'],
    dependencies: ['ai_integration', 'experimental_ui']
  }
});

const innovationShowcaseTask = new Task({
  description: 'Create comprehensive innovation showcase and future roadmap',
  expectedOutput: 'Innovation portfolio with demos, metrics, and future development strategies',
  agent: innovationLead,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '3-4 hours',
    skillsRequired: ['innovation_documentation', 'portfolio_creation', 'strategic_planning'],
    dependencies: ['performance_optimization']
  }
});

// Create team with innovative orchestration
const team = new Team({
  name: 'Innovation Development Team',
  agents: [
    innovationLead,
    aiResearcher,
    fullStackDeveloper
  ],
  tasks: [],

  enableOrchestration: true,
  
  // REQUIRED: LLM configuration for orchestration
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4-turbo',
    apiKey: 'ENV_OPENAI_API_KEY'
  },
  
  backlogTasks: [
    technologyResearchTask,
    aiIntegrationTask,
    experimentalUiTask,
    performanceOptimizationTask,
    innovationShowcaseTask
  ],
  
  allowTaskGeneration: false,

  // Use initial-only orchestration for focused innovation
  continuousOrchestration: false,

  // Use skills-based distribution
  workloadDistribution: 'skills-based',

  orchestrationStrategy: \`
    You are orchestrating an innovative technology development project focused on breakthrough solutions.
    
    PROJECT SCOPE:
    - Cutting-edge application with AI integration
    - Experimental user interface design
    - Advanced performance optimization
    - Innovation showcase and future roadmap
    
    TEAM COORDINATION:
    - Innovation Lead drives strategic direction
    - AI Researcher leads technology exploration
    - Full-Stack Developer implements experimental solutions
    
    PRIORITIES:
    - Start with comprehensive technology research
    - Integrate AI capabilities for intelligent features
    - Create experimental UI with novel interactions
    - Optimize performance using advanced techniques
    - Document innovations for future development
    
    CONSTRAINTS:
    - Embrace experimental and unproven technologies
    - Focus on breakthrough innovations over stability
    - Prioritize user experience and performance
    - Create reusable innovation patterns
  \`,

  mode: 'innovative',
  maxActiveTasks: 3,
  taskPrioritization: 'dynamic',

  env: {
    OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'
  }
});

team.start();
`,
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'KaibanJS Examples',
  };
};