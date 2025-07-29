export const orchestration10EnterpriseOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define enterprise-grade development team
const enterpriseArchitect = new Agent({
  name: 'Alex',
  role: 'Enterprise Architect',
  goal: 'Design large-scale enterprise systems with comprehensive governance and scalability.',
  background: 'Enterprise architecture specialist with expertise in large-scale system design and governance.',
  tools: []
});

const seniorDeveloper = new Agent({
  name: 'Sam',
  role: 'Senior Developer',
  goal: 'Implement enterprise-grade solutions with strict quality and compliance standards.',
  background: 'Senior developer with expertise in enterprise development and scalable system implementation.',
  tools: []
});

const complianceOfficer = new Agent({
  name: 'Jordan',
  role: 'Compliance Officer',
  goal: 'Ensure all enterprise standards, governance, and compliance requirements are met.',
  background: 'Compliance specialist with expertise in enterprise governance and regulatory standards.',
  tools: []
});

// Define enterprise project tasks with large-scale focus
const enterpriseArchitectureTask = new Task({
  description: 'Design comprehensive enterprise architecture with scalability and governance framework',
  expectedOutput: 'Enterprise architecture blueprint with scalability roadmap and governance policies',
  agent: enterpriseArchitect,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '6-8 hours',
    skillsRequired: ['enterprise_architecture', 'scalability_design', 'governance_framework'],
    dependencies: []
  }
});

const scalableSystemTask = new Task({
  description: 'Implement scalable enterprise system with high availability and performance',
  expectedOutput: 'Enterprise-grade system with high availability, scalability, and performance monitoring',
  agent: seniorDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '8-10 hours',
    skillsRequired: ['enterprise_development', 'scalable_systems', 'high_availability'],
    dependencies: ['enterprise_architecture']
  }
});

const governanceValidationTask = new Task({
  description: 'Validate system compliance with enterprise governance and regulatory standards',
  expectedOutput: 'Compliance validation report with governance adherence and regulatory compliance',
  agent: complianceOfficer,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['governance_validation', 'regulatory_compliance', 'enterprise_standards'],
    dependencies: ['scalable_system']
  }
});

const enterpriseIntegrationTask = new Task({
  description: 'Implement enterprise system integration with existing infrastructure and services',
  expectedOutput: 'Integrated enterprise system with seamless connectivity to existing infrastructure',
  agent: seniorDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '6-7 hours',
    skillsRequired: ['enterprise_integration', 'system_connectivity', 'infrastructure_management'],
    dependencies: ['governance_validation']
  }
});

const enterpriseDeploymentTask = new Task({
  description: 'Execute large-scale enterprise deployment with comprehensive monitoring and support',
  expectedOutput: 'Deployed enterprise system with monitoring, support infrastructure, and documentation',
  agent: enterpriseArchitect,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['enterprise_deployment', 'monitoring_systems', 'support_infrastructure'],
    dependencies: ['enterprise_integration']
  }
});

// Create team with enterprise orchestration
const team = new Team({
  name: 'Enterprise Development Team',
  agents: [
    enterpriseArchitect,
    seniorDeveloper,
    complianceOfficer
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
    enterpriseArchitectureTask,
    scalableSystemTask,
    governanceValidationTask,
    enterpriseIntegrationTask,
    enterpriseDeploymentTask
  ],
  
  allowTaskGeneration: false,

  // Use initial-only orchestration for enterprise development
  continuousOrchestration: false,

  // Use skills-based distribution
  workloadDistribution: 'skills-based',

  orchestrationStrategy: \`
    You are orchestrating a large-scale enterprise development project with focus on scalability and governance.
    
    PROJECT SCOPE:
    - Enterprise-grade system architecture with comprehensive governance
    - Scalable system implementation with high availability
    - Complete compliance validation and regulatory adherence
    - Enterprise system integration with existing infrastructure
    - Large-scale deployment with monitoring and support
    
    TEAM COORDINATION:
    - Enterprise Architect leads system architecture and deployment
    - Senior Developer implements scalable enterprise solutions
    - Compliance Officer ensures governance and regulatory compliance
    
    PRIORITIES:
    - Start with comprehensive enterprise architecture design
    - Implement highly scalable and available systems
    - Validate complete compliance with governance standards
    - Integrate seamlessly with existing enterprise infrastructure
    - Execute deployment with comprehensive monitoring
    
    CONSTRAINTS:
    - Maintain strict enterprise governance standards
    - Ensure regulatory compliance at all levels
    - Design for massive scale and high availability
    - Follow established enterprise development practices
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