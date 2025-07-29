export const orchestration07AdaptationOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define adaptive development team
const adaptiveLead = new Agent({
  name: 'Alex',
  role: 'Adaptive Lead',
  goal: 'Guide team through changing requirements with flexible solutions.',
  background: 'Lead developer with expertise in agile methodologies and adaptive project management.',
  tools: []
});

const fullStackDeveloper = new Agent({
  name: 'Sam',
  role: 'Full-Stack Developer',
  goal: 'Build flexible and scalable solutions that adapt to changing needs.',
  background: 'Full-stack developer with expertise in modular architecture and rapid iteration.',
  tools: []
});

const systemAnalyst = new Agent({
  name: 'Jordan',
  role: 'System Analyst',
  goal: 'Analyze requirements and design adaptive system architectures.',
  background: 'System analyst with expertise in requirement analysis and flexible system design.',
  tools: []
});

// Define adaptive project tasks with flexibility focus
const requirementAnalysisTask = new Task({
  description: 'Analyze changing requirements and create flexible system design',
  expectedOutput: 'Comprehensive requirement analysis with adaptive architecture blueprint',
  agent: systemAnalyst,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '3-4 hours',
    skillsRequired: ['requirement_analysis', 'system_design', 'adaptive_architecture'],
    dependencies: []
  }
});

const modularDevelopmentTask = new Task({
  description: 'Build modular system components that can adapt to changing needs',
  expectedOutput: 'Flexible modular system with interchangeable components',
  agent: fullStackDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['modular_development', 'flexible_architecture', 'component_design'],
    dependencies: ['requirement_analysis']
  }
});

const iterativeRefinementTask = new Task({
  description: 'Implement iterative refinement process with continuous feedback loops',
  expectedOutput: 'Refined system with improved adaptability and user feedback integration',
  agent: adaptiveLead,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-5 hours',
    skillsRequired: ['iterative_development', 'feedback_integration', 'process_improvement'],
    dependencies: ['modular_development']
  }
});

const scalabilityOptimizationTask = new Task({
  description: 'Optimize system for scalability and future growth requirements',
  expectedOutput: 'Scalable system architecture with growth-ready infrastructure',
  agent: fullStackDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-5 hours',
    skillsRequired: ['scalability_optimization', 'performance_tuning', 'infrastructure_design'],
    dependencies: ['iterative_refinement']
  }
});

const adaptabilityValidationTask = new Task({
  description: 'Validate system adaptability through scenario testing and flexibility metrics',
  expectedOutput: 'Validated adaptive system with flexibility metrics and improvement recommendations',
  agent: systemAnalyst,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '3-4 hours',
    skillsRequired: ['adaptability_testing', 'scenario_validation', 'metrics_analysis'],
    dependencies: ['scalability_optimization']
  }
});

// Create team with adaptive orchestration
const team = new Team({
  name: 'Adaptive Development Team',
  agents: [
    adaptiveLead,
    fullStackDeveloper,
    systemAnalyst
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
    requirementAnalysisTask,
    modularDevelopmentTask,
    iterativeRefinementTask,
    scalabilityOptimizationTask,
    adaptabilityValidationTask
  ],
  
  allowTaskGeneration: false,

  // Use initial-only orchestration for adaptive workflow
  continuousOrchestration: false,

  // Use skills-based distribution
  workloadDistribution: 'skills-based',

  orchestrationStrategy: \`
    You are orchestrating an adaptive development project focused on flexibility and continuous evolution.
    
    PROJECT SCOPE:
    - Flexible system architecture with modular design
    - Adaptive components that evolve with requirements
    - Scalable infrastructure for future growth
    - Continuous improvement and feedback integration
    
    TEAM COORDINATION:
    - Adaptive Lead guides flexible development approach
    - Full-Stack Developer builds modular and scalable solutions
    - System Analyst ensures architectural adaptability
    
    PRIORITIES:
    - Start with thorough requirement analysis
    - Build modular components for flexibility
    - Implement iterative refinement processes
    - Optimize for scalability and growth
    - Validate adaptability through comprehensive testing
    
    CONSTRAINTS:
    - Design for change from the beginning
    - Maintain system flexibility at all times
    - Prioritize long-term adaptability over short-term gains
    - Ensure all components can evolve independently
  \`,

  mode: 'adaptive',
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