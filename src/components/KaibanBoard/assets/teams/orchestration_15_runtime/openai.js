export const orchestration15RuntimeOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define runtime orchestration control specialized team
const runtimeEngineer = new Agent({
  name: 'Alex',
  role: 'Runtime Engineer',
  goal: 'Design and implement runtime orchestration control systems with dynamic configuration.',
  background: 'Runtime engineering specialist with expertise in dynamic system control and real-time orchestration.',
  tools: []
});

const systemArchitect = new Agent({
  name: 'Sam',
  role: 'System Architect',
  goal: 'Architect scalable runtime orchestration systems with flexible configuration management.',
  background: 'System architecture specialist with expertise in runtime adaptability and configuration management.',
  tools: []
});

const monitoringSpecialist = new Agent({
  name: 'Jordan',
  role: 'Monitoring Specialist',
  goal: 'Implement comprehensive monitoring and observability for runtime orchestration systems.',
  background: 'Monitoring specialist with expertise in real-time system observability and performance tracking.',
  tools: []
});

// Define runtime orchestration project tasks
const runtimeControlSystemTask = new Task({
  description: 'Build runtime orchestration control system with dynamic configuration capabilities',
  expectedOutput: 'Runtime control system enabling dynamic orchestration configuration and real-time adjustments',
  agent: runtimeEngineer,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '6-7 hours',
    skillsRequired: ['runtime_engineering', 'dynamic_configuration', 'system_control'],
    dependencies: []
  }
});

const adaptiveArchitectureTask = new Task({
  description: 'Design adaptive architecture supporting runtime orchestration changes and scaling',
  expectedOutput: 'Adaptive system architecture with runtime flexibility and scalable orchestration patterns',
  agent: systemArchitect,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['adaptive_architecture', 'system_design', 'scalable_patterns'],
    dependencies: ['runtime_control_system']
  }
});

const realTimeMonitoringTask = new Task({
  description: 'Implement real-time monitoring system for orchestration performance and behavior',
  expectedOutput: 'Real-time monitoring system with orchestration metrics, alerts, and performance tracking',
  agent: monitoringSpecialist,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['real_time_monitoring', 'performance_tracking', 'alerting_systems'],
    dependencies: ['runtime_control_system']
  }
});

const configurationManagementTask = new Task({
  description: 'Create configuration management system for runtime orchestration parameter control',
  expectedOutput: 'Configuration management system with version control, rollback, and validation capabilities',
  agent: systemArchitect,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-5 hours',
    skillsRequired: ['configuration_management', 'version_control', 'validation_systems'],
    dependencies: ['adaptive_architecture', 'real_time_monitoring']
  }
});

const runtimeOptimizationTask = new Task({
  description: 'Implement runtime optimization engine with automated performance tuning',
  expectedOutput: 'Runtime optimization engine with automated tuning, performance analysis, and adaptation',
  agent: runtimeEngineer,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['runtime_optimization', 'automated_tuning', 'performance_analysis'],
    dependencies: ['configuration_management']
  }
});

// Create team with runtime orchestration control focus
const team = new Team({
  name: 'Runtime Orchestration Control Team',
  agents: [
    runtimeEngineer,
    systemArchitect,
    monitoringSpecialist
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
    runtimeControlSystemTask,
    adaptiveArchitectureTask,
    realTimeMonitoringTask,
    configurationManagementTask,
    runtimeOptimizationTask
  ],
  
  allowTaskGeneration: false,

  // Use continuous orchestration for runtime control demonstration
  continuousOrchestration: true,

  // Use skills-based distribution
  workloadDistribution: 'skills-based',

  orchestrationStrategy: \`
    You are orchestrating a runtime orchestration control project focused on dynamic system management and real-time adaptability.
    
    PROJECT SCOPE:
    - Runtime orchestration control system with dynamic configuration
    - Adaptive system architecture supporting real-time changes
    - Comprehensive real-time monitoring and performance tracking
    - Configuration management with version control and validation
    - Runtime optimization engine with automated performance tuning
    
    TEAM COORDINATION:
    - Runtime Engineer builds control systems and optimization engines
    - System Architect designs adaptive architecture and configuration management
    - Monitoring Specialist implements real-time monitoring and tracking
    
    PRIORITIES:
    - Start with runtime control system development
    - Design adaptive architecture for runtime flexibility
    - Implement comprehensive real-time monitoring
    - Create robust configuration management system
    - Build runtime optimization engine with automated tuning
    
    CONSTRAINTS:
    - Ensure zero-downtime configuration changes
    - Maintain system performance during runtime modifications
    - Implement comprehensive monitoring and alerting
    - Focus on automated optimization and intelligent adaptation
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