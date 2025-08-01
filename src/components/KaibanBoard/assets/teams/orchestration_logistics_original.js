export const orchestrationLogisticsOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Custom Logistics Tools - Browser-compatible implementation
class RouteOptimizerTool {
  constructor() {
    this.name = 'route_optimizer';
    this.description = 'AI-powered route optimization for delivery efficiency and cost reduction';
  }

  async invoke(input) {
    const { deliveries, constraints, vehicleFleet, trafficData } = input;
    
    // Simulate route optimization with realistic logistics data
    const numDeliveries = deliveries?.length || 50;
    const baseDistance = 150 + Math.random() * 100; // 150-250 km base route
    const optimizedDistance = baseDistance * (0.7 + Math.random() * 0.15); // 15-30% optimization
    
    const routes = [];
    const vehiclesNeeded = Math.ceil(numDeliveries / 15); // ~15 deliveries per vehicle
    
    for (let i = 0; i < vehiclesNeeded; i++) {
      routes.push({
        vehicleId: \`VH\${i + 1}\`,
        stops: Math.min(15, numDeliveries - i * 15),
        distance: optimizedDistance / vehiclesNeeded + Math.random() * 20,
        estimatedTime: \`\${3 + Math.random() * 2} hours\`,
        fuelCost: \`$\${(30 + Math.random() * 20).toFixed(2)}\`,
        co2Emissions: \`\${(15 + Math.random() * 10).toFixed(1)} kg\`,
      });
    }
    
    const savingsPercentage = ((baseDistance - optimizedDistance) / baseDistance * 100).toFixed(1);
    
    return JSON.stringify({
      optimization: {
        originalDistance: \`\${baseDistance.toFixed(1)} km\`,
        optimizedDistance: \`\${optimizedDistance.toFixed(1)} km\`,
        savings: \`\${savingsPercentage}%\`,
        deliveryTime: \`\${(6 + Math.random() * 2).toFixed(1)} hours total\`,
      },
      routes,
      recommendations: [
        savingsPercentage > 20 ? 'Excellent optimization achieved' : 'Consider consolidating shipments',
        'Peak traffic avoidance saved 45 minutes',
        'Consider electric vehicles for urban routes',
      ],
      constraints: {
        satisfied: ['delivery windows', 'vehicle capacity', 'driver hours'],
        warnings: numDeliveries > 100 ? ['High volume may require overtime'] : [],
      },
    });
  }
}

class InventoryTrackerTool {
  constructor() {
    this.name = 'inventory_tracker';
    this.description = 'Real-time inventory monitoring across warehouses and distribution centers';
  }

  async invoke(input) {
    const { warehouseId, sku, thresholds } = input;
    
    // Simulate inventory data
    const stockLevel = Math.floor(100 + Math.random() * 900); // 100-1000 units
    const reorderPoint = thresholds?.reorderPoint || 200;
    const safetyStock = thresholds?.safetyStock || 100;
    const dailyDemand = 20 + Math.random() * 30; // 20-50 units/day
    const daysOfSupply = Math.floor(stockLevel / dailyDemand);
    
    const warehouses = ['WH-Central', 'WH-East', 'WH-West', 'WH-South'];
    const distribution = {};
    warehouses.forEach(wh => {
      distribution[wh] = {
        stock: Math.floor(stockLevel * (0.15 + Math.random() * 0.35)),
        capacity: Math.random() > 0.5 ? 'available' : 'limited',
        transitTime: \`\${1 + Math.floor(Math.random() * 3)} days\`,
      };
    });
    
    const needsReorder = stockLevel < reorderPoint;
    const urgency = stockLevel < safetyStock ? 'critical' : needsReorder ? 'high' : 'normal';
    
    return JSON.stringify({
      warehouseId,
      sku,
      inventory: {
        currentStock: stockLevel,
        safetyStock,
        reorderPoint,
        daysOfSupply,
        turnoverRate: \`\${(12 + Math.random() * 6).toFixed(1)}x/year\`,
      },
      distribution,
      demand: {
        daily: dailyDemand.toFixed(1),
        weekly: (dailyDemand * 7).toFixed(0),
        trend: Math.random() > 0.5 ? 'increasing' : 'stable',
        seasonality: 'moderate',
      },
      recommendations: {
        action: needsReorder ? 'Initiate reorder' : 'Monitor levels',
        quantity: needsReorder ? Math.floor(dailyDemand * 30) : 0,
        urgency,
        redistribution: stockLevel > 500 ? 'Consider balancing to WH-East' : null,
      },
    });
  }
}

class ShipmentTrackerTool {
  constructor() {
    this.name = 'shipment_tracker';
    this.description = 'Track shipments in real-time with predictive ETA and exception handling';
  }

  async invoke(input) {
    const { trackingId, carrier, destination } = input;
    
    // Simulate shipment tracking
    const statuses = ['picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
    const currentStatus = statuses[Math.floor(Math.random() * 3)]; // Not always delivered
    const progress = statuses.indexOf(currentStatus) / (statuses.length - 1) * 100;
    
    const originalETA = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
    const delayHours = Math.random() > 0.7 ? Math.floor(Math.random() * 12) : 0;
    const currentETA = new Date(originalETA.getTime() + delayHours * 60 * 60 * 1000);
    
    const events = [
      { timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), event: 'Package picked up', location: 'Origin Hub' },
      { timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), event: 'In transit', location: 'Regional Sort Center' },
    ];
    
    if (currentStatus === 'out_for_delivery') {
      events.push({ timestamp: new Date().toISOString(), event: 'Out for delivery', location: 'Local Delivery Station' });
    }
    
    return JSON.stringify({
      trackingId,
      carrier,
      shipment: {
        status: currentStatus,
        progress: \`\${progress}%\`,
        origin: 'Distribution Center A',
        destination,
        weight: '15.5 kg',
        dimensions: '60x40x30 cm',
      },
      timing: {
        originalETA: originalETA.toISOString(),
        currentETA: currentETA.toISOString(),
        delayHours,
        onTime: delayHours === 0,
      },
      events,
      predictions: {
        deliveryProbability: currentStatus === 'out_for_delivery' ? '95%' : '80%',
        weatherImpact: 'minimal',
        trafficImpact: delayHours > 0 ? 'moderate' : 'none',
      },
      exceptions: delayHours > 6 ? ['Delay notification sent to customer'] : [],
    });
  }
}

// Create specialized logistics agents with custom tools
const logisticsCoordinatorAgent = new Agent({
  name: 'Maria Gonzalez',
  role: 'Logistics Coordinator',
  goal: 'Optimize supply chain operations for efficiency and customer satisfaction',
  background: 'Supply chain expert with 12 years in global logistics and distribution',
  tools: [new RouteOptimizerTool(), new ShipmentTrackerTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.3,
  },
});

const warehouseManagerAgent = new Agent({
  name: 'James Wilson',
  role: 'Warehouse Operations Manager',
  goal: 'Maintain optimal inventory levels and efficient warehouse operations',
  background: 'Certified warehouse professional with expertise in inventory management and automation',
  tools: [new InventoryTrackerTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.2,
  },
});

const transportPlannerAgent = new Agent({
  name: 'Li Wei',
  role: 'Transport Planning Specialist',
  goal: 'Design efficient transport routes and manage fleet utilization',
  background: 'Transportation engineer with focus on route optimization and sustainability',
  tools: [new RouteOptimizerTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.3,
  },
});

const customerServiceAgent = new Agent({
  name: 'Sarah Mitchell',
  role: 'Customer Service Lead',
  goal: 'Ensure excellent delivery experience and proactive communication',
  background: 'Customer experience specialist with logistics industry expertise',
  tools: [new ShipmentTrackerTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.4,
  },
});

// Create comprehensive logistics task repository
const logisticsTaskRepository = [
  // Route Optimization Tasks
  new Task({
    title: 'Daily Route Optimization',
    description: 'Optimize delivery routes for all scheduled shipments',
    expectedOutput: 'Optimized route plan with vehicle assignments and time windows',
    agent: transportPlannerAgent,
    adaptable: true,
    dynamicPriority: true,
    priority: 'critical',
    orchestrationRules: \`
      OPTIMIZATION CRITERIA:
      - Minimize total distance and time
      - Respect delivery time windows
      - Balance vehicle loads
      - Consider traffic patterns
      - Account for driver hours regulations
      
      DYNAMIC ADJUSTMENTS:
      - Real-time traffic updates
      - Last-minute order additions
      - Vehicle breakdowns
      - Weather conditions
      
      PERFORMANCE TARGETS:
      - 20%+ distance reduction
      - 95%+ on-time delivery
      - <2% failed deliveries
    \`,
    resourceRequirements: {
      estimatedTime: '2-3 hours',
      skillsRequired: ['route-planning', 'optimization-algorithms', 'traffic-analysis'],
      dependencies: ['order-management-system', 'gps-tracking', 'traffic-api'],
    },
    qualityGates: ['route-validation', 'capacity-check', 'time-window-verification', 'cost-analysis'],
  }),

  new Task({
    title: 'Inventory Rebalancing',
    description: 'Analyze and rebalance inventory across warehouse network',
    expectedOutput: 'Rebalancing plan with transfer orders and cost analysis',
    agent: warehouseManagerAgent,
    adaptable: true,
    splitStrategy: 'auto', // Can split by product category or warehouse
    dynamicPriority: true,
    orchestrationRules: \`
      REBALANCING TRIGGERS:
      - Stock imbalance > 30%
      - Demand shift detection
      - Seasonal adjustments
      - New warehouse opening
      
      OPTIMIZATION GOALS:
      - Minimize transfer costs
      - Reduce stockout risk
      - Improve service levels
      - Optimize warehouse space
      
      CONSTRAINTS:
      - Transfer capacity limits
      - Budget restrictions
      - Minimum stock levels
      - Handling requirements
    \`,
    resourceRequirements: {
      estimatedTime: '4-5 hours',
      skillsRequired: ['inventory-management', 'demand-forecasting', 'analytics'],
      dependencies: ['wms-system', 'demand-data', 'transport-availability'],
    },
  }),

  new Task({
    title: 'Real-time Shipment Monitoring',
    description: 'Monitor all active shipments and handle exceptions proactively',
    expectedOutput: 'Shipment status report with exception handling actions',
    agent: logisticsCoordinatorAgent,
    adaptable: true,
    dynamicPriority: true,
    priority: 'high',
    mergeCompatible: ['customer-notifications', 'carrier-coordination'],
    orchestrationRules: \`
      MONITORING SCOPE:
      - All active shipments
      - Priority/express deliveries
      - High-value shipments
      - Temperature-sensitive goods
      
      EXCEPTION HANDLING:
      - Delays > 2 hours: Customer notification
      - Route deviations: Investigation
      - Damage reports: Claims process
      - Lost shipments: Recovery protocol
      
      PROACTIVE ACTIONS:
      - ETA updates to customers
      - Alternative delivery options
      - Expedited shipping upgrades
      - Compensation processing
    \`,
    resourceRequirements: {
      estimatedTime: 'Continuous',
      skillsRequired: ['shipment-tracking', 'exception-management', 'customer-service'],
      dependencies: ['tracking-systems', 'carrier-apis', 'notification-platform'],
    },
  }),

  new Task({
    title: 'Demand Forecasting and Planning',
    description: 'Analyze demand patterns and create supply chain plans',
    expectedOutput: 'Demand forecast with procurement and distribution recommendations',
    agent: warehouseManagerAgent,
    adaptable: true,
    priority: 'medium',
    orchestrationRules: \`
      FORECASTING METHODS:
      - Historical trend analysis
      - Seasonal pattern detection
      - Market intelligence integration
      - Machine learning predictions
      
      PLANNING OUTPUTS:
      - 30/60/90 day forecasts
      - Procurement schedules
      - Distribution plans
      - Capacity requirements
    \`,
    resourceRequirements: {
      estimatedTime: '3-4 hours',
      skillsRequired: ['data-analysis', 'forecasting', 'supply-planning'],
      dependencies: ['historical-data', 'market-intelligence', 'analytics-tools'],
    },
  }),

  new Task({
    title: 'Customer Communication Management',
    description: 'Proactive customer updates and issue resolution',
    expectedOutput: 'Customer satisfaction report with resolved issues log',
    agent: customerServiceAgent,
    adaptable: true,
    dynamicPriority: true,
    orchestrationRules: \`
      COMMUNICATION TRIGGERS:
      - Shipment dispatched
      - ETA changes
      - Delivery attempts
      - Exceptions/delays
      
      CHANNELS:
      - Email notifications
      - SMS updates
      - App push notifications
      - Phone calls for critical issues
      
      RESOLUTION PROCESS:
      - Acknowledge within 1 hour
      - Investigate root cause
      - Provide solutions
      - Follow up confirmation
    \`,
    resourceRequirements: {
      estimatedTime: '6-8 hours/day',
      skillsRequired: ['customer-service', 'communication', 'problem-solving'],
      dependencies: ['crm-system', 'notification-platform', 'tracking-access'],
    },
  }),
];

// Create the logistics team with intelligent orchestration
const logisticsTeam = new Team({
  name: 'Supply Chain Optimization Team',
  agents: [logisticsCoordinatorAgent, warehouseManagerAgent, transportPlannerAgent, customerServiceAgent],
  tasks: [], // Start with empty tasks, orchestrator will select
  inputs: {
    operationalContext: {
      date: '2024-02-10',
      region: 'North America',
      activeShipments: 2847,
      scheduledDeliveries: 1256,
      warehouses: 5,
      fleet: {
        trucks: 125,
        vans: 200,
        contracted: 50,
      },
    },
    performanceMetrics: {
      currentOTD: '94.2%', // On-time delivery
      targetOTD: '98%',
      avgDeliveryTime: '1.8 days',
      customerSatisfaction: '4.3/5',
      costPerDelivery: '$12.50',
    },
    challenges: {
      peakSeason: true,
      weatherAlerts: ['Snow warning in Northeast'],
      fuelPrices: 'increased 15%',
      driverShortage: '10% below capacity',
    },
    priorities: {
      primary: 'Maintain service levels during peak',
      secondary: 'Reduce operational costs',
      strategic: 'Improve sustainability metrics',
    },
  },
  
  // Orchestration configuration for dynamic logistics
  enableOrchestration: true,
  continuousOrchestration: true, // Real-time adaptation crucial
  backlogTasks: logisticsTaskRepository,
  allowTaskGeneration: true, // Handle unexpected situations
  
  orchestrationStrategy: \`
    You are orchestrating a supply chain team during peak season operations.
    
    OPERATIONAL GOALS:
    1. Achieve 98% on-time delivery rate
    2. Optimize costs while maintaining service
    3. Handle 30% volume increase efficiently
    4. Proactive exception management
    
    REAL-TIME PRIORITIES:
    - Customer deliveries are sacred
    - Driver safety in weather conditions
    - Cost optimization without service impact
    - Sustainability when possible
    
    ADAPTIVE TRIGGERS:
    - Weather disruptions require rerouting
    - Vehicle breakdowns need immediate response
    - Demand spikes trigger capacity expansion
    - Inventory shortages require transfers
    
    CONSTRAINTS:
    - Driver hours regulations
    - Vehicle capacity limits
    - Budget restrictions
    - Environmental commitments
    
    AUTOMATION OPPORTUNITIES:
    - Auto-reroute for traffic/weather
    - Predictive inventory transfers
    - Dynamic delivery slot management
    - Proactive customer notifications
  \`,
  
  mode: 'adaptive', // Quick response to changing conditions
  maxActiveTasks: 10, // High parallelism for operations
  taskPrioritization: 'dynamic', // Adjust based on urgency
  workloadDistribution: 'availability', // Fast task assignment
  
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.4,
  },
  
  env: {
    OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'
  }
});

// Show current status
console.log('Logistics Team configured for:', logisticsTeam.inputs.operationalContext.region);
console.log('Active Shipments:', logisticsTeam.inputs.operationalContext.activeShipments);
console.log('Current OTD:', logisticsTeam.inputs.performanceMetrics.currentOTD);
console.log('Orchestration Mode:', logisticsTeam.mode);
console.log('Max Concurrent Tasks:', logisticsTeam.maxActiveTasks);
    `,
    metadata: {
      title: 'Logistics - Supply Chain Optimization',
      description: 'Real-time route optimization and inventory management',
      category: 'orchestration',
      industries: ['logistics', 'transportation', 'supply-chain'],
      teamSize: 4,
      orchestrationFeatures: [
        'adaptiveMode',
        'continuousOrchestration',
        'dynamicPrioritization',
        'highConcurrency',
        'taskGeneration'
      ],
      highlights: [
        'Real-time route optimization',
        'Dynamic inventory rebalancing',
        'Proactive shipment monitoring',
        'Exception handling automation',
        'Customer communication management'
      ]
    },
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'KaibanJS Logistics Example',
  };
};