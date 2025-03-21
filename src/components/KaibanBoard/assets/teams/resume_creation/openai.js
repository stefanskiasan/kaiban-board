export const resumeCreationOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define agents with specific roles and goals
const profileAnalyst = new Agent({
    name: 'Zoe', 
    role: 'Profile Analyst', 
    goal: 'Extract structured information from conversational user input.', 
    background: 'Data Processor',
    tools: []
});

const resumeWriter = new Agent({
    name: 'Alex Mercer', 
    role: 'Resume Writer', 
    goal: \`Craft compelling, well-structured resumes 
    that effectively showcase job seekers qualifications and achievements.\`,
    background: \`Extensive experience in recruiting, 
    copywriting, and human resources, enabling 
    effective resume design that stands out to employers.\`,
    tools: []
});

// Define the tasks for each agent
const processingTask = new Task({ 
    description: \`Extract relevant details such as name, 
    experience, skills, and job history from the user's 'aboutMe' input. 
    aboutMe: {aboutMe}\`,
    expectedOutput: 'Structured data ready to be used for a resume creation.', 
    agent: profileAnalyst
});

const resumeCreationTask = new Task({ 
    description: \`Utilize the structured data to create 
    a detailed and attractive resume. 
    Enrich the resume content by inferring additional details from the provided information.
    Include sections such as a personal summary, detailed work experience, skills, and educational background. Please use markdown format for the output.\`,
    expectedOutput: \`A professionally formatted resume in markdown format, 
    ready for submission to potential employers.\`, 
    agent: resumeWriter 
});

// Create and start the team
const team = new Team({
    name: 'Resume Creation Team',
    agents: [profileAnalyst, resumeWriter],
    tasks: [processingTask, resumeCreationTask],
    inputs: { aboutMe: \`My name is David Llaca. 
    JavaScript Developer for 5 years. 
    I worked for three years at Disney, 
    where I developed user interfaces for their primary landing pages
    using React, NextJS, and Redux. Before Disney, 
    I was a Junior Front-End Developer at American Airlines, 
    where I worked with Vue and Tailwind. 
    I earned a Bachelor of Science in Computer Science from FIU in 2018, 
    and I completed a JavaScript bootcamp that same year.\` },
    env: {OPENAI_API_KEY: 'ENV_OPENAI_API_KEY'}
});

team.start();
`,
    keys: [{ key: 'ENV_OPENAI_API_KEY', value: 'NEXT_PUBLIC_OPENAI_API_KEY' }],
    user: 'AI Champions Team',
  };
};
