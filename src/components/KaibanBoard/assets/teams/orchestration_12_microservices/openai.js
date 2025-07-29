export const orchestration12MicroservicesOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define specialized microservices development team
const seniorDeveloper = new Agent({
  name: 'Alex',
  role: 'Senior Developer',
  goal: 'Design service boundaries using Domain-Driven Design principles.',
  background: 'Senior developer with expertise in microservices architecture and DDD.',
  tools: []
});

const backendDeveloper = new Agent({
  name: 'Sam',
  role: 'Backend Developer',
  goal: 'Implement microservices with proper communication patterns.',
  background: 'Backend specialist focused on distributed systems and microservices development.',
  tools: []
});

const dataArchitect = new Agent({
  name: 'Jordan',
  role: 'Data Architect',
  goal: 'Design data architecture for distributed microservices systems.',
  background: 'Data architect with expertise in distributed data patterns and event streaming.',
  tools: []
});

const devOpsEngineer = new Agent({
  name: 'Morgan',
  role: 'DevOps Engineer',
  goal: 'Build infrastructure for microservices deployment and orchestration.',
  background: 'DevOps specialist with expertise in container orchestration and service mesh.',
  tools: []
});

const securityExpert = new Agent({
  name: 'Casey',
  role: 'Security Expert',
  goal: 'Implement security patterns for distributed microservices architecture.',
  background: 'Security specialist with expertise in distributed system security and zero-trust.',
  tools: []
});

const performanceEngineer = new Agent({
  name: 'Taylor',
  role: 'Performance Engineer',
  goal: 'Optimize performance and resilience of microservices architecture.',
  background: 'Performance engineer focused on distributed system optimization and resilience.',
  tools: []
});

// Define microservices-specific tasks
const designServiceBoundariesTask = new Task({
  description: 'Design service boundaries using Domain-Driven Design principles and patterns',
  expectedOutput: 'Well-defined service boundaries with clear responsibilities and minimal coupling',
  agent: seniorDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '8-10 hours',
    skillsRequired: ['architecture', 'ddd', 'microservices'],
    dependencies: []
  }
});

const implementApiGatewayTask = new Task({
  description: 'Implement API Gateway with authentication, rate limiting, and routing',
  expectedOutput: 'Centralized API Gateway handling authentication, routing, and cross-cutting concerns',
  agent: backendDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '10-12 hours',
    skillsRequired: ['api_gateway', 'authentication', 'routing'],
    dependencies: ['service_boundaries']
  }
});

const buildUserServiceTask = new Task({
  description: 'Build User Service with authentication, profiles, and preferences management',
  expectedOutput: 'Complete User Service with REST APIs and event publishing capabilities',
  agent: backendDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '12-15 hours',
    skillsRequired: ['backend', 'microservices', 'authentication'],
    dependencies: ['service_boundaries']
  }
});

const implementEventStreamingTask = new Task({
  description: 'Implement event streaming architecture for service communication',
  expectedOutput: 'Event-driven architecture with reliable message delivery and event sourcing',
  agent: dataArchitect,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '10-12 hours',
    skillsRequired: ['event_streaming', 'kafka', 'event_sourcing'],
    dependencies: ['service_boundaries']
  }
});

const setupServiceMeshTask = new Task({
  description: 'Set up service mesh for secure service-to-service communication',
  expectedOutput: 'Service mesh providing security, observability, and traffic management',
  agent: devOpsEngineer,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '8-10 hours',
    skillsRequired: ['service_mesh', 'istio', 'kubernetes'],
    dependencies: ['microservices_deployed']
  }
});

const implementResiliencePatternsTask = new Task({
  description: 'Implement resilience patterns including circuit breakers and retries',
  expectedOutput: 'Resilient microservices with fault tolerance and graceful degradation',
  agent: performanceEngineer,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '6-8 hours',
    skillsRequired: ['resilience_patterns', 'circuit_breaker', 'fault_tolerance'],
    dependencies: ['services_implemented']
  }
});

// Create microservices team configuration
const team = new Team({
  name: 'Microservices Architecture Team',
  agents: [
    seniorDeveloper,
    backendDeveloper,
    dataArchitect,
    devOpsEngineer,
    securityExpert,
    performanceEngineer
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
    designServiceBoundariesTask,
    implementApiGatewayTask,
    buildUserServiceTask,
    implementEventStreamingTask,
    setupServiceMeshTask,
    implementResiliencePatternsTask
  ],
  
  allowTaskGeneration: true,

  // Enable continuous orchestration for complex microservices coordination
  continuousOrchestration: true,

  mode: 'adaptive',

  orchestrationStrategy: \`
    You are building a DISTRIBUTED MICROSERVICES ARCHITECTURE for scalable applications.
    
    ARCHITECTURE PRINCIPLES:
    1. Domain-Driven Design for service boundaries
    2. Event-driven communication between services
    3. Database per service pattern
    4. API-first design approach
    5. Resilience and fault tolerance built-in
    
    SERVICE BOUNDARIES:
    - User Service: Authentication, profiles, preferences
    - Product Service: Catalog, inventory, pricing
    - Order Service: Order processing and fulfillment
    - Payment Service: Transaction processing
    - Notification Service: Email, SMS, push notifications
    - Analytics Service: Events, metrics, reporting
    
    MICROSERVICES PATTERNS TO IMPLEMENT:
    - API Gateway for unified entry point
    - Service Discovery for dynamic service location
    - Circuit Breaker for fault tolerance
    - Event Sourcing for audit trails
    - CQRS for read/write separation
    - Saga Pattern for distributed transactions
    
    ANTI-PATTERNS TO AVOID:
    - Distributed monolith
    - Chatty interfaces between services
    - Shared databases across services
    - Circular service dependencies
    - Synchronous communication for everything
    
    QUALITY ATTRIBUTES:
    - Scalability: Each service scales independently
    - Reliability: System degrades gracefully
    - Maintainability: Clear service ownership
    - Performance: Optimized service communication
    - Security: Zero-trust between services
  \`,

  taskPrioritization: 'ai-driven',
  workloadDistribution: 'skills-based',
  maxActiveTasks: 4,

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