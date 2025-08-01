export const orchestrationMarketingOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Custom Marketing Tools - Browser-compatible implementation
class ContentGeneratorTool {
  constructor() {
    this.name = 'content_generator';
    this.description = 'AI-powered content creation for various marketing channels and formats';
  }

  async invoke(input) {
    const { contentType, topic, tone, targetAudience, length } = input;
    
    // Simulate content generation with metadata
    const contentTypes = {
      'blog_post': { wordCount: 800, readingTime: '4 min', seoScore: 85 },
      'social_media': { wordCount: 150, engagement: 'high', hashtags: 5 },
      'email': { wordCount: 300, subject: 'Compelling Subject Line', preheader: 'Preview text' },
      'ad_copy': { wordCount: 50, cta: 'Shop Now', variants: 3 },
      'video_script': { duration: '2 min', scenes: 5, voiceover: true },
    };
    
    const metrics = contentTypes[contentType] || contentTypes['blog_post'];
    const sentimentScore = tone === 'professional' ? 0.7 : tone === 'casual' ? 0.8 : 0.75;
    
    return JSON.stringify({
      contentType,
      topic,
      metadata: {
        ...metrics,
        targetAudience,
        tone,
        sentimentScore,
        keywords: ['innovation', topic.toLowerCase(), 'solution', 'transform'],
        readabilityScore: 75 + Math.random() * 15,
      },
      preview: \`Generated \${contentType} content about \${topic} for \${targetAudience} audience...\`,
      variations: contentType === 'ad_copy' ? 3 : 1,
      recommendations: [
        'Include customer testimonials',
        'Add compelling visuals',
        'Optimize for mobile viewing',
      ],
    });
  }
}

class AnalyticsTool {
  constructor() {
    this.name = 'analytics_tool';
    this.description = 'Real-time campaign performance analytics and insights';
  }

  async invoke(input) {
    const { campaignId, metrics, timeframe, channels } = input;
    
    // Simulate analytics data
    const performance = {
      impressions: Math.floor(50000 + Math.random() * 100000),
      clicks: Math.floor(2000 + Math.random() * 5000),
      conversions: Math.floor(50 + Math.random() * 200),
      spend: Math.floor(1000 + Math.random() * 4000),
    };
    
    const ctr = (performance.clicks / performance.impressions * 100).toFixed(2);
    const conversionRate = (performance.conversions / performance.clicks * 100).toFixed(2);
    const cpa = (performance.spend / performance.conversions).toFixed(2);
    const roi = ((performance.conversions * 150 - performance.spend) / performance.spend * 100).toFixed(1);
    
    const channelBreakdown = {
      'social_media': { impressions: performance.impressions * 0.4, ctr: '3.2%', spend: performance.spend * 0.35 },
      'search': { impressions: performance.impressions * 0.3, ctr: '5.1%', spend: performance.spend * 0.4 },
      'display': { impressions: performance.impressions * 0.2, ctr: '1.8%', spend: performance.spend * 0.15 },
      'email': { impressions: performance.impressions * 0.1, ctr: '22.5%', spend: performance.spend * 0.1 },
    };
    
    return JSON.stringify({
      campaignId,
      timeframe,
      performance: {
        ...performance,
        ctr: \`\${ctr}%\`,
        conversionRate: \`\${conversionRate}%\`,
        cpa: \`$\${cpa}\`,
        roi: \`\${roi}%\`,
      },
      channelBreakdown,
      insights: [
        roi > 100 ? 'Campaign is profitable, consider scaling' : 'Optimize for better ROI',
        parseFloat(ctr) < 2 ? 'CTR below benchmark, test new creatives' : 'Good engagement rates',
        'Mobile traffic accounts for 65% of impressions',
      ],
      recommendations: {
        immediate: parseFloat(roi) < 50 ? ['Pause underperforming ads', 'Refine targeting'] : ['Scale winning ads'],
        testing: ['A/B test new headlines', 'Try video format', 'Test different CTAs'],
      },
    });
  }
}

class AudienceResearchTool {
  constructor() {
    this.name = 'audience_research';
    this.description = 'Deep audience insights and persona development';
  }

  async invoke(input) {
    const { segment, researchType, dataPoints } = input;
    
    // Simulate audience research data
    const demographics = {
      ageRange: '25-44',
      gender: { male: 45, female: 52, other: 3 },
      income: '$50k-$100k',
      education: 'College+',
      location: 'Urban/Suburban',
    };
    
    const psychographics = {
      interests: ['technology', 'sustainability', 'health', 'travel'],
      values: ['innovation', 'quality', 'authenticity'],
      painPoints: ['time constraints', 'information overload', 'budget concerns'],
      mediaConsumption: ['mobile-first', 'video-preferred', 'podcast-listener'],
    };
    
    const behaviorPatterns = {
      purchaseFrequency: 'Monthly',
      averageOrderValue: '$125',
      preferredChannels: ['Instagram', 'Google', 'Email'],
      decisionFactors: ['reviews', 'price', 'brand reputation'],
    };
    
    return JSON.stringify({
      segment,
      researchType,
      insights: {
        demographics,
        psychographics,
        behaviorPatterns,
        marketSize: '2.5M addressable users',
        growthRate: '+12% YoY',
      },
      personas: [
        {
          name: 'Tech-Savvy Professional',
          description: 'Early adopter, values efficiency and innovation',
          percentage: 35,
        },
        {
          name: 'Conscious Consumer',
          description: 'Prioritizes sustainability and ethical brands',
          percentage: 28,
        },
      ],
      recommendations: [
        'Focus messaging on time-saving benefits',
        'Highlight sustainability credentials',
        'Use social proof and testimonials',
      ],
    });
  }
}

// Create specialized marketing agents with custom tools
const creativeDirectorAgent = new Agent({
  name: 'Alexandra Chen',
  role: 'Creative Director',
  goal: 'Develop compelling creative campaigns that resonate with target audiences',
  background: 'Award-winning creative with 15 years in digital marketing and brand storytelling',
  tools: [new ContentGeneratorTool(), new AudienceResearchTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.8, // Higher for creativity
  },
});

const performanceMarketingAgent = new Agent({
  name: 'Marcus Rodriguez',
  role: 'Performance Marketing Manager',
  goal: 'Optimize campaign performance for maximum ROI and conversions',
  background: 'Data-driven marketer specializing in paid media and conversion optimization',
  tools: [new AnalyticsTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.3,
  },
});

const contentStrategistAgent = new Agent({
  name: 'Emily Watson',
  role: 'Content Strategist',
  goal: 'Create content strategies that drive engagement and support business objectives',
  background: 'Content marketing expert with focus on SEO and multi-channel storytelling',
  tools: [new ContentGeneratorTool(), new AudienceResearchTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.6,
  },
});

const socialMediaManagerAgent = new Agent({
  name: 'Jordan Kim',
  role: 'Social Media Manager',
  goal: 'Build engaged communities and amplify brand presence across social platforms',
  background: 'Social media specialist with viral campaign experience and influencer relations',
  tools: [new ContentGeneratorTool(), new AnalyticsTool()],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.7,
  },
});

// Create comprehensive marketing task repository
const marketingTaskRepository = [
  // Campaign Planning Tasks
  new Task({
    title: 'Campaign Strategy Development',
    description: 'Develop comprehensive campaign strategy based on objectives and audience insights',
    expectedOutput: 'Complete campaign strategy document with creative brief and media plan',
    agent: creativeDirectorAgent,
    adaptable: true,
    dynamicPriority: true,
    priority: 'high',
    orchestrationRules: \`
      STRATEGY COMPONENTS:
      - Campaign objectives and KPIs
      - Target audience definition
      - Creative concept and messaging
      - Channel strategy and budget allocation
      - Timeline and milestones
      
      ADAPTIVE ELEMENTS:
      - Adjust based on market trends
      - Incorporate competitive insights
      - Flex budget based on early results
      - Test emerging channels
    \`,
    resourceRequirements: {
      estimatedTime: '6-8 hours',
      skillsRequired: ['strategic-thinking', 'creative-direction', 'market-analysis'],
      dependencies: ['brand-guidelines', 'market-research', 'budget-approval'],
    },
    qualityGates: ['objective-alignment', 'audience-validation', 'creative-approval', 'budget-confirmation'],
  }),

  new Task({
    title: 'Content Creation Sprint',
    description: 'Produce multi-channel content assets for campaign launch',
    expectedOutput: 'Complete content package including copy, visuals, and multimedia assets',
    agent: contentStrategistAgent,
    adaptable: true,
    splitStrategy: 'auto', // Can split by channel or content type
    mergeCompatible: ['social-media-content', 'email-content', 'blog-content'],
    orchestrationRules: \`
      CONTENT REQUIREMENTS:
      - Hero video (2-3 minutes)
      - Blog posts (3-5 pieces)
      - Social media assets (20+ pieces)
      - Email sequences (5-7 emails)
      - Landing pages (2-3 variants)
      
      QUALITY STANDARDS:
      - Brand voice consistency
      - SEO optimization
      - Accessibility compliance
      - Mobile-first design
      
      AUTO-GENERATION TRIGGERS:
      - High-performing content gets variations
      - Trending topics get rapid content
      - A/B test variants automatically created
    \`,
    resourceRequirements: {
      estimatedTime: '10-15 hours',
      skillsRequired: ['copywriting', 'design', 'video-production', 'seo'],
      dependencies: ['brand-assets', 'product-info', 'approval-workflow'],
    },
  }),

  new Task({
    title: 'Performance Optimization Cycle',
    description: 'Continuously monitor and optimize campaign performance',
    expectedOutput: 'Optimization report with implemented improvements and results',
    agent: performanceMarketingAgent,
    adaptable: true,
    dynamicPriority: true,
    priority: 'high',
    orchestrationRules: \`
      OPTIMIZATION PROCESS:
      - Real-time performance monitoring
      - A/B testing implementation
      - Budget reallocation
      - Bid strategy adjustments
      - Audience refinement
      
      TRIGGER POINTS:
      - CPA exceeds target by 20%
      - CTR drops below 2%
      - Conversion rate decline
      - Competitive pressure increase
      
      AUTONOMOUS ACTIONS:
      - Pause underperforming ads
      - Scale winning creatives
      - Adjust targeting parameters
      - Shift budget to top channels
    \`,
    resourceRequirements: {
      estimatedTime: '4-6 hours/week',
      skillsRequired: ['data-analysis', 'paid-media', 'conversion-optimization', 'statistics'],
      dependencies: ['analytics-platforms', 'ad-accounts', 'conversion-tracking'],
    },
  }),

  new Task({
    title: 'Social Media Campaign Execution',
    description: 'Launch and manage social media campaign across all platforms',
    expectedOutput: 'Active social campaign with engagement metrics and community growth',
    agent: socialMediaManagerAgent,
    adaptable: true,
    dynamicPriority: true,
    orchestrationRules: \`
      EXECUTION PLAN:
      - Content calendar implementation
      - Community management
      - Influencer collaborations
      - Real-time engagement
      - Crisis monitoring
      
      ADAPTIVE RESPONSES:
      - Trending topic integration
      - Viral moment amplification
      - Negative feedback management
      - Platform algorithm changes
    \`,
    resourceRequirements: {
      estimatedTime: '8-10 hours/week',
      skillsRequired: ['social-media', 'community-management', 'content-creation', 'analytics'],
      dependencies: ['social-accounts', 'content-library', 'monitoring-tools'],
    },
  }),

  new Task({
    title: 'Audience Research and Persona Development',
    description: 'Conduct deep audience research and create detailed personas',
    expectedOutput: 'Comprehensive audience insights report with actionable personas',
    agent: creativeDirectorAgent,
    adaptable: true,
    priority: 'medium',
    orchestrationRules: \`
      RESEARCH METHODS:
      - Quantitative surveys
      - Qualitative interviews
      - Behavioral analysis
      - Social listening
      - Competitive analysis
      
      PERSONA DEVELOPMENT:
      - Demographics and psychographics
      - Pain points and motivations
      - Media consumption habits
      - Purchase journey mapping
    \`,
    resourceRequirements: {
      estimatedTime: '6-8 hours',
      skillsRequired: ['market-research', 'data-analysis', 'consumer-psychology'],
      dependencies: ['research-tools', 'customer-data', 'analytics-access'],
    },
  }),
];

// Define inputs
const marketingInputs = {
  campaign: {
    name: 'Summer Product Launch 2024',
    objective: 'Drive awareness and sales for new eco-friendly product line',
    budget: '$250,000',
    duration: '3 months',
    kpis: {
      awareness: '10M impressions',
      engagement: '5% avg engagement rate',
      conversions: '10,000 sales',
      roi: '300%',
    },
  },
  targetAudience: {
    primary: 'Environmentally conscious millennials',
    secondary: 'Tech-savvy Gen Z',
    demographics: {
      age: '22-40',
      income: '$40k-$120k',
      location: 'Urban markets in US/Canada',
    },
    interests: ['sustainability', 'technology', 'lifestyle', 'wellness'],
  },
  brandContext: {
    positioning: 'Innovative sustainable solutions for modern living',
    tone: 'Inspiring, authentic, approachable',
    competitors: ['EcoTech Corp', 'GreenLife Inc', 'Sustainable Co'],
    uniqueValue: 'Patented eco-technology with style',
  },
  channels: {
    paid: ['Google Ads', 'Facebook/Instagram', 'TikTok', 'YouTube'],
    owned: ['Website', 'Email', 'App', 'Blog'],
    earned: ['PR', 'Influencers', 'User content', 'SEO'],
  },
};

// Create the marketing team with intelligent orchestration
const marketingTeam = new Team({
  name: 'Digital Marketing Campaign Team',
  agents: [creativeDirectorAgent, performanceMarketingAgent, contentStrategistAgent, socialMediaManagerAgent],
  tasks: [], // Start with empty tasks, orchestrator will select
  inputs: marketingInputs,
  
  // Orchestration configuration for creative campaigns
  enableOrchestration: true,
  continuousOrchestration: true, // Adapt to real-time performance
  backlogTasks: marketingTaskRepository,
  allowTaskGeneration: true, // Generate new tasks for emerging opportunities
  
  orchestrationStrategy: \`
    You are orchestrating a digital marketing campaign team for a major product launch.
    
    CAMPAIGN OBJECTIVES:
    1. Build awareness for eco-friendly product line
    2. Drive conversions with 300% ROI target
    3. Create engaging content that resonates
    4. Optimize performance in real-time
    
    CREATIVE PRINCIPLES:
    - Authenticity over perfection
    - Data-informed creativity
    - Test and learn mentality
    - Platform-native content
    
    PERFORMANCE FOCUS:
    - ROI is the north star metric
    - Real-time optimization required
    - Scale what works, kill what doesn't
    - Always be testing
    
    ADAPTIVE STRATEGIES:
    - Jump on trending topics when relevant
    - Shift budget to high-performing channels
    - Create new content for viral moments
    - Adjust messaging based on feedback
    
    TASK GENERATION TRIGGERS:
    - Viral content opportunity
    - Competitor campaign launch
    - Platform algorithm change
    - Emerging channel opportunity
  \`,
  
  mode: 'innovative', // Creative and experimental approach
  maxActiveTasks: 8, // High parallel execution
  taskPrioritization: 'ai-driven', // Smart prioritization
  workloadDistribution: 'availability', // Fast execution
  
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.6,
  },
  
  env: {
    OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'
  }
});

// Add inputs to team
marketingTeam.inputs = marketingInputs;

// Show current status
console.log('Marketing Team configured for:', marketingInputs.campaign.name);
console.log('Campaign Budget:', marketingInputs.campaign.budget);
console.log('Target ROI:', marketingInputs.campaign.kpis.roi);
console.log('Orchestration Mode:', marketingTeam.mode);
console.log('Task Generation:', marketingTeam.allowTaskGeneration ? 'Enabled (for emerging opportunities)' : 'Disabled');
    `,
    metadata: {
      title: 'Marketing - Campaign Management',
      description: 'Creative campaign development with data-driven optimization',
      category: 'orchestration',
      industries: ['marketing', 'advertising', 'digital'],
      teamSize: 4,
      orchestrationFeatures: [
        'innovativeMode',
        'taskGeneration',
        'continuousOrchestration',
        'aiDrivenPrioritization',
        'availabilityDistribution'
      ],
      highlights: [
        'Multi-channel content creation',
        'Real-time performance optimization',
        'AI-powered audience insights',
        'Dynamic budget allocation',
        'Trend-responsive content'
      ]
    },
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'KaibanJS Marketing Example',
  };
};