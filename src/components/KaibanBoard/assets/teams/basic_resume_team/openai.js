export const basicResumeTeamOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define agents
const profileAnalyst = new Agent({
  name: 'Zoe',
  role: 'Profile Analyst',
  goal: 'Extract structured information from conversational user input.',
  background: 'Data Processor with expertise in parsing unstructured information',
  tools: []
});

const resumeWriter = new Agent({
  name: 'Alex Mercer',
  role: 'Resume Writer',
  goal: 'Craft compelling, well-structured resumes that effectively showcase qualifications.',
  background: 'Experienced recruiter and copywriter with expertise in resume optimization',
  tools: []
});

// Define tasks
const processingTask = new Task({
  description: \`Extract relevant details such as name, experience, skills, 
  and job history from the user's 'aboutMe' input. 
  aboutMe: {aboutMe}\`,
  expectedOutput: 'Structured data ready to be used for resume creation.',
  agent: profileAnalyst
});

const resumeCreationTask = new Task({
  description: \`Utilize the structured data to create a detailed and attractive resume. 
  Enrich the resume content by inferring additional details from the provided information.
  Include sections such as a personal summary, detailed work experience, 
  skills, and educational background.\`,
  expectedOutput: 'A professionally formatted resume in markdown format, ready for submission.',
  agent: resumeWriter
});

// Create team (classic KaibanJS pattern)
const team = new Team({
  name: 'Resume Creation Team',
  agents: [profileAnalyst, resumeWriter],
  tasks: [processingTask, resumeCreationTask],
  inputs: {
    aboutMe: \`My name is David Llaca. 
    JavaScript Developer for 5 years. 
    I worked for three years at Disney, 
    where I developed user interfaces for their primary landing pages
    using React, NextJS, and Redux. Before Disney, 
    I was a Junior Front-End Developer at American Airlines, 
    where I worked with Vue and Tailwind. 
    I earned a Bachelor of Science in Computer Science from FIU in 2018, 
    and I completed a JavaScript bootcamp that same year.\`
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