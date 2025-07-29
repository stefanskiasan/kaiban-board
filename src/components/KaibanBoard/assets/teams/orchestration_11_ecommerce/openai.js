export const orchestration11EcommerceOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define e-commerce specialized development team
const ecommerceDeveloper = new Agent({
  name: 'Alex',
  role: 'E-commerce Developer',
  goal: 'Build comprehensive e-commerce functionality with modern online shopping features.',
  background: 'E-commerce development specialist with expertise in online store systems and shopping workflows.',
  tools: []
});

const paymentSpecialist = new Agent({
  name: 'Sam',
  role: 'Payment Specialist',
  goal: 'Implement secure payment processing systems with multiple payment gateway integration.',
  background: 'Payment systems specialist with expertise in secure transactions and payment gateway integration.',
  tools: []
});

const uxDesigner = new Agent({
  name: 'Jordan',
  role: 'UX Designer',
  goal: 'Create intuitive e-commerce user experiences that maximize conversion and customer satisfaction.',
  background: 'UX design specialist with expertise in e-commerce user flows and conversion optimization.',
  tools: []
});

// Define e-commerce project tasks with online shopping focus
const productCatalogTask = new Task({
  description: 'Build comprehensive product catalog system with inventory management and search functionality',
  expectedOutput: 'Complete product catalog with inventory tracking, search, filtering, and product management',
  agent: ecommerceDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '6-7 hours',
    skillsRequired: ['ecommerce_development', 'inventory_management', 'search_functionality'],
    dependencies: []
  }
});

const paymentProcessingTask = new Task({
  description: 'Implement secure payment processing system with multiple gateway integration',
  expectedOutput: 'Secure payment system with credit card, PayPal, and digital wallet integration',
  agent: paymentSpecialist,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '7-8 hours',
    skillsRequired: ['payment_processing', 'security_implementation', 'gateway_integration'],
    dependencies: ['product_catalog']
  }
});

const shoppingCartTask = new Task({
  description: 'Create intuitive shopping cart and checkout flow with conversion optimization',
  expectedOutput: 'Optimized shopping cart with streamlined checkout process and abandonment recovery',
  agent: uxDesigner,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['ux_design', 'conversion_optimization', 'checkout_flows'],
    dependencies: ['product_catalog']
  }
});

const customerAccountTask = new Task({
  description: 'Build customer account management system with order history and preferences',
  expectedOutput: 'Customer portal with account management, order tracking, and personalized preferences',
  agent: ecommerceDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '5-6 hours',
    skillsRequired: ['customer_management', 'account_systems', 'personalization'],
    dependencies: ['payment_processing', 'shopping_cart']
  }
});

const orderFulfillmentTask = new Task({
  description: 'Implement order fulfillment system with shipping integration and tracking',
  expectedOutput: 'Complete order fulfillment with shipping calculations, tracking, and automated notifications',
  agent: ecommerceDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '6-7 hours',
    skillsRequired: ['order_management', 'shipping_integration', 'fulfillment_automation'],
    dependencies: ['customer_account']
  }
});

// Create team with e-commerce orchestration
const team = new Team({
  name: 'E-commerce Development Team',
  agents: [
    ecommerceDeveloper,
    paymentSpecialist,
    uxDesigner
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
    productCatalogTask,
    paymentProcessingTask,
    shoppingCartTask,
    customerAccountTask,
    orderFulfillmentTask
  ],
  
  allowTaskGeneration: false,

  // Use initial-only orchestration for e-commerce development
  continuousOrchestration: false,

  // Use skills-based distribution
  workloadDistribution: 'skills-based',

  orchestrationStrategy: \`
    You are orchestrating an e-commerce development project focused on creating a complete online shopping platform.
    
    PROJECT SCOPE:
    - Comprehensive product catalog with inventory management
    - Secure payment processing with multiple gateway support
    - Optimized shopping cart and checkout experience
    - Customer account management with personalization
    - Complete order fulfillment with shipping integration
    
    TEAM COORDINATION:
    - E-commerce Developer builds core shopping functionality
    - Payment Specialist ensures secure transaction processing
    - UX Designer optimizes customer experience and conversions
    
    PRIORITIES:
    - Start with comprehensive product catalog system
    - Implement secure and reliable payment processing
    - Create intuitive shopping cart and checkout flow
    - Build customer account management features
    - Complete order fulfillment and shipping integration
    
    CONSTRAINTS:
    - Ensure PCI compliance for payment processing
    - Optimize for conversion rates and user experience
    - Implement comprehensive security measures
    - Design for scalability and high transaction volumes
  \`,

  mode: 'adaptive',
  maxActiveTasks: 3,
  taskPrioritization: 'dynamic',

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