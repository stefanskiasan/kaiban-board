export const orchestration04LearningOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define diverse team for learning scenarios
const seniorDeveloper = new Agent({
  name: 'Alex',
  role: 'Senior Developer',
  goal: 'Architect scalable systems and mentor team through continuous improvement.',
  background: 'Senior developer with expertise in system architecture and performance optimization.',
  tools: []
});

const frontendDeveloper = new Agent({
  name: 'Sam',
  role: 'Frontend Developer',
  goal: 'Create exceptional user experiences with data-driven improvements.',
  background: 'Frontend specialist focused on user experience and performance metrics.',
  tools: []
});

const backendDeveloper = new Agent({
  name: 'Jordan',
  role: 'Backend Developer',
  goal: 'Build reliable backend systems with measurable performance improvements.',
  background: 'Backend specialist focused on API optimization and system reliability.',
  tools: []
});

const qaEngineer = new Agent({
  name: 'Casey',
  role: 'QA Engineer',
  goal: 'Ensure quality through comprehensive testing and continuous improvement.',
  background: 'Quality assurance expert focused on metrics-driven testing strategies.',
  tools: []
});

const dataArchitect = new Agent({
  name: 'Morgan',
  role: 'Data Architect',
  goal: 'Design self-optimizing data systems that learn and improve over time.',
  background: 'Data engineering specialist focused on ML-based optimization and analytics.',
  tools: []
});

const technicalWriter = new Agent({
  name: 'Taylor',
  role: 'Technical Writer',
  goal: 'Create adaptive documentation that improves based on user feedback.',
  background: 'Documentation specialist focused on user analytics and content optimization.',
  tools: []
});

// Define learning-focused tasks with feedback mechanisms
const optimizeApiPerformanceTask = new Task({
  description: 'Optimize API response times for user endpoints with performance tracking',
  expectedOutput: 'API response times under 200ms with comprehensive performance metrics and improvement tracking',
  agent: backendDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-6 hours',
    skillsRequired: ['backend', 'performance', 'monitoring'],
    dependencies: []
  }
});

const implementTestCoverageTask = new Task({
  description: 'Implement comprehensive test coverage with quality metrics dashboard',
  expectedOutput: 'Test suite with >90% coverage, quality dashboard, and effectiveness tracking',
  agent: qaEngineer,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-7 hours',
    skillsRequired: ['testing', 'automation', 'metrics'],
    dependencies: ['feature_implementation']
  }
});

const buildUserDashboardTask = new Task({
  description: 'Build user dashboard with analytics and feedback tracking system',
  expectedOutput: 'Interactive dashboard with user behavior tracking and improvement insights',
  agent: frontendDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '6-8 hours',
    skillsRequired: ['frontend', 'analytics', 'ux'],
    dependencies: ['api_endpoints']
  }
});

const createAdaptiveDocsTask = new Task({
  description: 'Create adaptive documentation that improves based on user queries and feedback',
  expectedOutput: 'Self-improving documentation with FAQ generation and user satisfaction tracking',
  agent: technicalWriter,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '3-4 hours',
    skillsRequired: ['documentation', 'analytics', 'user_research'],
    dependencies: []
  }
});

const designDataPipelineTask = new Task({
  description: 'Design self-optimizing data pipeline with ML-based performance tuning',
  expectedOutput: 'Adaptive data pipeline that learns optimal configurations and tracks improvements',
  agent: dataArchitect,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '8-10 hours',
    skillsRequired: ['data_engineering', 'ml', 'optimization'],
    dependencies: ['infrastructure']
  }
});

// Create team with learning mode configuration
const team = new Team({
  name: 'Continuous Learning Team',
  agents: [
    seniorDeveloper,
    frontendDeveloper,
    backendDeveloper,
    qaEngineer,
    dataArchitect,
    technicalWriter
  ],
  tasks: [],

  // Enable orchestration
  enableOrchestration: true,

  // REQUIRED: LLM configuration for orchestration
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4-turbo',
    apiKey: 'ENV_OPENAI_API_KEY'
  },

  // Learning mode - continuous improvement
  mode: 'learning',

  // Enable continuous orchestration for learning from each task completion
  continuousOrchestration: true,

  backlogTasks: [
    optimizeApiPerformanceTask,
    implementTestCoverageTask,
    buildUserDashboardTask,
    createAdaptiveDocsTask,
    designDataPipelineTask
  ],

  allowTaskGeneration: true,

  // Detailed learning strategy
  orchestrationStrategy: \`
    You are orchestrating a team focused on CONTINUOUS LEARNING and improvement.
    
    LEARNING PHILOSOPHY:
    1. Every task is an opportunity to learn
    2. Measure everything that matters
    3. Adapt strategies based on outcomes
    4. Share knowledge across the team
    5. Evolve processes continuously
    
    LEARNING OBJECTIVES:
    - Identify patterns in successful tasks
    - Recognize and avoid repeated mistakes
    - Optimize resource allocation over time
    - Build a knowledge base of best practices
    - Improve estimation accuracy
    
    FEEDBACK INTEGRATION:
    - Collect metrics from every task
    - Analyze success and failure patterns
    - Update strategies based on learnings
    - Propagate improvements across similar tasks
    - Generate new tasks to address weaknesses
    
    EVOLUTION CRITERIA:
    - Task completion times vs estimates
    - Quality metrics trends
    - Team satisfaction scores
    - Customer feedback integration
    - Resource utilization efficiency
    
    CONTINUOUS IMPROVEMENT:
    - Weekly retrospectives
    - Metric-driven decisions
    - Hypothesis-driven development
    - A/B testing for approaches
    - Knowledge documentation
  \`,

  // AI-driven for maximum learning
  taskPrioritization: 'ai-driven',
  workloadDistribution: 'skills-based',
  maxActiveTasks: 3,

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