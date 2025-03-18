import { Agent, Task, Team } from 'kaibanjs';
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

// Define tools
const searchInternet = new TavilySearchResults({
  maxResults: 3,
  apiKey: import.meta.env.VITE_TAVILY_API_KEY,
});

// Define agents with exact roles, goals, and backgrounds from Python example
const eventManagerAgent = new Agent({
  name: 'Quantum Atlas',
  role: 'Oversees event planning and ensures smooth execution.',
  goal: 'Coordinate tasks and ensure timely execution.',
  background:
    'Expertise in event planning, resource allocation, and scheduling.',
  type: 'ReactChampionAgent',
  tools: [searchInternet],
  maxIterations: 20,
  llmConfig: {
    provider: "openai",
    model: "gpt-4o-mini",
  },
});

const eventManagerAgent1 = new Agent({
  name: 'Quantum Atlas Prime',
  role: 'Oversees event planning and ensures smooth execution.',
  goal: 'Coordinate tasks and ensure timely execution.',
  background:
    'Expertise in event planning, resource allocation, and scheduling.',
  type: 'ReactChampionAgent',
  maxIterations: 20,
  tools: [searchInternet],
});

const eventManagerAgent2 = new Agent({
  name: 'Quantum Atlas Nova',
  role: 'Oversees event planning and ensures smooth execution.',
  goal: 'Coordinate tasks and ensure timely execution.',
  background:
    'Expertise in event planning, resource allocation, and scheduling.',
  type: 'ReactChampionAgent',
  maxIterations: 20,
  tools: [searchInternet],
});

const venueCoordinatorAgent = new Agent({
  name: 'Neo Matrix',
  role: 'Manages venue logistics.',
  goal: 'Confirm venue availability, arrange setup, and handle issues.',
  background: `Knowledge of venue layouts, policies, and equipment setup.`,
  type: 'ReactChampionAgent',
  tools: [searchInternet],
});

const venueCoordinatorAgent1 = new Agent({
  name: 'Neo Matrix Prime',
  role: 'Manages venue logistics.',
  goal: 'Confirm venue availability, arrange setup, and handle issues.',
  background: `Knowledge of venue layouts, policies, and equipment setup.`,
  type: 'ReactChampionAgent',
  tools: [searchInternet],
});

const cateringAgent = new Agent({
  name: 'Cyber Journey',
  role: 'Organizes food and beverages for the event',
  goal: `Deliver a catering plan and coordinate with vendors`,
  background: `Experience with catering contracts, menu planning, and dietary requirements`,
  type: 'ReactChampionAgent',
});

const cateringAgent1 = new Agent({
  name: 'Cyber Journey Prime',
  role: 'Organizes food and beverages for the event',
  goal: `Deliver a catering plan and coordinate with vendors`,
  background: `Experience with catering contracts, menu planning, and dietary requirements`,
  type: 'ReactChampionAgent',
});

const marketingAgent = new Agent({
  name: 'Digital Phoenix',
  role: 'Promotes the event and handles attendee registrations',
  goal: `Drive attendance and manage guest lists`,
  background: `Skilled in social media marketing, email campaigns, and analytics`,
  type: 'ReactChampionAgent',
});

const marketingAgent1 = new Agent({
  name: 'Digital Phoenix Prime',
  role: 'Promotes the event and handles attendee registrations',
  goal: `Drive attendance and manage guest lists`,
  background: `Skilled in social media marketing, email campaigns, and analytics`,
  type: 'ReactChampionAgent',
});

const marketingAgent2 = new Agent({
  name: 'Digital Phoenix Nova',
  role: 'Promotes the event and handles attendee registrations',
  goal: `Drive attendance and manage guest lists`,
  background: `Skilled in social media marketing, email campaigns, and analytics`,
  type: 'ReactChampionAgent',
  tools: [searchInternet],
});

// Define tasks with dynamic input placeholders
const selectEventDateTask = new Task({
  referenceId: 'selectEventDateTask',
  name: 'Select Event Date',
  description: `Evaluates possible event dates based on:
    - Preferred date range: {dateRange}
    - Expected attendees: {expectedAttendees}
    - Event type: {eventType}
    - Location preferences: {locationPreferences}
    - Budget range: {budgetRange}
    Considers key stakeholder availability, venue schedules, and other constraints like holidays`,
  expectedOutput: `Selected event date. 
    Rationale for the chosen date.
    Notes on any potential conflicts or considerations.
    Weather forecast for the selected date.
    Local events or conflicts on the selected date.`,
  agent: eventManagerAgent,
});

const bookVenueTask = new Task({
  referenceId: 'bookVenueTask',
  name: 'Book Venue',
  description: `Contact the venue, confirms availability for the selected date.
    Requirements:
    - Expected attendees: {expectedAttendees}
    - Venue style preferences: {venueStyle}
    - Required facilities: {requiredFacilities}
    - Budget range: {budgetRange}
    - Event type: {eventType}`,
  expectedOutput: `
    Venue name and address.
    Confirmation details.
    Cost estimate.
    Available facilities and amenities.
    Parking and transportation options.
    Any notes on policies or special arrangements.`,
  agent: venueCoordinatorAgent,
  dependencies: ['selectEventDateTask'],
});

