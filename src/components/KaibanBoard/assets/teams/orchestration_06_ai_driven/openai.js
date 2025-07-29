export const orchestration06AiDrivenOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define AI-driven development team
const aiArchitect = new Agent({
  name: 'Alex',
  role: 'AI Architect',
  goal: 'Design and implement AI-driven systems with intelligent automation.',
  background: 'AI architecture specialist with expertise in machine learning systems and intelligent automation.',
  tools: []
});

const mlEngineer = new Agent({
  name: 'Sam',
  role: 'ML Engineer',
  goal: 'Develop and deploy machine learning models for intelligent decision making.',
  background: 'Machine learning engineer with expertise in model development and AI system integration.',
  tools: []
});

const dataScientist = new Agent({
  name: 'Jordan',
  role: 'Data Scientist',
  goal: 'Analyze data patterns and create intelligent insights for AI-driven decisions.',
  background: 'Data scientist with expertise in predictive analytics and intelligent data processing.',
  tools: []
});

// Define AI-driven project tasks with intelligent automation focus
const aiSystemDesignTask = new Task({
  description: 'Design AI-driven system architecture with intelligent decision-making capabilities',
  expectedOutput: 'Comprehensive AI system architecture with intelligent automation and decision workflows',
  agent: aiArchitect,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['ai_architecture', 'system_design', 'intelligent_automation'],
    dependencies: []
  }
});

const predictiveModelTask = new Task({
  description: 'Develop predictive models for intelligent task prioritization and resource allocation',
  expectedOutput: 'AI models for task prioritization with intelligent resource allocation algorithms',
  agent: mlEngineer,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '6-7 hours',
    skillsRequired: ['machine_learning', 'predictive_modeling', 'algorithm_development'],
    dependencies: ['ai_system_design']
  }
});

const intelligentAnalyticsTask = new Task({
  description: 'Create intelligent analytics system for real-time decision support',
  expectedOutput: 'AI-powered analytics dashboard with intelligent insights and recommendations',
  agent: dataScientist,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['data_analytics', 'intelligent_insights', 'real_time_processing'],
    dependencies: ['ai_system_design']
  }
});

const automatedOptimizationTask = new Task({
  description: 'Implement automated optimization system with AI-driven performance tuning',
  expectedOutput: 'Self-optimizing system with AI-driven performance improvements and automated tuning',
  agent: mlEngineer,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['automated_optimization', 'ai_performance_tuning', 'self_improving_systems'],
    dependencies: ['predictive_model', 'intelligent_analytics']
  }
});

const aiValidationTask = new Task({
  description: 'Validate AI system performance and intelligent decision accuracy',
  expectedOutput: 'AI system validation report with performance metrics and decision accuracy analysis',
  agent: aiArchitect,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-5 hours',
    skillsRequired: ['ai_validation', 'performance_metrics', 'decision_accuracy_analysis'],
    dependencies: ['automated_optimization']
  }
});

// Create team with AI-driven orchestration
const team = new Team({
  name: 'AI-Driven Development Team',
  agents: [
    aiArchitect,
    mlEngineer,
    dataScientist
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
    aiSystemDesignTask,
    predictiveModelTask,
    intelligentAnalyticsTask,
    automatedOptimizationTask,
    aiValidationTask
  ],
  
  allowTaskGeneration: false,

  // Use initial-only orchestration for AI system development
  continuousOrchestration: false,

  // Use skills-based distribution
  workloadDistribution: 'skills-based',

  orchestrationStrategy: \`
    You are orchestrating an AI-driven development project focused on intelligent automation and decision-making.
    
    PROJECT SCOPE:
    - AI-driven system architecture with intelligent automation
    - Predictive models for task prioritization and resource allocation
    - Intelligent analytics for real-time decision support
    - Automated optimization with AI-driven performance tuning
    - Comprehensive AI system validation and metrics
    
    TEAM COORDINATION:
    - AI Architect designs intelligent system architecture
    - ML Engineer develops predictive models and automation
    - Data Scientist creates intelligent analytics and insights
    
    PRIORITIES:
    - Start with comprehensive AI system architecture design
    - Develop predictive models for intelligent decision making
    - Create real-time analytics for intelligent insights
    - Implement automated optimization with AI-driven tuning
    - Validate AI system performance and decision accuracy
    
    CONSTRAINTS:
    - Focus on measurable intelligence improvements
    - Ensure AI decisions are explainable and transparent
    - Prioritize automated optimization over manual tuning
    - Maintain high accuracy in AI-driven decisions
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