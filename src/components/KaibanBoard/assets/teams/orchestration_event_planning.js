export const orchestrationEventPlanningOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Custom Event Planning Tools
class VenueFinderTool {
  constructor() {
    this.name = 'venue_finder';
    this.description = 'Find and evaluate event venues based on requirements';
  }

  async invoke(input) {
    const { capacity, location, budget } = input;
    return JSON.stringify({
      venues: [
        { name: 'Grand Ballroom', capacity: capacity, price: budget * 0.4, rating: 4.8 },
        { name: 'Conference Center', capacity: capacity * 0.8, price: budget * 0.3, rating: 4.5 },
        { name: 'Outdoor Pavilion', capacity: capacity * 1.2, price: budget * 0.25, rating: 4.6 }
      ],
      availability: 'All venues available for requested dates',
      recommendations: 'Grand Ballroom best for formal events'
    });
  }
}

class VendorCoordinatorTool {
  constructor() {
    this.name = 'vendor_coordinator';
    this.description = 'Coordinate with catering, AV, and other vendors';
  }

  async invoke(input) {
    const { vendorType, requirements } = input;
    return JSON.stringify({
      vendorType,
      quotes: ['Premium Package: $5000', 'Standard Package: $3000', 'Basic Package: $1500'],
      leadTime: '2-3 weeks',
      specialOffers: ['10% discount for early booking', 'Free setup included']
    });
  }
}

// Create specialized event planning agents
const eventDirectorAgent = new Agent({
  name: 'Sophia Chen',
  role: 'Event Director',
  goal: 'Create memorable events within budget and timeline constraints',
  background: 'Award-winning event planner with 15 years experience in corporate and social events',
  tools: [new VenueFinderTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.5,
  },
});

const vendorManagerAgent = new Agent({
  name: 'Marcus Rivera',
  role: 'Vendor Relations Manager',
  goal: 'Secure best vendors and negotiate optimal contracts',
  background: 'Expert negotiator with extensive vendor network',
  tools: [new VendorCoordinatorTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.3,
  },
});

const logisticsCoordinatorAgent = new Agent({
  name: 'Emma Watson',
  role: 'Logistics Coordinator',
  goal: 'Ensure smooth event execution and timeline management',
  background: 'Detail-oriented coordinator specializing in complex event logistics',
  tools: [],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.2,
  },
});

// Event planning task repository with fixed scope
const eventTaskRepository = [
  new Task({
    title: 'Venue Selection',
    description: 'Find and book the perfect venue',
    expectedOutput: 'Confirmed venue booking with contract',
    agent: eventDirectorAgent,
    adaptable: true,
    priority: 'high',
  }),
  new Task({
    title: 'Catering Arrangement',
    description: 'Arrange catering services for the event',
    expectedOutput: 'Catering menu and service agreement',
    agent: vendorManagerAgent,
    adaptable: true,
    priority: 'high',
  }),
  new Task({
    title: 'Guest Management',
    description: 'Handle invitations and RSVPs',
    expectedOutput: 'Guest list with dietary requirements',
    agent: logisticsCoordinatorAgent,
    adaptable: false,
    priority: 'medium',
  }),
  new Task({
    title: 'Timeline Creation',
    description: 'Create detailed event timeline',
    expectedOutput: 'Hour-by-hour event schedule',
    agent: logisticsCoordinatorAgent,
    adaptable: false,
    priority: 'high',
  }),
];

// Event planning inputs
const eventInputs = {
  eventDetails: {
    type: 'Corporate Annual Gala',
    date: '2024-06-15',
    duration: '6 hours',
    theme: 'Innovation & Excellence',
  },
  requirements: {
    attendeeCount: 250,
    budget: 75000,
    location: 'Downtown area',
    mustHaves: ['AV equipment', 'Stage', 'Parking'],
  },
  constraints: {
    dietaryRestrictions: ['Vegetarian options', 'Gluten-free', 'Kosher'],
    accessibility: 'Full wheelchair access required',
    deadline: '8 weeks',
  },
};

// Create team with initial-only orchestration but task generation allowed
const eventTeam = new Team({
  name: 'Elite Event Planning Team',
  agents: [eventDirectorAgent, vendorManagerAgent, logisticsCoordinatorAgent],
  tasks: [],
  inputs: eventInputs,
  
  // ===== UNIQUE CONFIGURATION: Initial orchestration with task generation =====
  enableOrchestration: true,
  continuousOrchestration: false, // Only orchestrate at the beginning
  backlogTasks: eventTaskRepository,
  allowTaskGeneration: true, // Can create new tasks during initial planning
  
  orchestrationStrategy: \`
    You are orchestrating an event planning team for high-profile corporate events.
    
    APPROACH:
    - Analyze all requirements upfront
    - Create comprehensive task list at the beginning
    - Allow for creative solutions and additional tasks
    - No re-orchestration during execution
    
    PRIORITIES:
    1. Stay within budget
    2. Meet all client requirements
    3. Create memorable experience
    4. Ensure smooth logistics
  \`,
  
  mode: 'adaptive',
  maxActiveTasks: 5,
  taskPrioritization: 'static', // Priorities set once at beginning
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

console.log('Event Planning Team configured');
console.log('Event Type:', eventInputs.eventDetails.type);
console.log('Budget:', '$' + eventInputs.requirements.budget);
console.log('Orchestration: Initial planning only');
console.log('Task Generation: Enabled for comprehensive planning');
`,
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'KaibanJS Event Planning Example',
  };
};