export const orchestrationConstructionOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Custom Construction Tools
class SafetyInspectorTool {
  constructor() {
    this.name = 'safety_inspector';
    this.description = 'Perform safety inspections and compliance checks';
  }

  async invoke(input) {
    const { area, phase } = input;
    return JSON.stringify({
      area,
      phase,
      safetyScore: Math.floor(Math.random() * 20) + 80,
      issues: phase === 'foundation' ? ['Minor rebar spacing'] : ['PPE compliance'],
      recommendations: ['Daily safety briefings', 'Additional signage'],
      nextInspection: '48 hours'
    });
  }
}

class ResourceTrackerTool {
  constructor() {
    this.name = 'resource_tracker';
    this.description = 'Track materials, equipment, and workforce';
  }

  async invoke(input) {
    const { resourceType, quantity } = input;
    return JSON.stringify({
      resourceType,
      available: quantity * 0.85,
      inTransit: quantity * 0.1,
      allocated: quantity * 0.75,
      reorderPoint: quantity * 0.2,
      suppliers: ['BuildCo Supply', 'Construction Direct', 'ProMaterials']
    });
  }
}

// Create construction team agents
const projectManagerAgent = new Agent({
  name: 'Robert Garcia',
  role: 'Construction Project Manager',
  goal: 'Deliver project on time, within budget, meeting all safety standards',
  background: 'Licensed PM with 20 years in commercial construction',
  tools: [new ResourceTrackerTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.3,
  },
});

const siteEngineerAgent = new Agent({
  name: 'Lisa Patel',
  role: 'Site Engineer',
  goal: 'Ensure structural integrity and technical compliance',
  background: 'Structural engineer specializing in high-rise buildings',
  tools: [],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.2,
  },
});

const safetyOfficerAgent = new Agent({
  name: 'Mike Johnson',
  role: 'Safety Officer',
  goal: 'Maintain zero accidents and full OSHA compliance',
  background: 'Certified safety professional with spotless record',
  tools: [new SafetyInspectorTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.1,
  },
});

// Construction task repository - tasks can be adapted but not generated
const constructionTaskRepository = [
  new Task({
    title: 'Site Preparation',
    description: 'Prepare construction site for building',
    expectedOutput: 'Cleared and leveled site with utilities marked',
    agent: siteEngineerAgent,
    adaptable: true,
    dynamicPriority: true,
    priority: 'high',
  }),
  new Task({
    title: 'Foundation Work',
    description: 'Excavate and pour foundation',
    expectedOutput: 'Completed foundation passing inspection',
    agent: siteEngineerAgent,
    adaptable: true,
    priority: 'high',
  }),
  new Task({
    title: 'Safety Compliance',
    description: 'Conduct safety audits and training',
    expectedOutput: 'Safety certification and trained crew',
    agent: safetyOfficerAgent,
    adaptable: false,
    priority: 'critical',
  }),
  new Task({
    title: 'Resource Management',
    description: 'Manage materials and equipment delivery',
    expectedOutput: 'Timely delivery of all resources',
    agent: projectManagerAgent,
    adaptable: true,
    priority: 'high',
  }),
];

// Construction project inputs
const constructionInputs = {
  projectDetails: {
    name: 'Riverside Office Complex',
    type: 'Commercial Construction',
    size: '50,000 sq ft',
    floors: 5,
  },
  timeline: {
    startDate: '2024-03-01',
    completionTarget: '2025-06-30',
    currentPhase: 'Foundation',
    criticalMilestones: ['Foundation: April 15', 'Structure: August 30', 'Exterior: December 15'],
  },
  resources: {
    budget: 12000000,
    workforce: 45,
    equipment: ['2 Cranes', '5 Excavators', '10 Trucks'],
    mainContractor: 'BuildRight Construction',
  },
  compliance: {
    permits: ['Building', 'Electrical', 'Plumbing', 'Environmental'],
    inspections: 'Weekly OSHA visits',
    certifications: 'LEED Silver target',
  },
};

// Create team with continuous orchestration but no task generation
const constructionTeam = new Team({
  name: 'Commercial Construction Team',
  agents: [projectManagerAgent, siteEngineerAgent, safetyOfficerAgent],
  tasks: [],
  inputs: constructionInputs,
  
  // ===== UNIQUE CONFIGURATION: Continuous adaptation without new tasks =====
  enableOrchestration: true,
  continuousOrchestration: true, // Continuous monitoring and adaptation
  backlogTasks: constructionTaskRepository,
  allowTaskGeneration: false, // Cannot create new tasks - work with predefined scope
  
  orchestrationStrategy: \`
    You are orchestrating a construction project team with strict scope control.
    
    APPROACH:
    - Continuously monitor progress and adapt existing tasks
    - No scope creep - work only with predefined tasks
    - Prioritize safety above all else
    - Adjust task parameters based on weather, delays, inspections
    
    CONSTRAINTS:
    - Cannot add new tasks (fixed scope contract)
    - Must maintain safety compliance
    - Budget is fixed - optimize within constraints
    - Timeline is critical - identify and mitigate delays
  \`,
  
  mode: 'conservative', // Safety-first approach
  maxActiveTasks: 4,
  taskPrioritization: 'dynamic', // Adjust based on project phase
  workloadDistribution: 'skills-based',
  
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.2,
  },
  
  env: {
    OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'
  }
});

console.log('Construction Team configured');
console.log('Project:', constructionInputs.projectDetails.name);
console.log('Budget:', '$' + constructionInputs.resources.budget.toLocaleString());
console.log('Orchestration: Continuous adaptation');
console.log('Task Generation: Disabled (fixed scope)');
`,
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'KaibanJS Construction Example',
  };
};