const prepareEventBudgetTask = new Task({
  referenceId: 'prepareEventBudgetTask',
  name: 'Prepare Event Budget',
  description: `Create a detailed budget plan considering:
    - Total budget range: {budgetRange}
    - Number of attendees: {expectedAttendees}
    - Event type: {eventType}
    - Required services: {requiredServices}
    Include venue costs, catering, marketing, and contingencies`,
  expectedOutput: `
    Detailed budget breakdown.
    Cost estimates for each category.
    Contingency allocations.
    Total budget summary.
    Cost per attendee analysis.`,
  agent: eventManagerAgent2,
  dependencies: ['selectEventDateTask'],
});

const finalizeGuestListTask = new Task({
  referenceId: 'finalizeGuestListTask',
  name: 'Finalize Guest List',
  description: `Compile guest list considering:
    - Target attendance: {expectedAttendees}
    - Guest categories: {guestCategories}
    - VIP guests: {vipGuests}
    - Dietary requirements: {dietaryRequirements}`,
  expectedOutput: `
    Number of confirmed guests.
    Guest list with contact details.
    Special dietary or accessibility requirements.
    VIP guest arrangements.`,
  agent: marketingAgent,
  dependencies: ['selectEventDateTask'],
  allowParallelExecution: true,
});

const createCateringPlanTask = new Task({
  referenceId: 'createCateringPlanTask',
  name: 'Create Catering Plan',
  description: `Based on the guest list, create a menu and select a vendor to meet dietary preferences and budget constraints.`,
  expectedOutput: `
  Detailed menu.
Vendor name and contract details.
Total cost estimate.
Notes on special arrangements for individual guests.
  `,
  agent: cateringAgent,
  dependencies: ['selectEventDateTask', 'finalizeGuestListTask'],
});

const setupMarketingCampaignTask = new Task({
  referenceId: 'setupMarketingCampaignTask',
  name: 'Setup Marketing Campaign',
  description: `Develop a marketing plan to promote the event, including social media, email, and PR strategies.`,
  expectedOutput: `
  Marketing plan with key strategies and timelines.
  `,
  agent: marketingAgent1,
  dependencies: ['selectEventDateTask', 'bookVenueTask'],
  allowParallelExecution: true,
});

const coordinateVenueSetupTask = new Task({
  referenceId: 'coordinateVenueSetupTask',
  name: 'Coordinate Venue Setup',
  description: `Coordinate with venue staff to ensure all necessary preparations are made for the event.`,
  expectedOutput: `
  Venue setup schedule and checklist.
  Any notes on special arrangements or last-minute details.
  `,
  agent: venueCoordinatorAgent1,
  dependencies: ['bookVenueTask', 'createCateringPlanTask'],
});

const executeMarketingCampaignTask = new Task({
  referenceId: 'executeMarketingCampaignTask',
  name: 'Execute Marketing Campaign',
  description: `Execute the marketing plan, including social media, email, and PR strategies.`,
  expectedOutput: `
  Marketing campaign execution report.
  Any notes on campaign performance or feedback.
  `,
  agent: marketingAgent2,
  dependencies: ['setupMarketingCampaignTask'],
  allowParallelExecution: true,
});

const finalizeInspectionAndApprovalTask = new Task({
  referenceId: 'finalizeInspectionAndApprovalTask',
  name: 'Finalize Inspection and Approval',
  description: `Finalize inspection and approval of the event setup.`,
  expectedOutput: `
  Inspection report.
  Any notes on final adjustments or feedback.
  `,
  agent: eventManagerAgent1,
  dependencies: ['coordinateVenueSetupTask', 'executeMarketingCampaignTask'],
});

// Team to coordinate the agents, with dynamic inputs
const team = new Team({
  name: 'Event Planning Team',
  agents: [
    eventManagerAgent,
    eventManagerAgent1,
    eventManagerAgent2,
    venueCoordinatorAgent,
    venueCoordinatorAgent1,
    cateringAgent,
    cateringAgent1,
    marketingAgent,
    marketingAgent1,
    marketingAgent2,
  ],
  tasks: [
    selectEventDateTask,
    bookVenueTask,
    prepareEventBudgetTask,
    finalizeGuestListTask,
    createCateringPlanTask,
    setupMarketingCampaignTask,
    coordinateVenueSetupTask,
    executeMarketingCampaignTask,
    finalizeInspectionAndApprovalTask,
  ],
  logLevel: 'info',
  inputs: {
    // Event basic information
    dateRange: "2025-04-10 to 2025-04-22",
    eventType: "Corporate Conference",
    expectedAttendees: 200,
    
    // Budget information
    budgetRange: "10000 USD to 20000 USD",
    
    // Venue preferences
    locationPreferences: "San Francisco, Downtown, 20mi from airport",
    venueStyle: ["Modern", "Professional", "Tech-friendly"],
    requiredFacilities: [
      "High-speed internet",
      "AV equipment",
      "Breakout rooms",
      "Catering kitchen"
    ],
    
    // Guest information
    guestCategories: ["Executives", "Clients", "Partners", "Staff"],
    vipGuests: 15,
    dietaryRequirements: ["Vegetarian", "Vegan", "Gluten-free"],
    
    // Service requirements
    requiredServices: [
      "Full-service catering",
      "AV support",
      "Security",
      "Registration desk"
    ]
  },
  env: { 
    OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
    ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY
  },
});

export default team;
