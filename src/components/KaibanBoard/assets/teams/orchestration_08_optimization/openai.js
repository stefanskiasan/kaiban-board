export const orchestration08OptimizationOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define optimization-focused development team
const performanceLead = new Agent({
  name: 'Alex',
  role: 'Performance Lead',
  goal: 'Lead system optimization initiatives and performance engineering.',
  background: 'Performance engineering specialist with expertise in system optimization and scalability.',
  tools: []
});

const systemOptimizer = new Agent({
  name: 'Sam',
  role: 'System Optimizer',
  goal: 'Optimize system performance, resource usage, and efficiency.',
  background: 'System optimization expert with expertise in performance tuning and resource management.',
  tools: []
});

const dataEngineer = new Agent({
  name: 'Jordan',
  role: 'Data Engineer',
  goal: 'Optimize data processing, storage, and retrieval systems.',
  background: 'Data engineering specialist with expertise in database optimization and data pipeline efficiency.',
  tools: []
});

// Define optimization project tasks with performance focus
const performanceAnalysisTask = new Task({
  description: 'Conduct comprehensive performance analysis and identify optimization opportunities',
  expectedOutput: 'Detailed performance analysis report with optimization recommendations and benchmarks',
  agent: performanceLead,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-5 hours',
    skillsRequired: ['performance_analysis', 'benchmarking', 'system_profiling'],
    dependencies: []
  }
});

const systemOptimizationTask = new Task({
  description: 'Implement system-level optimizations for improved performance and efficiency',
  expectedOutput: 'Optimized system with improved performance metrics and resource utilization',
  agent: systemOptimizer,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '6-7 hours',
    skillsRequired: ['system_optimization', 'performance_tuning', 'resource_management'],
    dependencies: ['performance_analysis']
  }
});

const databaseOptimizationTask = new Task({
  description: 'Optimize database queries, indexes, and data structures for maximum efficiency',
  expectedOutput: 'Optimized database with improved query performance and data access patterns',
  agent: dataEngineer,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['database_optimization', 'query_tuning', 'index_optimization'],
    dependencies: ['performance_analysis']
  }
});

const cacheOptimizationTask = new Task({
  description: 'Implement and optimize caching strategies for improved response times',
  expectedOutput: 'Comprehensive caching system with optimized cache strategies and hit rates',
  agent: systemOptimizer,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-5 hours',
    skillsRequired: ['cache_optimization', 'caching_strategies', 'memory_management'],
    dependencies: ['system_optimization', 'database_optimization']
  }
});

const performanceValidationTask = new Task({
  description: 'Validate optimization results through comprehensive performance testing',
  expectedOutput: 'Performance validation report with before/after metrics and improvement documentation',
  agent: performanceLead,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '3-4 hours',
    skillsRequired: ['performance_testing', 'metrics_validation', 'optimization_verification'],
    dependencies: ['cache_optimization']
  }
});

// Create team with optimization orchestration
const team = new Team({
  name: 'Performance Optimization Team',
  agents: [
    performanceLead,
    systemOptimizer,
    dataEngineer
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
    performanceAnalysisTask,
    systemOptimizationTask,
    databaseOptimizationTask,
    cacheOptimizationTask,
    performanceValidationTask
  ],
  
  allowTaskGeneration: false,

  // Use initial-only orchestration for systematic optimization
  continuousOrchestration: false,

  // Use skills-based distribution
  workloadDistribution: 'skills-based',

  orchestrationStrategy: \`
    You are orchestrating a comprehensive performance optimization project focused on system efficiency.
    
    PROJECT SCOPE:
    - System-wide performance optimization
    - Database and query optimization
    - Caching strategy implementation
    - Resource utilization improvement
    - Performance validation and benchmarking
    
    TEAM COORDINATION:
    - Performance Lead drives optimization strategy
    - System Optimizer implements system-level improvements
    - Data Engineer optimizes data layer performance
    
    PRIORITIES:
    - Start with comprehensive performance analysis
    - Implement system-level optimizations first
    - Optimize database and data access patterns
    - Add strategic caching for improved response times
    - Validate all optimizations with measurable metrics
    
    CONSTRAINTS:
    - Focus on measurable performance improvements
    - Maintain system stability during optimization
    - Prioritize high-impact optimizations first
    - Document all changes for future reference
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