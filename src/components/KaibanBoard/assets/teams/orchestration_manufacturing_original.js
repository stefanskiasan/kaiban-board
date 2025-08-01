export const orchestrationManufacturingOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Custom Manufacturing Tools - Browser-compatible implementation
class ProductionMonitorTool {
  constructor() {
    this.name = 'production_monitor';
    this.description = 'Real-time monitoring of production lines, efficiency metrics, and bottleneck detection';
  }

  async invoke(input) {
    const { lineId, metrics, timeRange } = input;
    
    // Simulate production monitoring with realistic data
    const efficiency = 70 + Math.random() * 25; // 70-95% efficiency
    const defectRate = Math.random() * 5; // 0-5% defect rate
    const throughput = 800 + Math.random() * 400; // 800-1200 units/hour
    
    const bottlenecks = [];
    if (efficiency < 80) bottlenecks.push('Assembly station 3 running below capacity');
    if (defectRate > 3) bottlenecks.push('Quality issues detected at welding station');
    
    return JSON.stringify({
      lineId,
      metrics: {
        efficiency: \`\${efficiency.toFixed(1)}%\`,
        defectRate: \`\${defectRate.toFixed(2)}%\`,
        throughput: \`\${Math.floor(throughput)} units/hour\`,
        uptime: \`\${(95 + Math.random() * 4).toFixed(1)}%\`,
      },
      bottlenecks,
      recommendations: bottlenecks.length > 0 ? 
        ['Investigate bottleneck causes', 'Consider preventive maintenance', 'Review operator training'] :
        ['Maintain current performance', 'Monitor for changes'],
      timestamp: new Date().toISOString(),
    });
  }
}

class QualityControlTool {
  constructor() {
    this.name = 'quality_control';
    this.description = 'AI-powered quality inspection and defect classification';
  }

  async invoke(input) {
    const { batchId, inspectionType, tolerances } = input;
    
    // Simulate quality control inspection
    const samplesInspected = 100;
    const defectsFound = Math.floor(Math.random() * 5);
    const defectTypes = ['surface_scratch', 'dimension_variance', 'color_mismatch', 'assembly_error'];
    
    const detectedDefects = [];
    for (let i = 0; i < defectsFound; i++) {
      detectedDefects.push({
        type: defectTypes[Math.floor(Math.random() * defectTypes.length)],
        severity: Math.random() > 0.7 ? 'critical' : 'minor',
        location: \`Unit \${Math.floor(Math.random() * samplesInspected) + 1}\`,
      });
    }
    
    const passRate = ((samplesInspected - defectsFound) / samplesInspected * 100).toFixed(1);
    
    return JSON.stringify({
      batchId,
      inspectionType,
      results: {
        samplesInspected,
        defectsFound,
        passRate: \`\${passRate}%\`,
        defectDetails: detectedDefects,
      },
      recommendations: defectsFound > 2 ? 
        ['Halt production for investigation', 'Review process parameters', 'Retrain quality model'] :
        ['Continue production', 'Schedule routine calibration'],
      certificationStatus: passRate > 95 ? 'approved' : 'requires_review',
    });
  }
}

class MaintenancePredictorTool {
  constructor() {
    this.name = 'maintenance_predictor';
    this.description = 'Predictive maintenance analysis based on equipment sensors and historical data';
  }

  async invoke(input) {
    const { equipmentId, sensorData, maintenanceHistory } = input;
    
    // Simulate predictive maintenance analysis
    const healthScore = 60 + Math.random() * 40; // 60-100 health score
    const daysUntilMaintenance = Math.floor(5 + Math.random() * 25); // 5-30 days
    
    const risks = [];
    if (healthScore < 70) risks.push('Bearing wear detected');
    if (healthScore < 80) risks.push('Lubrication levels suboptimal');
    if (sensorData?.vibration > 0.8) risks.push('Abnormal vibration patterns');
    
    return JSON.stringify({
      equipmentId,
      analysis: {
        healthScore: healthScore.toFixed(1),
        predictedFailureWindow: \`\${daysUntilMaintenance}-\${daysUntilMaintenance + 5} days\`,
        criticalComponents: risks,
        maintenanceType: healthScore < 75 ? 'preventive' : 'scheduled',
      },
      recommendations: {
        immediate: risks.filter(r => r.includes('Abnormal')),
        scheduled: risks.filter(r => !r.includes('Abnormal')),
        spareParts: ['bearing_set_A3', 'lubricant_type_X', 'filter_element_B2'],
      },
    });
  }
}

// Create specialized manufacturing agents with custom tools
const productionManagerAgent = new Agent({
  name: 'Klaus Mueller',
  role: 'Production Manager',
  goal: 'Optimize production efficiency while maintaining quality standards',
  background: 'Industrial engineer with 15 years in automotive manufacturing and lean production',
  tools: [new ProductionMonitorTool(), new MaintenancePredictorTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.3,
  },
});

const qualityEngineerAgent = new Agent({
  name: 'Dr. Yuki Tanaka',
  role: 'Quality Assurance Lead',
  goal: 'Ensure product quality meets specifications and continuously improve processes',
  background: 'PhD in Materials Science, Six Sigma Black Belt, specialist in automated inspection',
  tools: [new QualityControlTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.2,
  },
});

const maintenanceTechAgent = new Agent({
  name: 'Roberto Silva',
  role: 'Maintenance Supervisor',
  goal: 'Minimize equipment downtime through predictive maintenance',
  background: 'Certified maintenance professional with expertise in IoT sensors and predictive analytics',
  tools: [new MaintenancePredictorTool(), new ProductionMonitorTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.3,
  },
});

const supplyChainAgent = new Agent({
  name: 'Lisa Chen',
  role: 'Supply Chain Coordinator',
  goal: 'Ensure material availability and optimize inventory levels',
  background: 'Supply chain management expert with focus on JIT and lean inventory',
  tools: [],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.4,
  },
});

// Create comprehensive manufacturing task repository
const manufacturingTaskRepository = [
  new Task({
    title: 'Real-time Production Line Monitoring',
    description: 'Monitor all production lines for efficiency, bottlenecks, and quality metrics',
    expectedOutput: 'Production status report with optimization recommendations',
    agent: productionManagerAgent,
    adaptable: true,
    dynamicPriority: true,
    priority: 'high',
  }),

  new Task({
    title: 'Quality Inspection Batch Processing',
    description: 'Perform AI-powered quality inspection on production batches',
    expectedOutput: 'Quality certification report with defect analysis',
    agent: qualityEngineerAgent,
    adaptable: true,
    splitStrategy: 'auto',
    priority: 'high',
  }),

  new Task({
    title: 'Predictive Maintenance Analysis',
    description: 'Analyze equipment sensors and predict maintenance needs',
    expectedOutput: 'Maintenance schedule with risk assessment and parts requirements',
    agent: maintenanceTechAgent,
    adaptable: true,
    dynamicPriority: true,
    mergeCompatible: ['equipment-calibration', 'spare-parts-inventory'],
  }),

  new Task({
    title: 'Supply Chain Synchronization',
    description: 'Coordinate material flow with production schedule and inventory levels',
    expectedOutput: 'Material availability report with procurement recommendations',
    agent: supplyChainAgent,
    adaptable: true,
    dynamicPriority: true,
  }),

  new Task({
    title: 'Production Optimization Workshop',
    description: 'Analyze production data and implement continuous improvements',
    expectedOutput: 'Optimization plan with expected efficiency gains',
    agent: productionManagerAgent,
    adaptable: true,
    splitStrategy: 'manual',
  }),
];

// Create the manufacturing team with intelligent orchestration
const manufacturingTeam = new Team({
  name: 'Smart Factory Operations Team',
  agents: [productionManagerAgent, qualityEngineerAgent, maintenanceTechAgent, supplyChainAgent],
  tasks: [], // Start with empty tasks, orchestrator will select
  inputs: {
    productionOrder: {
      orderId: 'PO-2024-1138',
      product: 'Automotive Control Module ACM-X7',
      quantity: 10000,
      deadline: '2024-02-15',
      qualityLevel: 'automotive-grade',
      customer: 'BMW Manufacturing',
    },
    factoryStatus: {
      activeLines: 3,
      capacity: '85%',
      lastMaintenance: '2024-01-20',
      qualityMetrics: {
        currentYield: '97.2%',
        targetYield: '99.0%',
      },
    },
    constraints: {
      maxDowntime: '2 hours per week',
      qualityStandard: 'ISO/TS 16949',
      environmentalCompliance: 'ISO 14001',
    },
  },
  
  // Orchestration configuration for adaptive manufacturing
  enableOrchestration: true,
  continuousOrchestration: true, // Adapt to real-time production changes
  backlogTasks: manufacturingTaskRepository,
  allowTaskGeneration: true,
  
  orchestrationStrategy: \`
    You are orchestrating a smart factory producing automotive components.
    
    GOALS:
    1. Meet deadlines with 99%+ quality
    2. Maximize efficiency, prevent breakdowns
    3. Predictive maintenance
    4. Supply chain coordination
    
    ADAPTATION:
    - Efficiency drop > 10% → investigate
    - Quality issues → halt production
    - Maintenance alerts → override schedule
  \`,
  
  mode: 'adaptive', // Responsive to production dynamics
  maxActiveTasks: 6, // Handle multiple aspects simultaneously
  taskPrioritization: 'dynamic', // Adjust based on production needs
  workloadDistribution: 'skills-based', // Match expertise to tasks
  
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
console.log('Smart Factory Team configured for Order:', manufacturingTeam.inputs.productionOrder.orderId);
console.log('Production Target:', manufacturingTeam.inputs.productionOrder.quantity, 'units by', manufacturingTeam.inputs.productionOrder.deadline);
console.log('Orchestration Mode:', manufacturingTeam.mode);
console.log('Continuous Optimization:', manufacturingTeam.continuousOrchestration ? 'Enabled' : 'Disabled');
    `,
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'KaibanJS Manufacturing Example',
  };
};