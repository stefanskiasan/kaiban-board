import KaibanBoard from "../components/KaibanBoard";
import teamOpenAI from "../teams/resume_creation/openai";
import teamProductSpecs from "../teams/product_specs/openai";
import teamTripPlanning from "../teams/trip_planning/openai";
// Teams for the select menu
import globalNewsOpenai from '../teams/examples/global_news/openai';
import resumeCreationOpenai from '../teams/examples/resume_creation/openai';
import sportsNewsOpenai from '../teams/examples/sports_news/openai';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Components/KaibanBoard",
  component: KaibanBoard,
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const basic = {
  args: {
    teams: [teamOpenAI, teamProductSpecs],
    title: "Basic", // Title in Storybook
  },
};

export const withoutWelcomeInfo = {
  args: {
    uiSettings: {
      showWelcomeInfo: false,
    },
    teams: [teamOpenAI, teamProductSpecs, teamTripPlanning],
    title: "Without Welcome Info", // Title in Storybook
  },
};

export const ourOptions = {
  args: {
    uiSettings: {
      showFullScreen: false,
      showExampleMenu: true,
      showShareOption: true,
      showSettingsOption: true,
      isPreviewMode: false,
      showSimpleShareOption: false,
      selectedTab: 1,
      isChatbotFloating: true,
    },
    defaultEnvVars: [
      { key: "ENV_OPENAI_API_KEY", value: "NEXT_PUBLIC_OPENAI_API_KEY" },
      { key: "ENV_SERPER_API_KEY", value: "NEXT_PUBLIC_SERPER_API_KEY" },
      { key: "ENV_TRAVILY_API_KEY", value: "NEXT_PUBLIC_TRAVILY_API_KEY" },
      { key: "ENV_WOLFRAM_APP_ID", value: "NEXT_PUBLIC_WOLFRAM_APP_ID" },
    ],
    title: "Our Options", // Title in Storybook
  },
};

export const withTeamsSelect = {
  args: {
    uiSettings: {
      showFullScreen: false,
      showSettingsOption: true,
      isPreviewMode: false,
      showSimpleShareOption: false,
      showExampleTeams: true,
    },
    exampleTeams: [globalNewsOpenai, resumeCreationOpenai, sportsNewsOpenai],
    title: "With Teams Select", // Title in Storybook
  },
};
