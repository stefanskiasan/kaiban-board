export const orchestration05SkillsOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define specialized agents with diverse skills
const frontendDeveloper = new Agent({
  name: 'Sam',
  role: 'Frontend Developer',
  goal: 'Create exceptional user interfaces with modern web technologies.',
  background: 'Frontend specialist with expertise in React, data visualization, and responsive design.',
  tools: []
});

const backendDeveloper = new Agent({
  name: 'Alex',
  role: 'Backend Developer',
  goal: 'Build scalable and performant backend systems and APIs.',
  background: 'Backend specialist with expertise in Node.js, GraphQL, and API design.',
  tools: []
});

const dataArchitect = new Agent({
  name: 'Morgan',
  role: 'Data Architect',
  goal: 'Design and implement scalable data solutions and analytics systems.',
  background: 'Data engineering specialist with expertise in data warehousing, ETL, and big data.',
  tools: []
});

const uxDesigner = new Agent({
  name: 'Jordan',
  role: 'UX Designer',
  goal: 'Research user needs and design intuitive user experiences.',
  background: 'UX specialist with expertise in user research, usability testing, and design tools.',
  tools: []
});

const qaEngineer = new Agent({
  name: 'Casey',
  role: 'QA Engineer',
  goal: 'Ensure software quality through comprehensive testing strategies.',
  background: 'Quality assurance expert with expertise in test automation, E2E testing, and CI/CD.',
  tools: []
});

const devOpsEngineer = new Agent({
  name: 'Taylor',
  role: 'DevOps Engineer',
  goal: 'Build and maintain reliable infrastructure and deployment pipelines.',
  background: 'DevOps specialist with expertise in Kubernetes, Docker, and cloud infrastructure.',
  tools: []
});

const securityExpert = new Agent({
  name: 'Riley',
  role: 'Security Expert',
  goal: 'Implement security best practices and protect against threats.',
  background: 'Security specialist with expertise in OAuth2, encryption, and security auditing.',
  tools: []
});

const mobileAppDeveloper = new Agent({
  name: 'Avery',
  role: 'Mobile App Developer',
  goal: 'Develop cross-platform mobile applications with native performance.',
  background: 'Mobile development specialist with expertise in React Native and offline capabilities.',
  tools: []
});

// Create diverse tasks requiring different skills
const responsiveDashboardTask = new Task({
  description: 'Implement responsive dashboard with real-time data visualization and live updates',
  expectedOutput: 'Interactive dashboard with charts, real-time data, and mobile-responsive design',
  agent: frontendDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '6-8 hours',
    skillsRequired: ['react', 'data_visualization', 'd3js', 'websockets'],
    dependencies: ['api_endpoints']
  }
});

const graphqlApiTask = new Task({
  description: 'Design and implement GraphQL API with subscription support for real-time features',
  expectedOutput: 'Complete GraphQL API with queries, mutations, and real-time subscriptions',
  agent: backendDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-7 hours',
    skillsRequired: ['graphql', 'node.js', 'websockets', 'api_design'],
    dependencies: ['database_schema']
  }
});

const dataWarehouseTask = new Task({
  description: 'Design scalable data warehouse for analytics with ETL pipelines',
  expectedOutput: 'Data warehouse design with optimized ETL pipelines and performance tuning',
  agent: dataArchitect,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '8-10 hours',
    skillsRequired: ['data_warehousing', 'etl', 'sql', 'big_data'],
    dependencies: []
  }
});

const userResearchTask = new Task({
  description: 'Create user research plan and conduct comprehensive usability testing',
  expectedOutput: 'User research findings with UX improvement recommendations and actionable insights',
  agent: uxDesigner,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-6 hours',
    skillsRequired: ['user_research', 'usability_testing', 'figma'],
    dependencies: ['prototype']
  }
});

const oauth2ImplementationTask = new Task({
  description: 'Implement OAuth2 authentication system with multi-factor authentication support',
  expectedOutput: 'Secure authentication system with MFA, session management, and security auditing',
  agent: securityExpert,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['oauth2', 'security', 'authentication', 'encryption'],
    dependencies: ['user_management']
  }
});

const kubernetesClusterTask = new Task({
  description: 'Set up production-ready Kubernetes cluster with auto-scaling and monitoring',
  expectedOutput: 'K8s cluster with auto-scaling, comprehensive monitoring, and deployment automation',
  agent: devOpsEngineer,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '6-8 hours',
    skillsRequired: ['kubernetes', 'docker', 'cloud_infrastructure', 'monitoring'],
    dependencies: ['containerization']
  }
});

const mobileAppTask = new Task({
  description: 'Develop cross-platform mobile app with offline support and native performance',
  expectedOutput: 'Mobile app for iOS and Android with offline capabilities and push notifications',
  agent: mobileAppDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '10-12 hours',
    skillsRequired: ['react_native', 'mobile_development', 'offline_storage'],
    dependencies: ['api_specification']
  }
});

const e2eTestingTask = new Task({
  description: 'Create automated E2E test suite with visual regression testing and CI integration',
  expectedOutput: 'Comprehensive test suite with CI/CD integration and automated visual testing',
  agent: qaEngineer,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-7 hours',
    skillsRequired: ['playwright', 'test_automation', 'ci_cd', 'visual_testing'],
    dependencies: ['feature_complete']
  }
});

// Cross-functional tasks that could go to multiple agents
const collaborativeEditingTask = new Task({
  description: 'Implement real-time collaborative editing feature with conflict resolution',
  expectedOutput: 'Multi-user collaborative editing with real-time sync and conflict resolution',
  agent: null, // Let orchestrator decide based on skills
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '8-10 hours',
    skillsRequired: ['websockets', 'frontend', 'backend', 'algorithms'],
    dependencies: []
  }
});

// Create team with skills-based distribution
const team = new Team({
  name: 'Cross-Functional Product Team',
  agents: [
    frontendDeveloper,
    backendDeveloper,
    dataArchitect,
    uxDesigner,
    qaEngineer,
    devOpsEngineer,
    securityExpert,
    mobileAppDeveloper
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
    responsiveDashboardTask,
    graphqlApiTask,
    dataWarehouseTask,
    userResearchTask,
    oauth2ImplementationTask,
    kubernetesClusterTask,
    mobileAppTask,
    e2eTestingTask,
    collaborativeEditingTask
  ],
  
  allowTaskGeneration: false, // Focus on distribution, not generation

  // Use initial-only orchestration to focus on optimal skill-based distribution
  continuousOrchestration: false,

  // IMPORTANT: Use skills-based distribution
  workloadDistribution: 'skills-based',

  orchestrationStrategy: \`
    You are orchestrating a cross-functional team building a complex SaaS platform.
    
    PROJECT SCOPE:
    - Enterprise SaaS application
    - Web, mobile, and API interfaces
    - Real-time collaboration features
    - Advanced analytics and reporting
    - High security requirements
    - Scalability for millions of users
    
    SKILL MATCHING PRIORITIES:
    1. Match task requirements to agent expertise
    2. Consider both primary and secondary skills
    3. Balance workload while respecting specializations
    4. Enable knowledge sharing between experts
    5. Avoid skill mismatches that could compromise quality
    
    COLLABORATION GUIDELINES:
    - Frontend and UX should work closely
    - Backend and Data Architect should coordinate
    - Security Expert should review all components
    - QA should have visibility across all features
    
    CONSTRAINTS:
    - Don't overload any single agent
    - Ensure critical skills are not bottlenecked
    - Consider task dependencies when distributing
  \`,

  mode: 'adaptive',
  maxActiveTasks: 6, // More concurrent tasks with specialized team
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