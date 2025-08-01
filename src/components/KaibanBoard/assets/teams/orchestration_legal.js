export const orchestrationLegalOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Custom Legal Tools
class ContractAnalyzerTool {
  constructor() {
    this.name = 'contract_analyzer';
    this.description = 'Analyze legal contracts';
  }

  async invoke(input) {
    const { contractType, clauses } = input;
    return JSON.stringify({
      contractType,
      riskLevel: Math.random() > 0.7 ? 'high' : 'medium',
      flaggedClauses: ['Indemnification', 'Liability Cap'],
      recommendations: ['Review termination clause', 'Clarify IP ownership'],
    });
  }
}

class ComplianceCheckerTool {
  constructor() {
    this.name = 'compliance_checker';
    this.description = 'Check regulatory compliance';
  }

  async invoke(input) {
    const { regulations, jurisdiction } = input;
    return JSON.stringify({
      compliant: Math.random() > 0.2,
      issues: ['Missing disclosure', 'Filing deadline approaching'],
      requiredActions: ['File HSR notification', 'Update privacy policy'],
    });
  }
}

// Create agents
const seniorPartnerAgent = new Agent({
  name: 'David Thompson',
  role: 'Senior Partner',
  goal: 'Ensure legal excellence and risk mitigation',
  background: 'M&A specialist with 25 years experience',
  tools: [new ContractAnalyzerTool()],
  llmConfig: { provider: 'openai', model: 'gpt-4o', temperature: 0.2 },
});

const complianceOfficerAgent = new Agent({
  name: 'Jennifer Martinez',
  role: 'Chief Compliance Officer',
  goal: 'Ensure regulatory compliance',
  background: 'Regulatory expert',
  tools: [new ComplianceCheckerTool()],
  llmConfig: { provider: 'openai', model: 'gpt-4o', temperature: 0.1 },
});

// Create tasks
const legalTaskRepository = [
  new Task({
    title: 'Contract Review',
    description: 'Review and analyze legal contracts',
    expectedOutput: 'Contract analysis with risk assessment',
    agent: seniorPartnerAgent,
    priority: 'high',
  }),
  new Task({
    title: 'Compliance Check',
    description: 'Verify regulatory compliance',
    expectedOutput: 'Compliance report',
    agent: complianceOfficerAgent,
    priority: 'high',
  }),
  new Task({
    title: 'Due Diligence',
    description: 'Conduct legal due diligence',
    expectedOutput: 'Due diligence findings',
    agent: seniorPartnerAgent,
    priority: 'medium',
  }),
];

// Define inputs
const legalInputs = {
  currentProject: {
    type: 'M&A Transaction',
    dealValue: '$50M',
    timeline: '60 days',
    complexity: 'high',
  },
  contractDetails: {
    primaryAgreement: 'Stock Purchase Agreement',
    dueDiligenceItems: 156,
  },
  urgencyLevel: 'high',
  clientExpectations: 'Thorough review, no surprises',
};

// Create team
const legalTeam = new Team({
  name: 'Corporate Legal Services Team',
  agents: [seniorPartnerAgent, complianceOfficerAgent],
  tasks: [],
  inputs: legalInputs,
  
  enableOrchestration: true,
  continuousOrchestration: false,
  backlogTasks: legalTaskRepository,
  allowTaskGeneration: false,
  
  orchestrationStrategy: \`
    Legal team for M&A transactions with strict procedures.
    GOALS: Risk mitigation, compliance, thorough documentation.
    PROCESS: Multi-level review, no shortcuts, client protection.
  \`,
  
  mode: 'conservative',
  maxActiveTasks: 4,
  taskPrioritization: 'static',
  
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.2,
  },
  
  env: {
    OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'
  }
});

// Add inputs to team
legalTeam.inputs = legalInputs;

console.log('Legal Team configured');
console.log('Project:', legalInputs.currentProject.type);
console.log('Deal Value:', legalInputs.currentProject.dealValue);
console.log('Mode: conservative');
    `,
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'KaibanJS Legal Example',
  };
};