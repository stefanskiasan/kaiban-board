export const orchestrationLogisticsOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Custom Logistics Tools
class RouteOptimizerTool {
  constructor() {
    this.name = 'route_optimizer';
    this.description = 'Optimize delivery routes';
  }

  async invoke(input) {
    const { origin, destinations } = input;
    const optimizedRoute = destinations ? destinations.sort(() => Math.random() - 0.5) : [];
    return JSON.stringify({
      route: optimizedRoute,
      estimatedTime: \`\${4 + Math.random() * 3} hours\`,
      fuelSavings: \`\${10 + Math.random() * 20}%\`,
    });
  }
}

class ShipmentTrackerTool {
  constructor() {
    this.name = 'shipment_tracker';
    this.description = 'Track shipment status';
  }

  async invoke(input) {
    const { trackingId } = input;
    const statuses = ['In Transit', 'Out for Delivery', 'Delivered', 'Delayed'];
    return JSON.stringify({
      trackingId,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      location: 'Distribution Center ' + Math.floor(Math.random() * 10),
      eta: new Date(Date.now() + Math.random() * 86400000).toISOString(),
    });
  }
}

// Create agents
const logisticsCoordinatorAgent = new Agent({
  name: 'Sarah Chen',
  role: 'Logistics Coordinator',
  goal: 'Optimize supply chain operations',
  background: 'Supply chain expert',
  tools: [new RouteOptimizerTool(), new ShipmentTrackerTool()],
  llmConfig: { provider: 'openai', model: 'gpt-4o', temperature: 0.3 },
});

const warehouseManagerAgent = new Agent({
  name: 'Mike Johnson',
  role: 'Warehouse Manager',
  goal: 'Optimize inventory and warehouse operations',
  background: 'Warehouse optimization specialist',
  tools: [],
  llmConfig: { provider: 'openai', model: 'gpt-4o-mini', temperature: 0.3 },
});

// Create tasks
const logisticsTaskRepository = [
  new Task({
    title: 'Route Optimization',
    description: 'Optimize daily delivery routes',
    expectedOutput: 'Optimized routes with time/cost savings',
    agent: logisticsCoordinatorAgent,
    priority: 'high',
  }),
  new Task({
    title: 'Shipment Tracking',
    description: 'Monitor active shipments',
    expectedOutput: 'Shipment status updates',
    agent: logisticsCoordinatorAgent,
    priority: 'high',
  }),
  new Task({
    title: 'Inventory Management',
    description: 'Manage warehouse inventory levels',
    expectedOutput: 'Inventory optimization report',
    agent: warehouseManagerAgent,
    priority: 'medium',
  }),
];

// Define inputs
const logisticsInputs = {
  operationalContext: {
    region: 'North America',
    activeShipments: 1247,
    deliveryNetwork: ['NYC', 'LA', 'Chicago', 'Houston'],
  },
  performanceMetrics: {
    currentOTD: '94.5%', // On-Time Delivery
    avgDeliveryTime: '2.3 days',
    customerSatisfaction: '4.6/5',
  },
  constraints: {
    maxDeliveryTime: '3 days',
    capacityUtilization: '78%',
  },
};

// Create team
const logisticsTeam = new Team({
  name: 'Supply Chain Optimization Team',
  agents: [logisticsCoordinatorAgent, warehouseManagerAgent],
  tasks: [],
  inputs: logisticsInputs,
  
  enableOrchestration: true,
  continuousOrchestration: true,
  backlogTasks: logisticsTaskRepository,
  allowTaskGeneration: true,
  
  orchestrationStrategy: \`
    Supply chain optimization with real-time adaptation.
    GOALS: 95%+ OTD, minimize costs, optimize routes.
    ADAPT: Track delays, reroute shipments, balance inventory.
  \`,
  
  mode: 'adaptive',
  maxActiveTasks: 10,
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
logisticsTeam.inputs = logisticsInputs;

console.log('Logistics Team configured');
console.log('Region:', logisticsInputs.operationalContext.region);
console.log('Active Shipments:', logisticsInputs.operationalContext.activeShipments);
console.log('Current OTD:', logisticsInputs.performanceMetrics.currentOTD);
    `,
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'KaibanJS Logistics Example',
  };
};