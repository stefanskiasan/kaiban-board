export const orchestrationLegalOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Custom Legal Tools - Browser-compatible implementation
class ContractAnalyzerTool {
  constructor() {
    this.name = 'contract_analyzer';
    this.description = 'AI-powered contract analysis for clauses, risks, and compliance issues';
  }

  async invoke(input) {
    const { documentId, contractType, analysisDepth } = input;
    
    // Simulate contract analysis with realistic legal findings
    const clauseTypes = ['liability', 'indemnification', 'termination', 'confidentiality', 'payment', 'warranty'];
    const riskLevels = ['low', 'medium', 'high', 'critical'];
    
    const findings = [];
    const numFindings = analysisDepth === 'comprehensive' ? 8 : 4;
    
    for (let i = 0; i < numFindings; i++) {
      findings.push({
        clause: clauseTypes[Math.floor(Math.random() * clauseTypes.length)],
        section: \`Section \${Math.floor(Math.random() * 20) + 1}.\${Math.floor(Math.random() * 5) + 1}\`,
        riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        issue: i % 2 === 0 ? 'Ambiguous language' : 'Missing protective clause',
        recommendation: 'Revise for clarity and add specific terms',
      });
    }
    
    const complianceScore = 70 + Math.random() * 25; // 70-95% compliance
    
    return JSON.stringify({
      documentId,
      contractType,
      analysis: {
        totalClauses: 127,
        reviewedClauses: numFindings * 15,
        findings,
        complianceScore: \`\${complianceScore.toFixed(1)}%\`,
        estimatedReviewTime: analysisDepth === 'comprehensive' ? '4-6 hours' : '2-3 hours',
      },
      criticalIssues: findings.filter(f => f.riskLevel === 'critical' || f.riskLevel === 'high'),
      recommendations: {
        immediate: findings.filter(f => f.riskLevel === 'critical').map(f => \`Address \${f.clause} clause urgently\`),
        standard: ['Review all liability limitations', 'Ensure governing law is favorable', 'Add dispute resolution clause'],
      },
    });
  }
}

class ComplianceCheckerTool {
  constructor() {
    this.name = 'compliance_checker';
    this.description = 'Check documents against regulatory requirements and internal policies';
  }

  async invoke(input) {
    const { documentType, jurisdiction, regulations } = input;
    
    // Simulate compliance checking
    const regulatoryFrameworks = ['GDPR', 'CCPA', 'SOX', 'HIPAA', 'FCPA', 'AML'];
    const applicableRegs = regulations || regulatoryFrameworks.slice(0, 3);
    
    const complianceResults = {};
    applicableRegs.forEach(reg => {
      const score = 75 + Math.random() * 20; // 75-95% compliance
      complianceResults[reg] = {
        score: \`\${score.toFixed(1)}%\`,
        gaps: score < 85 ? ['Missing required disclosures', 'Incomplete data retention policy'] : [],
        status: score >= 90 ? 'compliant' : score >= 80 ? 'minor_gaps' : 'requires_attention',
      };
    });
    
    return JSON.stringify({
      documentType,
      jurisdiction,
      complianceResults,
      overallCompliance: Object.values(complianceResults).every(r => r.status === 'compliant'),
      requiredActions: Object.entries(complianceResults)
        .filter(([_, result]) => result.gaps.length > 0)
        .map(([reg, result]) => ({
          regulation: reg,
          actions: result.gaps,
          priority: result.status === 'requires_attention' ? 'high' : 'medium',
        })),
      certificationReady: Object.values(complianceResults).every(r => parseFloat(r.score) >= 90),
    });
  }
}

class LegalResearchTool {
  constructor() {
    this.name = 'legal_research';
    this.description = 'Research case law, precedents, and legal interpretations';
  }

  async invoke(input) {
    const { topic, jurisdiction, depth } = input;
    
    // Simulate legal research results
    const cases = [
      { name: 'Smith v. Corporation', year: 2022, relevance: 'high', summary: 'Established precedent for liability limits' },
      { name: 'Doe v. Enterprise Inc', year: 2021, relevance: 'medium', summary: 'Clarified indemnification scope' },
      { name: 'State v. Business LLC', year: 2023, relevance: 'high', summary: 'Recent ruling on compliance requirements' },
    ];
    
    const statutes = [
      { code: 'USC 15 § 78dd-1', title: 'Foreign Corrupt Practices Act', applicability: 'direct' },
      { code: 'state_code_123.45', title: 'Business Entity Regulations', applicability: 'indirect' },
    ];
    
    return JSON.stringify({
      topic,
      jurisdiction,
      research: {
        relevantCases: depth === 'comprehensive' ? cases : cases.slice(0, 2),
        applicableStatutes: statutes,
        keyFindings: [
          'Recent precedent supports limitation of liability',
          'Jurisdiction requires specific disclosure language',
          'Regulatory landscape changing - monitor updates',
        ],
        recommendations: 'Incorporate recent case law interpretations into contract language',
      },
    });
  }
}

// Create specialized legal agents with custom tools
const seniorPartnerAgent = new Agent({
  name: 'Elizabeth Hartley, Esq.',
  role: 'Senior Partner - Corporate Law',
  goal: 'Ensure all contracts protect client interests and comply with regulations',
  background: 'JD Harvard Law, 25 years in M&A and corporate contracts, admitted to NY and CA bars',
  tools: [new ContractAnalyzerTool(), new LegalResearchTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.1, // Very low for legal precision
  },
});

const complianceOfficerAgent = new Agent({
  name: 'Michael Thompson, JD, CAMS',
  role: 'Chief Compliance Officer',
  goal: 'Ensure all documents meet regulatory requirements and internal policies',
  background: 'Former SEC attorney, certified anti-money laundering specialist, expert in financial regulations',
  tools: [new ComplianceCheckerTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.1,
  },
});

const contractSpecialistAgent = new Agent({
  name: 'Sarah Kim, Esq.',
  role: 'Contract Specialist',
  goal: 'Draft and review contracts with attention to detail and risk mitigation',
  background: 'JD Columbia, specialized in technology and IP contracts, fluent in technical terms',
  tools: [new ContractAnalyzerTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.2,
  },
});

const paralegalAgent = new Agent({
  name: 'David Martinez',
  role: 'Senior Paralegal',
  goal: 'Support attorneys with research, document preparation, and case management',
  background: 'Certified paralegal, 10 years experience in corporate law, expert in legal research databases',
  tools: [new LegalResearchTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.3,
  },
});

// Create comprehensive legal task repository
const legalTaskRepository = [
  // Contract Review Tasks
  new Task({
    title: 'Comprehensive Contract Review',
    description: 'Perform detailed analysis of contract terms, risks, and compliance',
    expectedOutput: 'Contract review report with risk assessment and recommendations',
    agent: seniorPartnerAgent,
    adaptable: false, // Legal review process is standardized
    priority: 'critical',
    externalValidationRequired: true, // Partner approval needed
    orchestrationRules: \`
      REVIEW PROTOCOL:
      - Line-by-line analysis of all clauses
      - Risk assessment for each section
      - Compliance check against applicable laws
      - Precedent research for key terms
      
      CRITICAL AREAS:
      - Liability and indemnification
      - Termination and breach remedies
      - Intellectual property rights
      - Dispute resolution mechanisms
      
      VALIDATION REQUIREMENTS:
      - Senior partner review for high-value contracts
      - Compliance officer sign-off
      - Client approval for material changes
    \`,
    resourceRequirements: {
      estimatedTime: '4-8 hours',
      skillsRequired: ['contract-law', 'risk-assessment', 'regulatory-knowledge'],
      dependencies: ['contract-database', 'legal-research-tools'],
    },
    qualityGates: ['initial-review', 'risk-assessment', 'compliance-check', 'partner-approval'],
  }),

  new Task({
    title: 'Regulatory Compliance Audit',
    description: 'Ensure all documents comply with current regulations and policies',
    expectedOutput: 'Compliance report with gap analysis and remediation plan',
    agent: complianceOfficerAgent,
    adaptable: true, // Can adapt based on regulatory changes
    dynamicPriority: true,
    splitStrategy: 'auto', // Can split by regulation or document type
    orchestrationRules: \`
      AUDIT SCOPE:
      - All applicable federal regulations
      - State-specific requirements
      - Industry standards and best practices
      - Internal compliance policies
      
      PRIORITY ADJUSTMENTS:
      - New regulations take precedence
      - Client-specific requirements
      - Enforcement action risks
      
      DOCUMENTATION:
      - Detailed compliance checklist
      - Evidence of compliance
      - Remediation timeline
    \`,
    resourceRequirements: {
      estimatedTime: '3-5 hours',
      skillsRequired: ['regulatory-expertise', 'compliance-frameworks', 'audit-procedures'],
      dependencies: ['regulatory-updates', 'compliance-databases'],
    },
  }),

  new Task({
    title: 'Contract Drafting and Negotiation',
    description: 'Draft new contracts or negotiate terms with counterparties',
    expectedOutput: 'Draft contract with negotiation strategy and fallback positions',
    agent: contractSpecialistAgent,
    adaptable: true,
    mergeCompatible: ['contract-review', 'compliance-audit'],
    orchestrationRules: \`
      DRAFTING PRINCIPLES:
      - Clear and unambiguous language
      - Balanced risk allocation
      - Enforceable terms
      - Client-favorable positions
      
      NEGOTIATION STRATEGY:
      - Identify must-have vs nice-to-have terms
      - Prepare fallback positions
      - Document negotiation history
      - Maintain professional relationships
    \`,
    resourceRequirements: {
      estimatedTime: '3-6 hours',
      skillsRequired: ['contract-drafting', 'negotiation', 'business-acumen'],
      dependencies: ['contract-templates', 'precedent-library'],
    },
  }),

  new Task({
    title: 'Legal Research and Memo Preparation',
    description: 'Research legal questions and prepare memoranda with recommendations',
    expectedOutput: 'Legal memorandum with research findings and strategic recommendations',
    agent: paralegalAgent,
    adaptable: true,
    dynamicPriority: true,
    orchestrationRules: \`
      RESEARCH METHODOLOGY:
      - Case law analysis
      - Statutory interpretation
      - Regulatory guidance review
      - Secondary source consultation
      
      MEMO STRUCTURE:
      - Executive summary
      - Issue presented
      - Brief answer
      - Discussion and analysis
      - Conclusion and recommendations
    \`,
    resourceRequirements: {
      estimatedTime: '2-4 hours',
      skillsRequired: ['legal-research', 'legal-writing', 'analytical-thinking'],
      dependencies: ['westlaw-access', 'lexis-nexis', 'legal-library'],
    },
  }),

  new Task({
    title: 'Document Management and Version Control',
    description: 'Manage document versions, track changes, and maintain audit trail',
    expectedOutput: 'Organized document repository with complete version history',
    agent: paralegalAgent,
    adaptable: false, // Strict process for legal documents
    priority: 'medium',
    orchestrationRules: \`
      MANAGEMENT REQUIREMENTS:
      - Version control for all documents
      - Change tracking with attribution
      - Secure storage and access control
      - Retention policy compliance
      
      AUDIT TRAIL:
      - Who made changes and when
      - Approval history
      - Distribution records
      - Destruction schedules
    \`,
    resourceRequirements: {
      estimatedTime: '1-2 hours',
      skillsRequired: ['document-management', 'attention-to-detail', 'organization'],
      dependencies: ['dms-system', 'version-control-software'],
    },
  }),
];

// Define inputs
const legalInputs = {
  currentProject: {
    type: 'M&A Transaction',
    dealValue: '$50M',
    parties: {
      buyer: 'TechCorp International',
      seller: 'Innovation Startup LLC',
    },
    timeline: '60 days to close',
    jurisdiction: 'Delaware, USA',
    complexity: 'high',
  },
  contractDetails: {
    primaryAgreement: 'Stock Purchase Agreement',
    ancillaryDocs: ['Employment Agreements', 'IP Assignments', 'Escrow Agreement'],
    dueDiligenceItems: 156,
    identifiedRisks: ['IP ownership unclear', 'Pending litigation', 'Regulatory approval needed'],
  },
  regulatoryContext: {
    applicableRegs: ['Securities laws', 'Antitrust', 'FCPA', 'Data Privacy'],
    filingRequirements: ['HSR filing', 'State notifications'],
    complianceDeadlines: {
      HSR: '2024-02-20',
      stateFilings: '2024-02-25',
    },
  },
};

// Create the legal team with intelligent orchestration
const legalTeam = new Team({
  name: 'Corporate Legal Services Team',
  agents: [seniorPartnerAgent, complianceOfficerAgent, contractSpecialistAgent, paralegalAgent],
  tasks: [], // Start with empty tasks, orchestrator will select
  inputs: legalInputs,
  
  // Orchestration configuration for legal precision
  enableOrchestration: true,
  continuousOrchestration: false, // Legal work follows structured phases
  backlogTasks: legalTaskRepository,
  allowTaskGeneration: false, // Strict adherence to legal procedures
  
  orchestrationStrategy: \`
    You are orchestrating a legal team for a complex M&A transaction.
    
    LEGAL OBJECTIVES:
    1. Protect client interests through careful contract drafting
    2. Ensure full regulatory compliance
    3. Identify and mitigate all legal risks
    4. Meet transaction timeline without compromising quality
    
    PROFESSIONAL STANDARDS:
    - Maintain attorney-client privilege
    - Follow ethical rules and bar requirements
    - Document all advice and decisions
    - Ensure accuracy in all legal work
    
    RISK MANAGEMENT:
    - No tolerance for compliance failures
    - Conservative approach to legal interpretations
    - Multiple reviews for critical documents
    - Clear escalation for significant issues
    
    WORKFLOW PRINCIPLES:
    - Sequential review process (junior to senior)
    - Parallel workstreams where possible
    - Clear documentation trail
    - Client communication at key milestones
  \`,
  
  mode: 'conservative', // Careful, methodical approach
  maxActiveTasks: 4, // Controlled workload for quality
  taskPrioritization: 'static', // Follow established legal procedures
  workloadDistribution: 'skills-based', // Match expertise to complexity
  
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.2, // Low temperature for consistency
  },
  
  env: {
    OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'
  }
});

// Add inputs to team
legalTeam.inputs = legalInputs;

// Show current status
console.log('Legal Team configured for:', legalInputs.currentProject.type);
console.log('Deal Value:', legalInputs.currentProject.dealValue);
console.log('Timeline:', legalInputs.currentProject.timeline);
console.log('Orchestration Mode:', legalTeam.mode);
console.log('Task Generation:', legalTeam.allowTaskGeneration ? 'Enabled' : 'Disabled (Following standard procedures)');
    `,
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'KaibanJS Legal Example',
  };
};