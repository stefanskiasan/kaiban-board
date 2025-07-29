export const orchestration09GenerationOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define task generation focused team
const productManager = new Agent({
  name: 'Alex',
  role: 'Product Manager',
  goal: 'Identify system gaps and define comprehensive task requirements.',
  background: 'Product management specialist with expertise in requirement analysis and task definition.',
  tools: []
});

const seniorDeveloper = new Agent({
  name: 'Sam',
  role: 'Senior Developer',
  goal: 'Implement task generation systems and validate technical feasibility.',
  background: 'Senior developer with expertise in system automation and workflow generation.',
  tools: []
});

const systemAnalyst = new Agent({
  name: 'Jordan',
  role: 'System Analyst',
  goal: 'Analyze workflows and optimize task generation processes.',
  background: 'System analyst with expertise in workflow optimization and process automation.',
  tools: []
});

// Define task generation project tasks
const gapAnalysisTask = new Task({
  description: 'Conduct comprehensive gap analysis to identify missing functionality and tasks',
  expectedOutput: 'Detailed gap analysis report with identified missing tasks and priority recommendations',
  agent: productManager,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-5 hours',
    skillsRequired: ['gap_analysis', 'requirement_gathering', 'priority_assessment'],
    dependencies: []
  }
});

const taskGenerationSystemTask = new Task({
  description: 'Build automated task generation system with intelligent task creation',
  expectedOutput: 'Automated task generation system with intelligent task creation and validation',
  agent: seniorDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '6-7 hours',
    skillsRequired: ['automation_development', 'task_generation', 'system_integration'],
    dependencies: ['gap_analysis']
  }
});

const taskValidationTask = new Task({
  description: 'Implement task validation and refinement system for generated tasks',
  expectedOutput: 'Task validation system with quality checks and refinement capabilities',
  agent: systemAnalyst,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-5 hours',
    skillsRequired: ['validation_systems', 'quality_assurance', 'task_refinement'],
    dependencies: ['task_generation_system']
  }
});

const workflowOptimizationTask = new Task({
  description: 'Optimize generated task workflows for maximum efficiency and coherence',
  expectedOutput: 'Optimized workflow system with intelligent task sequencing and dependency management',
  agent: systemAnalyst,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['workflow_optimization', 'dependency_management', 'process_improvement'],
    dependencies: ['task_validation']
  }
});

const taskRepositoryTask = new Task({
  description: 'Create comprehensive task repository management system with categorization',
  expectedOutput: 'Task repository system with intelligent categorization and search capabilities',
  agent: seniorDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-5 hours',
    skillsRequired: ['repository_management', 'categorization_systems', 'search_optimization'],
    dependencies: ['workflow_optimization']
  }
});

// Create team with task generation orchestration
const team = new Team({
  name: 'Task Generation Team',
  agents: [
    productManager,
    seniorDeveloper,
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
    gapAnalysisTask,
    taskGenerationSystemTask,
    taskValidationTask,
    workflowOptimizationTask,
    taskRepositoryTask
  ],
  
  allowTaskGeneration: false,

  // Use initial-only orchestration for systematic task generation
  continuousOrchestration: false,

  // Use skills-based distribution
  workloadDistribution: 'skills-based',

  orchestrationStrategy: \`
    You are orchestrating a task generation project focused on intelligent task creation and workflow optimization.
    
    PROJECT SCOPE:
    - Comprehensive gap analysis for missing functionality
    - Automated task generation with intelligent creation
    - Task validation and quality refinement systems
    - Workflow optimization with dependency management
    - Task repository with intelligent categorization
    
    TEAM COORDINATION:
    - Product Manager identifies gaps and defines requirements
    - Senior Developer builds task generation automation
    - System Analyst optimizes workflows and validation
    
    PRIORITIES:
    - Start with thorough gap analysis
    - Build intelligent task generation system
    - Implement comprehensive task validation
    - Optimize workflows for maximum efficiency
    - Create organized task repository system
    
    CONSTRAINTS:
    - Focus on intelligent and automated task creation
    - Ensure generated tasks are actionable and well-defined
    - Maintain task quality through validation systems
    - Optimize for workflow coherence and efficiency
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