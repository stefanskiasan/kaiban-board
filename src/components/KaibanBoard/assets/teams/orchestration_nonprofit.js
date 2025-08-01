export const orchestrationNonprofitOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Custom Nonprofit Tools
class DonorAnalysisTool {
  constructor() {
    this.name = 'donor_analysis';
    this.description = 'Analyze donor patterns and giving potential';
  }

  async invoke(input) {
    const { donorSegment, campaignType } = input;
    return JSON.stringify({
      segment: donorSegment,
      averageGift: Math.floor(Math.random() * 500) + 100,
      retentionRate: '65%',
      upgradePotential: 'High',
      bestChannels: ['Email', 'Direct mail', 'Personal calls'],
      recommendations: ['Personalized thank you', 'Impact stories', 'Giving society invitation']
    });
  }
}

class ImpactMeasurementTool {
  constructor() {
    this.name = 'impact_measurement';
    this.description = 'Measure and report program impact';
  }

  async invoke(input) {
    const { program, metrics } = input;
    return JSON.stringify({
      program,
      beneficiariesServed: Math.floor(Math.random() * 1000) + 500,
      outcomesAchieved: '78% goal attainment',
      costPerBeneficiary: '$' + (Math.random() * 100 + 50).toFixed(2),
      socialReturn: '4.2x investment',
      storyHighlights: ['Maria graduated nursing school', 'Youth center served 200 kids']
    });
  }
}

// Create nonprofit team agents
const executiveDirectorAgent = new Agent({
  name: 'Patricia Williams',
  role: 'Executive Director',
  goal: 'Maximize social impact while ensuring organizational sustainability',
  background: '20 years in nonprofit leadership, focused on education and youth development',
  tools: [new ImpactMeasurementTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.4,
  },
});

const developmentDirectorAgent = new Agent({
  name: 'James Rodriguez',
  role: 'Development Director',
  goal: 'Build sustainable funding through donor relationships',
  background: 'Fundraising expert with track record of million-dollar campaigns',
  tools: [new DonorAnalysisTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.5,
  },
});

const programManagerAgent = new Agent({
  name: 'Nina Patel',
  role: 'Program Manager',
  goal: 'Deliver high-impact programs efficiently',
  background: 'Social worker specializing in community development',
  tools: [],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.3,
  },
});

// Nonprofit task repository focused on mission delivery
const nonprofitTaskRepository = [
  new Task({
    title: 'Annual Fundraising Campaign',
    description: 'Plan and execute annual giving campaign',
    expectedOutput: 'Raise $500K with 80% donor retention',
    agent: developmentDirectorAgent,
    adaptable: true,
    dynamicPriority: true,
    priority: 'critical',
  }),
  new Task({
    title: 'Program Impact Assessment',
    description: 'Measure and document program outcomes',
    expectedOutput: 'Comprehensive impact report with stories',
    agent: executiveDirectorAgent,
    adaptable: false,
    priority: 'high',
  }),
  new Task({
    title: 'Volunteer Recruitment',
    description: 'Recruit and onboard program volunteers',
    expectedOutput: '50 trained volunteers ready to serve',
    agent: programManagerAgent,
    adaptable: true,
    priority: 'medium',
  }),
  new Task({
    title: 'Grant Proposal Writing',
    description: 'Write proposals for foundation grants',
    expectedOutput: 'Submit 5 proposals totaling $250K',
    agent: developmentDirectorAgent,
    adaptable: true,
    priority: 'high',
  }),
];

// Nonprofit inputs
const nonprofitInputs = {
  organization: {
    name: 'Hope & Opportunity Foundation',
    mission: 'Breaking the cycle of poverty through education and job training',
    founded: 2010,
    taxStatus: '501(c)(3)',
  },
  programs: {
    youthEducation: 'After-school tutoring for 500 students',
    jobTraining: 'Career skills for 200 adults annually',
    communityCenter: 'Safe space serving 1000 families',
  },
  financials: {
    annualBudget: 2500000,
    fundingMix: { grants: '40%', individuals: '35%', events: '15%', corporate: '10%' },
    reserves: '6 months operating',
    overhead: '18%',
  },
  impact: {
    lastYear: '1,500 lives transformed',
    graduationRate: '85%',
    jobPlacement: '72%',
    communityTrust: 'Very High',
  },
};

// Create team with learning mode for continuous improvement
const nonprofitTeam = new Team({
  name: 'Nonprofit Leadership Team',
  agents: [executiveDirectorAgent, developmentDirectorAgent, programManagerAgent],
  tasks: [],
  inputs: nonprofitInputs,
  
  // ===== UNIQUE CONFIGURATION: Learning mode with balanced approach =====
  enableOrchestration: true,
  continuousOrchestration: true,
  backlogTasks: nonprofitTaskRepository,
  allowTaskGeneration: false, // Focus on core mission activities
  
  orchestrationStrategy: \`
    You are orchestrating a nonprofit team focused on sustainable social impact.
    
    MISSION ALIGNMENT:
    - Every decision must advance the mission
    - Balance immediate needs with long-term sustainability
    - Maintain donor trust through transparency
    - Measure and communicate impact
    
    RESOURCE OPTIMIZATION:
    - Maximize impact per dollar spent
    - Leverage volunteer contributions
    - Build collaborative partnerships
    - Maintain lean operations
    
    CONTINUOUS IMPROVEMENT:
    - Learn from each campaign and program
    - Adapt based on community needs
    - Share best practices across programs
    - Build organizational capacity
  \`,
  
  mode: 'learning', // Continuous improvement focus
  maxActiveTasks: 4,
  taskPrioritization: 'dynamic',
  workloadDistribution: 'availability', // Nonprofits often have limited staff
  
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.4,
  },
  
  env: {
    OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'
  }
});

console.log('Nonprofit Team configured');
console.log('Mission:', nonprofitInputs.organization.mission);
console.log('Annual Budget:', '$' + nonprofitInputs.financials.annualBudget.toLocaleString());
console.log('Mode: Learning with continuous improvement');
console.log('Focus: Mission-driven task prioritization');
`,
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'KaibanJS Nonprofit Example',
  };
};