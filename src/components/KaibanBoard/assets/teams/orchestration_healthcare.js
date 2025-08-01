export const orchestrationHealthcareOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Custom Healthcare Tools - Browser-compatible implementation
class PatientRecordTool {
  constructor() {
    this.name = 'patient_record_tool';
    this.description = 'Access and update patient medical records with proper authorization';
  }

  async invoke(input) {
    const { action, patientId, data } = input;
    
    // Simulate patient record operations
    const mockRecords = {
      'P001': { name: 'John Doe', age: 45, conditions: ['diabetes', 'hypertension'] },
      'P002': { name: 'Jane Smith', age: 32, conditions: ['asthma'] },
    };

    switch (action) {
      case 'read':
        return JSON.stringify(mockRecords[patientId] || { error: 'Patient not found' });
      case 'update':
        return \`Updated patient \${patientId} records with: \${JSON.stringify(data)}\`;
      case 'create':
        return \`Created new patient record for \${patientId}\`;
      default:
        return 'Invalid action';
    }
  }
}

class DiagnosisAssistantTool {
  constructor() {
    this.name = 'diagnosis_assistant';
    this.description = 'Assist with medical diagnosis based on symptoms and test results';
  }

  async invoke(input) {
    const { symptoms, testResults, patientHistory } = input;
    
    // Simulate diagnosis assistance
    const analysis = {
      symptoms: symptoms || [],
      possibleConditions: ['Condition A (70%)', 'Condition B (20%)', 'Condition C (10%)'],
      recommendedTests: ['Blood test', 'X-ray'],
      urgencyLevel: (symptoms && symptoms.length > 3) ? 'high' : 'medium',
    };
    
    return JSON.stringify(analysis);
  }
}

// Create specialized healthcare agents with custom tools
const doctorAgent = new Agent({
  name: 'Dr. Sarah Chen',
  role: 'Chief Medical Officer',
  goal: 'Ensure high-quality patient care and medical decision making',
  background: 'Board-certified physician with 15 years experience in internal medicine and hospital administration',
  tools: [new DiagnosisAssistantTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.2, // Lower temperature for medical decisions
  },
});

const nurseAgent = new Agent({
  name: 'Nurse Manager Johnson',
  role: 'Head Nurse',
  goal: 'Coordinate patient care and manage nursing staff efficiently',
  background: 'Registered nurse with expertise in patient care coordination and staff management',
  tools: [new PatientRecordTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.3,
  },
});

const adminAgent = new Agent({
  name: 'Administrator Williams',
  role: 'Healthcare Administrator',
  goal: 'Optimize hospital operations and resource allocation',
  background: 'Healthcare administration specialist focused on efficiency and compliance',
  tools: [new PatientRecordTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.4,
  },
});

const labTechAgent = new Agent({
  name: 'Lab Tech Rodriguez',
  role: 'Laboratory Specialist',
  goal: 'Provide accurate and timely diagnostic test results',
  background: 'Clinical laboratory scientist with expertise in diagnostic testing',
  tools: [],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.2,
  },
});

// Create comprehensive healthcare task repository
const healthcareTaskRepository = [
  // Patient Assessment Tasks
  new Task({
    title: 'Initial Patient Assessment',
    description: 'Conduct comprehensive initial assessment for newly admitted patients',
    expectedOutput: 'Complete patient assessment with vital signs, medical history, and initial diagnosis',
    agent: doctorAgent,
    adaptable: true,
    dynamicPriority: true,
    priority: 'high',
    externalValidationRequired: true, // Senior doctor review required
    orchestrationRules: \`
      CRITICAL RULES:
      - Must be completed within 30 minutes for emergency cases
      - Requires verification of patient identity
      - Must include allergy and medication history
      - Emergency cases take absolute priority
      
      ADAPTATION ALLOWED:
      - Assessment depth based on patient condition
      - Additional specialists can be consulted
      - Can be expedited for critical cases
    \`,
    resourceRequirements: {
      estimatedTime: '30-60 minutes',
      skillsRequired: ['medical-assessment', 'diagnosis', 'patient-communication'],
      dependencies: [],
    },
    qualityGates: ['identity-verification', 'vital-signs-recorded', 'history-documented'],
  }),

  new Task({
    title: 'Medication Administration',
    description: 'Administer prescribed medications following safety protocols',
    expectedOutput: 'Medications administered safely with proper documentation',
    agent: nurseAgent,
    adaptable: false, // Medication protocols are strict
    priority: 'high',
    externalValidationRequired: true,
    orchestrationRules: \`
      SAFETY PROTOCOLS (NON-NEGOTIABLE):
      - Double-check patient identity
      - Verify medication, dose, route, and time
      - Check for allergies and interactions
      - Document administration immediately
      
      NO ADAPTATIONS ALLOWED for medication protocols
    \`,
    resourceRequirements: {
      estimatedTime: '15-30 minutes',
      skillsRequired: ['medication-administration', 'safety-protocols', 'documentation'],
      dependencies: ['patient-assessment', 'prescription-verification'],
    },
    qualityGates: ['identity-verified', 'prescription-checked', 'allergies-reviewed', 'documented'],
  }),

  new Task({
    title: 'Diagnostic Testing',
    description: 'Perform required diagnostic tests and analyze results',
    expectedOutput: 'Complete diagnostic test results with preliminary analysis',
    agent: labTechAgent,
    adaptable: true,
    dynamicPriority: true,
    splitStrategy: 'auto', // Can be split into multiple specific tests
    orchestrationRules: \`
      TESTING PRIORITIES:
      - STAT orders processed immediately
      - Critical values reported within 15 minutes
      - Routine tests within standard timeframes
      
      ADAPTATIONS:
      - Test order can be modified based on initial results
      - Additional tests can be recommended
      - Can batch non-urgent tests for efficiency
    \`,
    resourceRequirements: {
      estimatedTime: '1-4 hours',
      skillsRequired: ['laboratory-testing', 'result-analysis', 'quality-control'],
      dependencies: ['patient-assessment', 'test-orders'],
    },
  }),

  new Task({
    title: 'Patient Monitoring',
    description: 'Continuous monitoring of patient vital signs and condition',
    expectedOutput: 'Regular monitoring reports with alerts for any concerning changes',
    agent: nurseAgent,
    adaptable: true,
    dynamicPriority: true,
    mergeCompatible: ['medication-administration', 'patient-care'],
    orchestrationRules: \`
      MONITORING FREQUENCY:
      - ICU patients: Every 15 minutes
      - Critical: Every 30 minutes  
      - Stable: Every 2-4 hours
      
      ESCALATION:
      - Any abnormal vitals trigger immediate doctor notification
      - Trending deterioration requires intervention
    \`,
    resourceRequirements: {
      estimatedTime: 'Continuous',
      skillsRequired: ['vital-signs-monitoring', 'patient-assessment', 'alert-recognition'],
      dependencies: ['patient-admission'],
    },
  }),

  new Task({
    title: 'Discharge Planning',
    description: 'Coordinate patient discharge with appropriate follow-up care',
    expectedOutput: 'Complete discharge plan with medications, instructions, and follow-up appointments',
    agent: adminAgent,
    adaptable: true,
    priority: 'medium',
    splitStrategy: 'manual',
    orchestrationRules: \`
      DISCHARGE REQUIREMENTS:
      - Medical clearance from attending physician
      - Medication reconciliation completed
      - Follow-up appointments scheduled
      - Patient education provided
      
      ADAPTATIONS:
      - Home health services if needed
      - Special transportation arrangements
      - Language-specific instructions
    \`,
    resourceRequirements: {
      estimatedTime: '2-3 hours',
      skillsRequired: ['care-coordination', 'documentation', 'patient-education'],
      dependencies: ['medical-clearance', 'medication-reconciliation'],
    },
  }),

  new Task({
    title: 'Emergency Response',
    description: 'Rapid response to medical emergencies and code situations',
    expectedOutput: 'Stabilized patient with complete emergency response documentation',
    agent: doctorAgent,
    adaptable: false,
    dynamicPriority: true,
    priority: 'high',
    externalValidationRequired: false, // No time for external validation in emergencies
    orchestrationRules: \`
      EMERGENCY PROTOCOLS:
      - Immediate response required
      - All other tasks suspended
      - Follow ACLS/BLS protocols
      - Rapid decision making authorized
      
      NO ADAPTATIONS during active emergency response
    \`,
    resourceRequirements: {
      estimatedTime: 'Immediate - 1 hour',
      skillsRequired: ['emergency-medicine', 'rapid-response', 'team-coordination'],
      dependencies: [],
    },
    qualityGates: ['patient-stabilized', 'team-debriefed', 'incident-documented'],
  }),

  new Task({
    title: 'Staff Scheduling',
    description: 'Create and optimize staff schedules ensuring adequate coverage',
    expectedOutput: 'Optimized staff schedule meeting all coverage requirements',
    agent: adminAgent,
    adaptable: true,
    priority: 'medium',
    orchestrationRules: \`
      SCHEDULING CONSTRAINTS:
      - Maintain nurse-to-patient ratios
      - Ensure specialty coverage 24/7
      - Account for staff certifications
      - Balance workload fairly
      
      ADAPTATIONS:
      - Adjust for unexpected absences
      - Increase staffing for high census
      - Specialty requirements for complex cases
    \`,
    resourceRequirements: {
      estimatedTime: '2-4 hours',
      skillsRequired: ['staff-management', 'scheduling', 'resource-optimization'],
      dependencies: ['census-data', 'staff-availability'],
    },
  }),
];

// Create healthcare team with comprehensive orchestration configuration
const hospitalTeam = new Team({
  name: 'Hospital Operations Team',
  agents: [doctorAgent, nurseAgent, adminAgent, labTechAgent],
  tasks: [], // Start empty - orchestrator will select based on inputs
  
  // ===== Orchestration Configuration =====
  enableOrchestration: true,
  continuousOrchestration: true, // Adaptive to changing patient needs
  backlogTasks: healthcareTaskRepository,
  allowTaskGeneration: true, // Can create new tasks for unexpected situations
  
  orchestrationStrategy: \`
    You are orchestrating a hospital operations team focused on patient safety and care quality.
    
    CRITICAL PRIORITIES:
    1. Patient safety is paramount - never compromise on safety protocols
    2. Emergency cases always take precedence over routine care
    3. Maintain strict medication administration protocols
    4. Ensure proper staff-to-patient ratios at all times
    
    OPERATIONAL GOALS:
    - Minimize patient wait times while maintaining quality
    - Optimize resource utilization across departments
    - Ensure compliance with healthcare regulations
    - Maintain high patient satisfaction scores
    
    CONSTRAINTS:
    - Limited ICU beds require careful patient prioritization
    - Staff must not exceed 12-hour shifts
    - All critical decisions require appropriate validation
    - Budget constraints on overtime and resources
    
    QUALITY METRICS:
    - Patient safety incidents: Zero tolerance
    - Average patient wait time: <2 hours for non-emergency
    - Medication error rate: <0.01%
    - Patient satisfaction: >90%
    
    ADAPTATION RULES:
    - Immediately re-prioritize for emergency cases
    - Scale resources based on patient acuity
    - Consider creating specialized tasks for complex cases
    - Balance efficiency with thoroughness
  \`,
  
  mode: 'conservative', // Safety-first approach for healthcare
  maxActiveTasks: 6, // Handle multiple patients simultaneously
  taskPrioritization: 'ai-driven', // Dynamic prioritization based on patient acuity
  workloadDistribution: 'skills-based', // Match medical specialties to tasks
  
  // LLM configuration for healthcare-aware orchestration
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.2, // Low temperature for consistent medical decisions
    maxRetries: 3,
  },
  
  env: {
    OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'
  }
});

// Healthcare-specific inputs that influence orchestration
const hospitalInputs = {
  // Current hospital state
  currentCensus: 145,
  icuOccupancy: 85, // percentage
  edWaitTime: 3.5, // hours
  
  // Staffing levels
  doctorCount: 12,
  nurseCount: 48,
  nursePatientRatio: '1:4',
  
  // Patient acuity
  criticalPatients: 8,
  emergencyAdmissions: 3,
  routinePatients: 134,
  
  // Time context
  shift: 'day', // day, evening, night
  dayOfWeek: 'Monday',
  
  // Special circumstances
  fluSeason: true,
  codeBlueActive: false,
  masscasualtyEvent: false,
  
  // Compliance requirements
  jointCommissionVisit: false,
  mandatoryTrainingDue: true,
};

// Add inputs to team configuration
hospitalTeam.inputs = hospitalInputs;

// Show current status
console.log('Hospital Team configured for Current Conditions');
console.log('Patient Census:', hospitalInputs.currentCensus);
console.log('ICU Occupancy:', hospitalInputs.icuOccupancy + '%');
console.log('Critical Patients:', hospitalInputs.criticalPatients);
console.log('Orchestration Mode:', hospitalTeam.mode);
console.log('Continuous Adaptation:', hospitalTeam.continuousOrchestration ? 'Enabled' : 'Disabled');
`,
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'KaibanJS Healthcare Example',
  };
};