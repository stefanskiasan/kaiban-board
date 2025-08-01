export const orchestrationFinanceOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Custom Finance Tools - Browser-compatible implementation
class MarketAnalysisTool {
  constructor() {
    this.name = 'market_analysis';
    this.description = 'Analyze market conditions and trends for investment decisions';
  }

  async invoke(input) {
    const { sector, timeframe, indicators } = input;
    
    // Simulate market analysis
    const analysis = {
      sector,
      timeframe,
      trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
      volatility: Math.random() * 100,
      recommendations: ['Buy tech stocks', 'Hold healthcare', 'Sell energy'],
      riskScore: Math.floor(Math.random() * 10) + 1,
    };
    
    return JSON.stringify(analysis);
  }
}

class RiskCalculatorTool {
  constructor() {
    this.name = 'risk_calculator';
    this.description = 'Calculate portfolio risk metrics and suggest risk mitigation strategies';
  }

  async invoke(input) {
    const { portfolio, riskTolerance } = input;
    
    // Simulate risk calculation
    const totalRisk = portfolio ? portfolio.reduce((sum, item) => sum + (item.allocation * Math.random()), 0) : 0;
    
    return JSON.stringify({
      portfolioRisk: totalRisk.toFixed(2),
      riskLevel: totalRisk > 50 ? 'high' : totalRisk > 25 ? 'medium' : 'low',
      recommendations: riskTolerance === 'low' ? 
        ['Increase bonds allocation', 'Reduce volatile stocks'] :
        ['Current allocation acceptable', 'Consider growth opportunities'],
    });
  }
}

// Create specialized finance agents with custom tools
const portfolioManagerAgent = new Agent({
  name: 'Patricia Goldman',
  role: 'Senior Portfolio Manager',
  goal: 'Maximize returns while managing risk within client parameters',
  background: 'CFA with 20 years experience in portfolio management and asset allocation',
  tools: [new MarketAnalysisTool(), new RiskCalculatorTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.2, // Low temperature for financial decisions
  },
});

const riskAnalystAgent = new Agent({
  name: 'Robert Chen',
  role: 'Chief Risk Officer',
  goal: 'Identify, assess, and mitigate portfolio risks',
  background: 'Quantitative analyst specializing in risk modeling and compliance',
  tools: [new RiskCalculatorTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.1, // Very low for risk assessment
  },
});

const complianceOfficerAgent = new Agent({
  name: 'Sarah Thompson',
  role: 'Compliance Officer',
  goal: 'Ensure all transactions meet regulatory requirements',
  background: 'Legal and compliance expert with focus on SEC and international regulations',
  tools: [],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.1,
  },
});

const tradingAnalystAgent = new Agent({
  name: 'Michael Zhang',
  role: 'Trading Analyst',
  goal: 'Execute trades efficiently while minimizing market impact',
  background: 'Algorithmic trading specialist with expertise in market microstructure',
  tools: [new MarketAnalysisTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.3,
  },
});

