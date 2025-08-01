export const orchestrationManufacturingOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Custom Manufacturing Tools
class ProductionMonitorTool {
  constructor() {
    this.name = 'production_monitor';
    this.description = 'Monitor production lines';
  }

  async invoke(input) {
    const efficiency = 70 + Math.random() * 25;
    const defectRate = Math.random() * 5;
    return JSON.stringify({
      efficiency: \`\${efficiency.toFixed(1)}%\`,
      defectRate: \`\${defectRate.toFixed(2)}%\`,
      bottlenecks: efficiency < 80 ? ['Low efficiency detected'] : [],
    });
  }
}

class QualityControlTool {
  constructor() {
    this.name = 'quality_control';
    this.description = 'Quality inspection';
  }

  async invoke(input) {
    const passRate = 95 + Math.random() * 5;
    return JSON.stringify({
      passRate: \`\${passRate.toFixed(1)}%\`,
      status: passRate > 97 ? 'approved' : 'review',
    });
  }
}

// Create agents
const productionManagerAgent = new Agent({
  name: 'Klaus Mueller',
  role: 'Production Manager',
  goal: 'Optimize production efficiency',
  background: 'Industrial engineer',
  tools: [new ProductionMonitorTool()],
  llmConfig: { provider: 'openai', model: 'gpt-4o', temperature: 0.3 },
});

const qualityEngineerAgent = new Agent({
  name: 'Dr. Yuki Tanaka',
  role: 'Quality Lead',
  goal: 'Ensure product quality',
  background: 'Six Sigma Black Belt',
  tools: [new QualityControlTool()],
  llmConfig: { provider: 'openai', model: 'gpt-4o', temperature: 0.2 },
});

// Create tasks
const manufacturingTaskRepository = [
  new Task({
    title: 'Production Monitoring',
    description: 'Monitor production lines',
    expectedOutput: 'Production report',
    agent: productionManagerAgent,
    priority: 'high',
  }),
  new Task({
    title: 'Quality Inspection',
    description: 'Inspect product quality',
    expectedOutput: 'Quality report',
    agent: qualityEngineerAgent,
    priority: 'high',
  }),
];

// Define inputs
const manufacturingInputs = {
  productionOrder: {
    orderId: 'PO-2024-1138',
    product: 'Automotive Module',
    quantity: 10000,
    deadline: '2024-02-15',
  },
  factoryStatus: {
    activeLines: 3,
    capacity: '85%',
  },
};

// Create team
const manufacturingTeam = new Team({
  name: 'Smart Factory Team',
  agents: [productionManagerAgent, qualityEngineerAgent],
  tasks: [],
  inputs: manufacturingInputs,
  
  enableOrchestration: true,
  continuousOrchestration: true,
  backlogTasks: manufacturingTaskRepository,
  allowTaskGeneration: true,
  
  orchestrationStrategy: \`
    Smart factory orchestration for automotive parts.
    GOALS: Quality > 99%, minimize downtime, predictive maintenance.
    ADAPT: Monitor efficiency, halt on quality issues.
  \`,
  
  mode: 'adaptive',
  maxActiveTasks: 6,
  taskPrioritization: 'dynamic',
  
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.4,
  },
  
  env: {
    OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'
  }
});

// Add inputs to team
manufacturingTeam.inputs = manufacturingInputs;

// Show current status
console.log('Manufacturing Team configured');
console.log('Order:', manufacturingInputs.productionOrder.orderId);
console.log('Product:', manufacturingInputs.productionOrder.product);
console.log('Orchestration Mode: adaptive');
    `,
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'KaibanJS Manufacturing Example',
  };
};