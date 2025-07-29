export const basicTranslationTeamOpenai = () => {
  return {
    code: `
import { Agent, Task, Team } from 'kaibanjs';

// Define agents
const translator = new Agent({
  name: 'Maria Gonzalez',
  role: 'Professional Translator',
  goal: 'Provide accurate, culturally appropriate translations.',
  background: 'Certified translator with expertise in multiple languages and cultural contexts',
  tools: []
});

const proofreader = new Agent({
  name: 'Hans Mueller',
  role: 'Translation Proofreader',
  goal: 'Review and refine translations for accuracy and fluency.',
  background: 'Linguist with expertise in quality assurance and cultural adaptation',
  tools: []
});

const localizationSpecialist = new Agent({
  name: 'Yuki Tanaka',
  role: 'Localization Specialist',
  goal: 'Adapt content for specific cultural and regional contexts.',
  background: 'Cultural expert specializing in content adaptation and local market requirements',
  tools: []
});

// Define tasks
const translationTask = new Task({
  description: \`Translate the following text from {sourceLanguage} to {targetLanguage}:
  
  "{textToTranslate}"
  
  Ensure the translation is:
  - Accurate and faithful to the original meaning
  - Natural and fluent in the target language
  - Culturally appropriate
  - Maintains the tone and style of the original\`,
  expectedOutput: 'Professionally translated text that accurately conveys the original meaning',
  agent: translator
});

const proofreadingTask = new Task({
  description: \`Review the translated text for:
  - Grammatical accuracy
  - Spelling and punctuation
  - Consistency in terminology
  - Natural flow and readability
  - Cultural appropriateness
  
  Provide corrections and suggestions for improvement.\`,
  expectedOutput: 'Proofread translation with corrections and quality assessment',
  agent: proofreader
});

const localizationTask = new Task({
  description: \`Finalize the translation by:
  - Adapting cultural references if needed
  - Ensuring compliance with local standards
  - Optimizing for the target audience
  - Adding region-specific formatting
  - Verifying cultural sensitivity\`,
  expectedOutput: 'Culturally adapted, localized final translation ready for publication',
  agent: localizationSpecialist
});

// Create the team
const team = new Team({
  name: 'Translation Team',
  agents: [translator, proofreader, localizationSpecialist],
  tasks: [translationTask, proofreadingTask, localizationTask],
  inputs: { 
    sourceLanguage: 'English',
    targetLanguage: 'Spanish',
    textToTranslate: 'Welcome to our innovative platform that revolutionizes how businesses connect with their customers. Our cutting-edge technology empowers companies to deliver personalized experiences at scale.'
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