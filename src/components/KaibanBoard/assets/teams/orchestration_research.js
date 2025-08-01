export const orchestrationResearchOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Custom Research Tools
class DataAnalysisTool {
  constructor() {
    this.name = 'data_analysis';
    this.description = 'Analyze research data';
  }

  async invoke(input) {
    const { dataType, sampleSize } = input;
    return JSON.stringify({
      dataType,
      sampleSize: sampleSize || 100,
      significance: Math.random() > 0.5 ? 'p < 0.05' : 'p > 0.05',
      correlation: (Math.random() * 2 - 1).toFixed(3),
      insights: ['Pattern detected', 'Further analysis needed'],
    });
  }
}

class LiteratureReviewTool {
  constructor() {
    this.name = 'literature_review';
    this.description = 'Review scientific literature';
  }

  async invoke(input) {
    const { topic, yearRange } = input;
    return JSON.stringify({
      topic,
      papersFound: Math.floor(50 + Math.random() * 150),
      keyFindings: ['Previous studies show...', 'Gap in literature identified'],
      citations: Math.floor(10 + Math.random() * 40),
    });
  }
}

// Create agents
const principalInvestigatorAgent = new Agent({
  name: 'Dr. Sarah Mitchell',
  role: 'Principal Investigator',
  goal: 'Lead groundbreaking research',
  background: 'Neuroscience PhD',
  tools: [new LiteratureReviewTool()],
  llmConfig: { provider: 'openai', model: 'gpt-4o', temperature: 0.4 },
});

const dataScientistAgent = new Agent({
  name: 'Dr. Alex Wang',
  role: 'Data Scientist',
  goal: 'Extract insights from complex data',
  background: 'Statistical analysis expert',
  tools: [new DataAnalysisTool()],
  llmConfig: { provider: 'openai', model: 'gpt-4o', temperature: 0.3 },
});

// Create tasks
const researchTaskRepository = [
  new Task({
    title: 'Literature Review',
    description: 'Review current research literature',
    expectedOutput: 'Comprehensive literature summary',
    agent: principalInvestigatorAgent,
    priority: 'high',
  }),
  new Task({
    title: 'Data Analysis',
    description: 'Analyze experimental data',
    expectedOutput: 'Statistical analysis report',
    agent: dataScientistAgent,
    priority: 'high',
  }),
  new Task({
    title: 'Hypothesis Development',
    description: 'Develop research hypotheses',
    expectedOutput: 'Research hypotheses document',
    agent: principalInvestigatorAgent,
    priority: 'medium',
  }),
];

// Define inputs
const researchInputs = {
  researchProject: {
    title: 'Neural Mechanisms of Memory Formation',
    phase: 'Data Collection',
    funding: 'NIH R01 Grant',
    duration: '5 years',
  },
  currentStatus: {
    participantsRecruited: 127,
    dataCollected: '73%',
    analysisComplete: '45%',
  },
  researchTeam: {
    size: 12,
    expertise: ['Neuroscience', 'Psychology', 'Statistics'],
  },
};

// Create team
const researchTeam = new Team({
  name: 'Neuroscience Research Laboratory',
  agents: [principalInvestigatorAgent, dataScientistAgent],
  tasks: [],
  inputs: researchInputs,
  
  enableOrchestration: true,
  continuousOrchestration: true,
  backlogTasks: researchTaskRepository,
  allowTaskGeneration: true,
  
  orchestrationStrategy: \`
    Scientific research coordination with continuous learning.
    GOALS: Rigorous methodology, novel discoveries, ethical compliance.
    ADAPT: Adjust hypotheses, refine methods, follow data.
  \`,
  
  mode: 'learning',
  maxActiveTasks: 6,
  taskPrioritization: 'ai-driven',
  
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.5,
  },
  
  env: {
    OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'
  }
});

// Add inputs to team
researchTeam.inputs = researchInputs;

console.log('Research Team configured');
console.log('Project:', researchInputs.researchProject.title);
console.log('Phase:', researchInputs.researchProject.phase);
console.log('Participants:', researchInputs.currentStatus.participantsRecruited);
    `,
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'KaibanJS Research Example',
  };
};