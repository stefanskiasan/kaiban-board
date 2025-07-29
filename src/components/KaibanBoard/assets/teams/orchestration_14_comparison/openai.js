export const orchestration14ComparisonOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define orchestration comparison specialized team
const orchestrationAnalyst = new Agent({
  name: 'Alex',
  role: 'Orchestration Analyst',
  goal: 'Analyze and compare different orchestration strategies and implementations.',
  background: 'Orchestration analysis specialist with expertise in strategy comparison and performance evaluation.',
  tools: []
});

const performanceEngineer = new Agent({
  name: 'Sam',
  role: 'Performance Engineer',
  goal: 'Measure and compare orchestration performance across different strategies.',
  background: 'Performance engineering specialist with expertise in orchestration benchmarking and optimization.',
  tools: []
});

const strategyArchitect = new Agent({
  name: 'Jordan',
  role: 'Strategy Architect',
  goal: 'Design comparative frameworks and orchestration strategy recommendations.',
  background: 'Strategic architecture specialist with expertise in orchestration design patterns and comparative analysis.',
  tools: []
});

// Define orchestration comparison project tasks
const strategyComparisonTask = new Task({
  description: 'Compare different orchestration strategies and analyze their effectiveness',
  expectedOutput: 'Comprehensive orchestration strategy comparison with effectiveness analysis and recommendations',
  agent: orchestrationAnalyst,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['orchestration_analysis', 'strategy_comparison', 'effectiveness_evaluation'],
    dependencies: []
  }
});

const performanceBenchmarkTask = new Task({
  description: 'Benchmark performance across different orchestration approaches and configurations',
  expectedOutput: 'Performance benchmark results with detailed metrics and comparative analysis',
  agent: performanceEngineer,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '6-7 hours',
    skillsRequired: ['performance_benchmarking', 'orchestration_metrics', 'comparative_testing'],
    dependencies: ['strategy_comparison']
  }
});

const frameworkEvaluationTask = new Task({
  description: 'Evaluate orchestration frameworks and create comparative assessment matrix',
  expectedOutput: 'Framework evaluation matrix with feature comparison and suitability analysis',
  agent: strategyArchitect,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['framework_evaluation', 'comparative_assessment', 'suitability_analysis'],
    dependencies: ['strategy_comparison']
  }
});

const optimizationRecommendationTask = new Task({
  description: 'Generate optimization recommendations based on comparative analysis results',
  expectedOutput: 'Orchestration optimization recommendations with implementation guidance and priority matrix',
  agent: orchestrationAnalyst,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-5 hours',
    skillsRequired: ['optimization_analysis', 'recommendation_generation', 'implementation_guidance'],
    dependencies: ['performance_benchmark', 'framework_evaluation']
  }
});

const comparativeReportTask = new Task({
  description: 'Create comprehensive comparative report with findings and strategic recommendations',
  expectedOutput: 'Detailed comparative report with orchestration insights, recommendations, and strategic guidance',
  agent: strategyArchitect,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-5 hours',
    skillsRequired: ['report_generation', 'strategic_analysis', 'comparative_documentation'],
    dependencies: ['optimization_recommendation']
  }
});

// Create team with orchestration comparison focus
const team = new Team({
  name: 'Orchestration Comparison Team',
  agents: [
    orchestrationAnalyst,
    performanceEngineer,
    strategyArchitect
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
    strategyComparisonTask,
    performanceBenchmarkTask,
    frameworkEvaluationTask,
    optimizationRecommendationTask,
    comparativeReportTask
  ],
  
  allowTaskGeneration: false,

  // Use initial-only orchestration for comparative analysis
  continuousOrchestration: false,

  // Use skills-based distribution
  workloadDistribution: 'skills-based',

  orchestrationStrategy: \`
    You are orchestrating a comprehensive orchestration comparison project focused on strategy analysis and performance evaluation.
    
    PROJECT SCOPE:
    - Comparative analysis of different orchestration strategies
    - Performance benchmarking across orchestration approaches
    - Framework evaluation with comparative assessment matrix
    - Optimization recommendations based on analysis results
    - Comprehensive comparative reporting and strategic guidance
    
    TEAM COORDINATION:
    - Orchestration Analyst leads strategy comparison and optimization
    - Performance Engineer conducts benchmarking and metrics analysis
    - Strategy Architect evaluates frameworks and creates reports
    
    PRIORITIES:
    - Start with comprehensive orchestration strategy comparison
    - Conduct thorough performance benchmarking analysis
    - Evaluate frameworks with detailed comparative assessment
    - Generate actionable optimization recommendations
    - Create comprehensive comparative report with strategic insights
    
    CONSTRAINTS:
    - Focus on measurable comparison metrics and objective analysis
    - Ensure comprehensive coverage of orchestration approaches
    - Provide actionable recommendations with implementation guidance
    - Maintain objectivity in comparative analysis and reporting
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