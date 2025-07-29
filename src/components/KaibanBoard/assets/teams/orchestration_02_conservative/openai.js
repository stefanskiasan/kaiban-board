export const orchestration02ConservativeOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define conservative development team focused on security and compliance
const seniorDeveloper = new Agent({
  name: 'Alex',
  role: 'Senior Developer',
  goal: 'Build secure and reliable systems with proven technologies and best practices.',
  background: 'Senior developer with expertise in enterprise security and system reliability.',
  tools: []
});

const securityExpert = new Agent({
  name: 'Morgan',
  role: 'Security Expert',
  goal: 'Ensure all security requirements and compliance standards are met.',
  background: 'Security specialist focused on enterprise compliance and threat prevention.',
  tools: []
});

const qaEngineer = new Agent({
  name: 'Jordan',
  role: 'QA Engineer',
  goal: 'Maintain highest quality standards through rigorous testing and validation.',
  background: 'Quality assurance expert with focus on compliance testing and risk mitigation.',
  tools: []
});

// Define conservative project tasks with security focus
const securityAuditTask = new Task({
  description: 'Conduct comprehensive security audit and establish security baseline',
  expectedOutput: 'Complete security assessment report with risk mitigation strategies',
  agent: securityExpert,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '3-4 hours',
    skillsRequired: ['security_audit', 'compliance', 'risk_assessment'],
    dependencies: []
  }
});

const secureAuthenticationTask = new Task({
  description: 'Implement enterprise-grade authentication with multi-factor security',
  expectedOutput: 'Secure authentication system with MFA and enterprise compliance',
  agent: seniorDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['authentication', 'enterprise_security', 'compliance'],
    dependencies: ['security_audit']
  }
});

const complianceValidationTask = new Task({
  description: 'Validate all components against security and compliance standards',
  expectedOutput: 'Compliance validation report with certification documentation',
  agent: securityExpert,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-5 hours',
    skillsRequired: ['compliance_validation', 'security_standards', 'documentation'],
    dependencies: ['secure_authentication']
  }
});

const comprehensiveTestingTask = new Task({
  description: 'Execute thorough testing including security and penetration tests',
  expectedOutput: 'Complete test suite with security validation and performance benchmarks',
  agent: qaEngineer,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-5 hours',
    skillsRequired: ['security_testing', 'penetration_testing', 'compliance_testing'],
    dependencies: ['secure_authentication', 'compliance_validation']
  }
});

const documentationTask = new Task({
  description: 'Create comprehensive documentation and compliance reporting',
  expectedOutput: 'Complete documentation package with security and compliance reports',
  agent: seniorDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '3-4 hours',
    skillsRequired: ['technical_documentation', 'compliance_reporting', 'security_documentation'],
    dependencies: ['comprehensive_testing']
  }
});

// Create team with conservative orchestration
const team = new Team({
  name: 'Conservative Development Team',
  agents: [
    seniorDeveloper,
    securityExpert,
    qaEngineer
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
    securityAuditTask,
    secureAuthenticationTask,
    complianceValidationTask,
    comprehensiveTestingTask,
    documentationTask
  ],
  
  allowTaskGeneration: false,

  // Use initial-only orchestration for predictable workflow
  continuousOrchestration: false,

  // Use skills-based distribution
  workloadDistribution: 'skills-based',

  orchestrationStrategy: \`
    You are orchestrating a conservative enterprise development project with focus on security and compliance.
    
    PROJECT SCOPE:
    - Enterprise-grade secure application
    - Full compliance with security standards
    - Risk mitigation and threat prevention
    - Comprehensive documentation and reporting
    
    TEAM COORDINATION:
    - Senior Developer ensures technical reliability
    - Security Expert leads all security decisions
    - QA Engineer validates compliance and quality
    
    PRIORITIES:
    - Security audit comes first before any development
    - Implement proven secure authentication methods
    - Validate compliance at every step
    - Thorough testing including security validation
    - Complete documentation for audit trails
    
    CONSTRAINTS:
    - Use only proven, stable technologies
    - Follow established security frameworks
    - Maintain detailed audit trails
    - No experimental or unproven solutions
  \`,

  mode: 'conservative',
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