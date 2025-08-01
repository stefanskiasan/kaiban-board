export const orchestrationHospitalityOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Custom Hospitality Tools
class OccupancyOptimizerTool {
  constructor() {
    this.name = 'occupancy_optimizer';
    this.description = 'Optimize room rates and availability for maximum revenue';
  }

  async invoke(input) {
    const { date, currentOccupancy, events } = input;
    return JSON.stringify({
      recommendedRate: '$' + (Math.random() * 100 + 150).toFixed(0),
      predictedOccupancy: Math.floor(currentOccupancy + Math.random() * 20) + '%',
      competitorRates: { Hilton: '$189', Marriott: '$195', Hyatt: '$185' },
      strategy: events ? 'Premium pricing - high demand' : 'Competitive pricing',
      forecastRevenue: '$' + (Math.random() * 50000 + 100000).toFixed(0)
    });
  }
}

class GuestSatisfactionTool {
  constructor() {
    this.name = 'guest_satisfaction';
    this.description = 'Analyze guest feedback and satisfaction metrics';
  }

  async invoke(input) {
    const { department, timeframe } = input;
    return JSON.stringify({
      overallScore: (Math.random() * 0.5 + 4.2).toFixed(1),
      departmentScores: {
        frontDesk: 4.5,
        housekeeping: 4.3,
        dining: 4.1,
        concierge: 4.7
      },
      topComplaints: ['Check-in wait time', 'Room temperature control', 'Breakfast variety'],
      topCompliments: ['Friendly staff', 'Clean rooms', 'Great location'],
      actionItems: ['Staff training on efficiency', 'HVAC maintenance', 'Menu expansion']
    });
  }
}

// Create hospitality team agents
const generalManagerAgent = new Agent({
  name: 'Victoria Chang',
  role: 'Hotel General Manager',
  goal: 'Deliver exceptional guest experiences while maximizing profitability',
  background: 'Luxury hotel management expert with 25 years experience',
  tools: [new GuestSatisfactionTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.4,
  },
});

const revenueManagerAgent = new Agent({
  name: 'Carlos Martinez',
  role: 'Revenue Manager',
  goal: 'Optimize pricing and occupancy for maximum revenue',
  background: 'Data-driven revenue optimization specialist',
  tools: [new OccupancyOptimizerTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.3,
  },
});

const guestServicesAgent = new Agent({
  name: 'Sophie Laurent',
  role: 'Guest Services Director',
  goal: 'Ensure memorable experiences for every guest',
  background: 'Hospitality professional focused on personalized service',
  tools: [],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.5,
  },
});

// Hospitality task repository with mixed adaptability
const hospitalityTaskRepository = [
  new Task({
    title: 'Daily Revenue Optimization',
    description: 'Adjust pricing based on demand and competition',
    expectedOutput: 'Updated rate strategy with forecasted revenue',
    agent: revenueManagerAgent,
    adaptable: true,
    dynamicPriority: false, // Fixed high priority
    priority: 'high',
  }),
  new Task({
    title: 'Guest Experience Audit',
    description: 'Review and improve guest journey touchpoints',
    expectedOutput: 'Service improvement plan with staff training',
    agent: guestServicesAgent,
    adaptable: true,
    splitStrategy: 'manual', // Can be split if needed
    priority: 'high',
  }),
  new Task({
    title: 'Staff Performance Review',
    description: 'Evaluate and coach team members',
    expectedOutput: 'Performance reports and development plans',
    agent: generalManagerAgent,
    adaptable: false, // HR processes are standardized
    priority: 'medium',
  }),
  new Task({
    title: 'Competitive Analysis',
    description: 'Monitor competitor offerings and pricing',
    expectedOutput: 'Market positioning report with recommendations',
    agent: revenueManagerAgent,
    adaptable: true,
    priority: 'medium',
  }),
];

// Hospitality inputs
const hospitalityInputs = {
  hotelDetails: {
    name: 'Grand Plaza Hotel & Resort',
    rating: '5-star',
    rooms: 300,
    location: 'Downtown Business District',
  },
  currentMetrics: {
    occupancy: 75,
    adr: 225, // Average Daily Rate
    revPAR: 168.75, // Revenue Per Available Room
    guestSatisfaction: 4.3,
  },
  seasonality: {
    currentPeriod: 'High Season',
    upcomingEvents: ['Tech Conference', 'Music Festival', 'Marathon'],
    holidayPeriods: ['Spring Break', 'Summer Vacation'],
  },
  competition: {
    mainCompetitors: 3,
    marketPosition: 'Premium Leader',
    differentiators: ['Rooftop spa', 'Michelin restaurant', 'Butler service'],
  },
};

// Create team with adaptive mode and static prioritization
const hospitalityTeam = new Team({
  name: 'Luxury Hotel Management Team',
  agents: [generalManagerAgent, revenueManagerAgent, guestServicesAgent],
  tasks: [],
  inputs: hospitalityInputs,
  
  // ===== UNIQUE CONFIGURATION: Adaptive with static priorities =====
  enableOrchestration: true,
  continuousOrchestration: true,
  backlogTasks: hospitalityTaskRepository,
  allowTaskGeneration: false, // Hospitality has well-defined operations
  
  orchestrationStrategy: \`
    You are orchestrating a luxury hotel team focused on excellence and profitability.
    
    SERVICE STANDARDS:
    - Guest satisfaction is paramount
    - Personalization at every touchpoint
    - Proactive problem resolution
    - Exceed expectations consistently
    
    REVENUE FOCUS:
    - Optimize pricing dynamically
    - Maximize occupancy during peak
    - Upsell premium services
    - Control operational costs
    
    OPERATIONAL EXCELLENCE:
    - Maintain 5-star standards
    - Quick response to guest needs
    - Seamless interdepartmental coordination
    - Continuous service refinement
  \`,
  
  mode: 'adaptive', // Respond to changing guest needs and market
  maxActiveTasks: 5,
  taskPrioritization: 'static', // Core operations have fixed priorities
  workloadDistribution: 'balanced',
  
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.4,
  },
  
  env: {
    OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'
  }
});

console.log('Hospitality Team configured');
console.log('Hotel:', hospitalityInputs.hotelDetails.name);
console.log('Current Occupancy:', hospitalityInputs.currentMetrics.occupancy + '%');
console.log('Mode: Adaptive with static prioritization');
console.log('Focus: Guest satisfaction and revenue optimization');
`,
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'KaibanJS Hospitality Example',
  };
};