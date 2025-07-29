export const customerSupportTeamOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define agents
const supportAgent = new Agent({
  name: 'Alex Thompson',
  role: 'Customer Support Agent',
  goal: 'Provide helpful, empathetic customer support and resolve issues efficiently.',
  background: 'Experienced customer service professional with problem-solving expertise',
  tools: []
});

const technicalSpecialist = new Agent({
  name: 'Jordan Lee',
  role: 'Technical Support Specialist',
  goal: 'Handle complex technical issues and provide detailed technical solutions.',
  background: 'Technical expert with deep product knowledge and troubleshooting skills',
  tools: []
});

const followUpAgent = new Agent({
  name: 'Taylor Smith',
  role: 'Follow-up Agent',
  goal: 'Ensure customer satisfaction and handle follow-up communications.',
  background: 'Customer success specialist focused on relationship building and satisfaction',
  tools: []
});

// Define tasks
const initialSupportTask = new Task({
  description: \`Analyze the customer inquiry: "{customerIssue}"
  
  Provide:
  - Empathetic acknowledgment of the issue
  - Initial troubleshooting steps
  - Clear explanation of next steps
  - Estimated resolution timeframe
  
  If the issue is technical, escalate to technical specialist.\`,
  expectedOutput: 'Initial support response with troubleshooting steps or escalation decision',
  agent: supportAgent
});

const technicalResolutionTask = new Task({
  description: \`Address the technical aspects of: "{customerIssue}"
  
  Provide:
  - Detailed technical analysis
  - Step-by-step solution instructions
  - Alternative solutions if applicable
  - Prevention tips for future
  - Clear, non-technical explanations\`,
  expectedOutput: 'Technical solution with clear instructions and explanations',
  agent: technicalSpecialist
});

const followUpTask = new Task({
  description: \`Create a follow-up communication for the resolved issue:
  
  Include:
  - Summary of the resolution provided
  - Confirmation that the issue has been resolved
  - Additional resources or tips
  - Invitation for further questions
  - Customer satisfaction survey\`,
  expectedOutput: 'Follow-up message ensuring customer satisfaction and closure',
  agent: followUpAgent
});

// Create the team
const team = new Team({
  name: 'Customer Support Team',
  agents: [supportAgent, technicalSpecialist, followUpAgent],
  tasks: [initialSupportTask, technicalResolutionTask, followUpTask],
  inputs: { 
    customerIssue: 'Customer cannot log into their account after password reset. They receive an error message saying "Invalid credentials" even with the new password.'
  },
  env: {
    OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'
  }
});

team.start();
`,
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'AI Champions Team',
  };
};