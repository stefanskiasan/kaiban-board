export const orchestration01BasicOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define basic development team
const seniorDeveloper = new Agent({
  name: 'Alex',
  role: 'Senior Developer',
  goal: 'Lead development and architecture decisions for web applications.',
  background: 'Senior developer with expertise in full-stack development and system architecture.',
  tools: []
});

const frontendDeveloper = new Agent({
  name: 'Sam',
  role: 'Frontend Developer',
  goal: 'Create responsive and user-friendly web interfaces.',
  background: 'Frontend specialist with expertise in React, CSS, and responsive design.',
  tools: []
});

const qaEngineer = new Agent({
  name: 'Jordan',
  role: 'QA Engineer',
  goal: 'Ensure code quality through comprehensive testing.',
  background: 'Quality assurance expert with expertise in test automation and quality processes.',
  tools: []
});

// Define basic project tasks
const setupProjectTask = new Task({
  description: 'Set up project structure and development environment',
  expectedOutput: 'Complete project setup with folder structure and development tools configured',
  agent: seniorDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '2-3 hours',
    skillsRequired: ['project_setup', 'development_tools', 'architecture'],
    dependencies: []
  }
});

const authenticationTask = new Task({
  description: 'Implement user authentication system',
  expectedOutput: 'Working authentication with login and logout functionality',
  agent: seniorDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-5 hours',
    skillsRequired: ['authentication', 'security', 'backend'],
    dependencies: ['project_setup']
  }
});

const uiComponentsTask = new Task({
  description: 'Create responsive UI components',
  expectedOutput: 'Set of reusable UI components with responsive design',
  agent: frontendDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '3-4 hours',
    skillsRequired: ['frontend', 'css', 'react'],
    dependencies: ['project_setup']
  }
});

const testingTask = new Task({
  description: 'Implement comprehensive testing suite',
  expectedOutput: 'Test suite with unit and integration tests',
  agent: qaEngineer,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '3-4 hours',
    skillsRequired: ['testing', 'automation', 'quality_assurance'],
    dependencies: ['authentication', 'ui_components']
  }
});

const apiEndpointsTask = new Task({
  description: 'Build REST API endpoints for data management',
  expectedOutput: 'RESTful API with CRUD operations',
  agent: seniorDeveloper,
  adaptable: true,
  resourceRequirements: {
    estimatedTime: '4-5 hours',
    skillsRequired: ['api_design', 'backend', 'database'],
    dependencies: ['authentication']
  }
});

// Create team with basic orchestration
const team = new Team({
  name: 'Basic Development Team',
  agents: [
    seniorDeveloper,
    frontendDeveloper,
    qaEngineer
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
    setupProjectTask,
    authenticationTask,
    uiComponentsTask,
    testingTask,
    apiEndpointsTask
  ],
  
  allowTaskGeneration: false,

  // Use initial-only orchestration for basic workflow
  continuousOrchestration: false,

  // Use skills-based distribution
  workloadDistribution: 'skills-based',

  orchestrationStrategy: \`
    You are orchestrating a basic web application development project.
    
    PROJECT SCOPE:
    - Modern web application with authentication
    - Responsive user interface
    - RESTful API backend
    - Comprehensive testing
    
    TEAM COORDINATION:
    - Senior Developer leads architecture decisions
    - Frontend Developer focuses on user experience
    - QA Engineer ensures quality throughout
    
    PRIORITIES:
    - Start with project setup foundation
    - Implement authentication for security
    - Build user interface components
    - Create API endpoints for data
    - Add comprehensive testing
    
    CONSTRAINTS:
    - Focus on essential features first
    - Ensure code quality standards
    - Maintain good documentation
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