// Create comprehensive finance task repository
const financeTaskRepository = [
  // Portfolio Analysis Tasks
  new Task({
    title: 'Daily Portfolio Review',
    description: 'Comprehensive review of portfolio performance and risk metrics',
    expectedOutput: 'Portfolio performance report with risk analysis and recommendations',
    agent: portfolioManagerAgent,
    adaptable: true,
    dynamicPriority: true,
    priority: 'high',
    externalValidationRequired: false,
    orchestrationRules: \`
      REVIEW REQUIREMENTS:
      - Must be completed before market open
      - Include overnight market movements
      - Flag any positions exceeding risk limits
      - Identify rebalancing opportunities
      
      ADAPTATIONS:
      - Deeper analysis for volatile market conditions
      - Fast-track review if major market events
      - Additional focus on concentrated positions
    \`,
    resourceRequirements: {
      estimatedTime: '1-2 hours',
      skillsRequired: ['portfolio-analysis', 'risk-assessment', 'market-knowledge'],
      dependencies: ['market-data-feed'],
    },
    qualityGates: ['data-accuracy-verified', 'risk-limits-checked', 'performance-calculated'],
  }),

  new Task({
    title: 'Risk Assessment and Stress Testing',
    description: 'Conduct comprehensive risk analysis and stress test portfolio',
    expectedOutput: 'Risk report with VaR, stress test results, and mitigation recommendations',
    agent: riskAnalystAgent,
    adaptable: true,
    priority: 'high',
    splitStrategy: 'auto', // Can split by asset class or risk type
    orchestrationRules: \`
      RISK ANALYSIS REQUIREMENTS:
      - Calculate Value at Risk (95% and 99% confidence)
      - Run stress tests for major market scenarios
      - Assess correlation risks
      - Check concentration limits
      
      STRESS SCENARIOS:
      - Market crash (-20%)
      - Interest rate spike (+200bps)
      - Currency devaluation
      - Sector-specific shocks
      
      ADAPTATIONS:
      - Additional scenarios based on current events
      - Deeper dive into high-risk positions
      - Custom stress tests for client concerns
    \`,
    resourceRequirements: {
      estimatedTime: '2-3 hours',
      skillsRequired: ['quantitative-analysis', 'risk-modeling', 'statistics'],
      dependencies: ['portfolio-data', 'market-data'],
    },
    qualityGates: ['models-validated', 'data-quality-assured', 'results-cross-checked'],
  }),

  new Task({
    title: 'Compliance Review',
    description: 'Ensure all holdings and transactions meet regulatory requirements',
    expectedOutput: 'Compliance certification with any violations flagged for remediation',
    agent: complianceOfficerAgent,
    adaptable: false, // Compliance rules are strict
    priority: 'high',
    externalValidationRequired: true, // Legal review required
    orchestrationRules: \`
      COMPLIANCE CHECKS (MANDATORY):
      - SEC regulations compliance
      - International regulatory requirements
      - Client mandate adherence
      - Insider trading restrictions
      - Position limits and concentration rules
      
      NO ADAPTATIONS for regulatory requirements
      
      REPORTING:
      - Document all violations
      - Propose remediation actions
      - Set deadlines for corrections
    \`,
    resourceRequirements: {
      estimatedTime: '2-3 hours',
      skillsRequired: ['regulatory-knowledge', 'legal-compliance', 'documentation'],
      dependencies: ['transaction-history', 'position-report'],
    },
    qualityGates: ['all-regulations-checked', 'violations-documented', 'remediation-planned'],
  }),

  new Task({
    title: 'Market Opportunity Analysis',
    description: 'Identify and evaluate new investment opportunities',
    expectedOutput: 'Investment recommendations with risk/return analysis',
    agent: portfolioManagerAgent,
    adaptable: true,
    dynamicPriority: true,
    priority: 'medium',
    orchestrationRules: \`
      OPPORTUNITY SCANNING:
      - Sector rotation opportunities
      - Undervalued securities
      - Arbitrage possibilities
      - Emerging market trends
      
      EVALUATION CRITERIA:
      - Risk-adjusted returns
      - Correlation with existing portfolio
      - Liquidity considerations
      - Time horizon alignment
      
      ADAPTATIONS:
      - Focus shifts based on market conditions
      - Deeper analysis for larger opportunities
      - Fast-track evaluation for time-sensitive trades
    \`,
    resourceRequirements: {
      estimatedTime: '3-4 hours',
      skillsRequired: ['market-analysis', 'valuation', 'research'],
      dependencies: ['market-data', 'research-reports'],
    },
  }),

  new Task({
    title: 'Trade Execution Planning',
    description: 'Plan and optimize trade execution to minimize market impact',
    expectedOutput: 'Detailed execution plan with timing and order routing strategy',
    agent: tradingAnalystAgent,
    adaptable: true,
    priority: 'high',
    mergeCompatible: ['order-management', 'settlement-planning'],
    orchestrationRules: \`
      EXECUTION PLANNING:
      - Analyze liquidity patterns
      - Determine optimal order sizing
      - Select execution venues
      - Plan timing to minimize impact
      
      CONSIDERATIONS:
      - Market depth and volume
      - Volatility forecasts
      - Correlation with market movements
      - Transaction cost analysis
      
      ADAPTATIONS:
      - Adjust for market conditions
      - Split large orders over time
      - Use algorithmic execution for complex trades
    \`,
    resourceRequirements: {
      estimatedTime: '1-2 hours',
      skillsRequired: ['trading', 'market-microstructure', 'algorithms'],
      dependencies: ['approved-trades', 'market-conditions'],
    },
  }),

  new Task({
    title: 'Client Reporting',
    description: 'Generate comprehensive performance and risk reports for clients',
    expectedOutput: 'Client-ready reports with performance attribution and outlook',
    agent: portfolioManagerAgent,
    adaptable: true,
    priority: 'medium',
    splitStrategy: 'manual', // Can split by client segment
    orchestrationRules: \`
      REPORT CONTENTS:
      - Performance vs benchmarks
      - Risk metrics and attribution
      - Transaction summary
      - Market commentary
      - Forward-looking outlook
      
      CLIENT CUSTOMIZATION:
      - Tailor depth to client sophistication
      - Highlight relevant concerns
      - Include requested analytics
      
      QUALITY STANDARDS:
      - Accuracy verification required
      - Clear visualizations
      - Regulatory disclosures included
    \`,
    resourceRequirements: {
      estimatedTime: '2-3 hours',
      skillsRequired: ['reporting', 'communication', 'data-visualization'],
      dependencies: ['performance-data', 'risk-analysis', 'market-commentary'],
    },
  }),

  new Task({
    title: 'Rebalancing Analysis',
    description: 'Analyze portfolio drift and recommend rebalancing trades',
    expectedOutput: 'Rebalancing recommendations with tax and cost considerations',
    agent: portfolioManagerAgent,
    adaptable: true,
    dynamicPriority: true,
    priority: 'medium',
    externalValidationRequired: true, // Large rebalances need approval
    orchestrationRules: \`
      REBALANCING TRIGGERS:
      - Asset allocation drift >5%
      - Risk limit breaches
      - Strategic allocation changes
      - Tax loss harvesting opportunities
      
      ANALYSIS REQUIREMENTS:
      - Calculate drift from targets
      - Estimate transaction costs
      - Consider tax implications
      - Minimize portfolio disruption
      
      CONSTRAINTS:
      - Respect minimum trade sizes
      - Consider liquidity constraints
      - Avoid wash sale rules
    \`,
    resourceRequirements: {
      estimatedTime: '2-3 hours',
      skillsRequired: ['portfolio-construction', 'tax-awareness', 'optimization'],
      dependencies: ['current-positions', 'target-allocation', 'tax-lots'],
    },
  }),
];

// Create finance team with sophisticated orchestration configuration
const investmentTeam = new Team({
  name: 'Investment Management Team',
  agents: [portfolioManagerAgent, riskAnalystAgent, complianceOfficerAgent, tradingAnalystAgent],
  tasks: [], // Orchestrator will select based on market conditions
  
  // ===== Orchestration Configuration =====
  enableOrchestration: true,
  continuousOrchestration: true, // Adapt to market changes
  backlogTasks: financeTaskRepository,
  allowTaskGeneration: true, // Generate tasks for new opportunities
  
  orchestrationStrategy: \`
    You are orchestrating an investment management team focused on generating superior risk-adjusted returns while maintaining strict compliance.
    
    INVESTMENT PHILOSOPHY:
    1. Risk management is paramount - protect capital first
    2. Compliance with all regulations is non-negotiable
    3. Seek alpha through disciplined analysis and execution
    4. Maintain portfolio liquidity for client needs
    
    OPERATIONAL PRIORITIES:
    - Morning: Portfolio review and risk assessment before market open
    - Trading hours: Monitor positions and execute approved trades
    - Afternoon: Analysis, research, and planning
    - End of day: Compliance checks and client reporting
    
    RISK PARAMETERS:
    - Maximum portfolio VaR: 2% at 95% confidence
    - Single position limit: 5% of portfolio
    - Sector concentration limit: 25%
    - Minimum liquidity: 80% in assets tradeable within 3 days
    
    COMPLIANCE REQUIREMENTS:
    - All trades require pre-trade compliance check
    - Daily position limit verification
    - Weekly regulatory reporting
    - Monthly client mandate review
    
    PERFORMANCE TARGETS:
    - Outperform benchmark by 200bps annually
    - Sharpe ratio > 1.2
    - Maximum drawdown < 10%
    - Tracking error < 4%
    
    ADAPTATION RULES:
    - Increase risk analysis frequency during market volatility
    - Generate opportunity tasks when markets dislocate
    - Expedite rebalancing when limits are breached
    - Enhance reporting during significant events
  \`,
  
  mode: 'adaptive', // Balance between caution and opportunity
  maxActiveTasks: 5, // Multiple parallel analyses
  taskPrioritization: 'ai-driven', // Respond to market conditions
  workloadDistribution: 'skills-based', // Match expertise to tasks
  
  // LLM configuration for finance-aware orchestration
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.15, // Very low temperature for financial consistency
    maxRetries: 3,
  },
  
  env: {
    OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'
  }
});

// Finance-specific inputs that influence orchestration
const marketInputs = {
  // Market conditions
  marketVolatility: 'high', // low, medium, high, extreme
  vixLevel: 28.5,
  marketTrend: 'bearish',
  
  // Portfolio metrics
  portfolioValue: 125000000, // $125M AUM
  currentCash: 8500000, // $8.5M cash
  portfolioVaR: 1.8, // % at 95% confidence
  sharpeRatio: 1.15,
  
  // Risk parameters
  riskTolerance: 'medium', // client risk tolerance
  investmentHorizon: 'long-term', // short, medium, long-term
  maxDrawdownLimit: 10, // percentage
  
  // Market opportunities
  sectorRotation: true,
  emergingOpportunities: ['technology-correction', 'energy-rebound'],
  
  // Compliance status
  regulatoryChanges: false,
  pendingAudits: false,
  clientMandateUpdates: true,
  
  // Time context
  tradingDay: true,
  quarterEnd: false,
  taxYearEnd: false,
  
  // External factors
  fedMeeting: true,
  economicDataRelease: 'CPI',
  geopoliticalEvents: ['trade-negotiations'],
};

// Add inputs to team configuration
investmentTeam.inputs = marketInputs;

// Show current status
console.log('Investment Team configured for Market Conditions');
console.log('VIX Level:', marketInputs.vixLevel);
console.log('Market Trend:', marketInputs.marketTrend);
console.log('Portfolio Value: $' + (marketInputs.portfolioValue / 1000000).toFixed(1) + 'M');
console.log('Orchestration Mode:', investmentTeam.mode);
console.log('Task Prioritization:', investmentTeam.taskPrioritization);
`,
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'KaibanJS Finance Example',
  };
};