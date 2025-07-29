export const orchestration13ContinuousOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define continuous orchestration focused team
const orchestrationLead = new Agent({
  name: 'Alex',
  role: 'Orchestration Lead',
  goal: 'Manage continuous orchestration processes and workflow optimization.',
  background: 'Orchestration specialist with expertise in continuous workflow management and process optimization.',
  tools: []
});

const processEngineer = new Agent({
  name: 'Sam',
  role: 'Process Engineer',
  goal: 'Design and implement continuous improvement processes and automation.',
  background: 'Process engineering specialist with expertise in workflow automation and continuous improvement.',
  tools: []
});

const systemMonitor = new Agent({
  name: 'Jordan',
  role: 'System Monitor',
  goal: 'Monitor system performance and ensure continuous operation reliability.',
  background: 'System monitoring specialist with expertise in performance tracking and reliability engineering.',
  tools: []
});

// Define continuous orchestration project tasks
const continuousWorkflowTask = new Task({
  description: 'Implement continuous workflow orchestration with real-time task management',
  expectedOutput: 'Continuous orchestration system with real-time task allocation and workflow management',
  agent: orchestrationLead,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '6-7 hours',
    skillsRequired: ['continuous_orchestration', 'workflow_management', 'real_time_processing'],
    dependencies: []
  }
});

const automatedOptimizationTask = new Task({
  description: 'Build automated process optimization system with continuous improvement cycles',
  expectedOutput: 'Automated optimization system with continuous process improvement and performance tracking',
  agent: processEngineer,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '7-8 hours',
    skillsRequired: ['process_automation', 'continuous_improvement', 'optimization_algorithms'],
    dependencies: ['continuous_workflow']
  }
});

const realTimeMonitoringTask = new Task({
  description: 'Implement real-time system monitoring with automated alerting and response',
  expectedOutput: 'Real-time monitoring system with automated alerts, performance tracking, and response automation',
  agent: systemMonitor,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['real_time_monitoring', 'alerting_systems', 'automated_response'],
    dependencies: ['continuous_workflow']
  }
});

const adaptiveSchedulingTask = new Task({
  description: 'Create adaptive task scheduling system with dynamic resource allocation',
  expectedOutput: 'Adaptive scheduling system with intelligent resource allocation and load balancing',
  agent: processEngineer,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '6-7 hours',
    skillsRequired: ['adaptive_scheduling', 'resource_allocation', 'load_balancing'],
    dependencies: ['automated_optimization', 'real_time_monitoring']
  }
});

const continuousValidationTask = new Task({
  description: 'Implement continuous validation system with automated quality checks',
  expectedOutput: 'Continuous validation system with automated quality assurance and performance verification',
  agent: systemMonitor,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-5 hours',
    skillsRequired: ['continuous_validation', 'quality_assurance', 'automated_testing'],
    dependencies: ['adaptive_scheduling']
  }
});

// Create team with continuous orchestration
const team = new Team({
  name: 'Continuous Orchestration Team',
  agents: [
    orchestrationLead,
    processEngineer,
    systemMonitor
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
    continuousWorkflowTask,
    automatedOptimizationTask,
    realTimeMonitoringTask,
    adaptiveSchedulingTask,
    continuousValidationTask
  ],
  
  allowTaskGeneration: false,

  // Use continuous orchestration for ongoing workflow management
  continuousOrchestration: true,

  // Use skills-based distribution
  workloadDistribution: 'skills-based',

  orchestrationStrategy: \`
    You are orchestrating a continuous orchestration project focused on real-time workflow management and optimization.
    
    PROJECT SCOPE:
    - Continuous workflow orchestration with real-time management
    - Automated process optimization with improvement cycles
    - Real-time system monitoring with automated responses
    - Adaptive task scheduling with dynamic resource allocation
    - Continuous validation with automated quality assurance
    
    TEAM COORDINATION:
    - Orchestration Lead manages continuous workflow processes
    - Process Engineer builds automation and optimization systems
    - System Monitor ensures reliability and performance tracking
    
    PRIORITIES:
    - Start with continuous workflow orchestration implementation
    - Build automated optimization for continuous improvement
    - Implement comprehensive real-time monitoring
    - Create adaptive scheduling for dynamic resource management
    - Ensure continuous validation and quality assurance
    
    CONSTRAINTS:
    - Maintain 24/7 system availability and reliability
    - Ensure real-time responsiveness for all operations
    - Implement comprehensive monitoring and alerting
    - Focus on continuous improvement and optimization
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