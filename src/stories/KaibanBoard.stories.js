import KaibanBoard from "../components/KaibanBoard";
// Teams for the select menu
import globalNewsOpenai from '../teams/examples/global_news/openai';
import resumeCreationOpenai from '../teams/examples/resume_creation/openai';
import sportsNewsOpenai from '../teams/examples/sports_news/openai';

export default {
  title: "Components/KaibanBoard",
  component: KaibanBoard,
};

export const Basic = {
  args: {
    uiSettings: {
      showFullScreen: false,
      showExampleMenu: true,
      showShareOption: true,
      showSettingsOption: true,
      isPreviewMode: false,
      showSimpleShareOption: false
    },
    defaultEnvVars: [
      { key: "ENV_OPENAI_API_KEY", value: "NEXT_PUBLIC_OPENAI_API_KEY" },
      { key: "ENV_SERPER_API_KEY", value: "NEXT_PUBLIC_SERPER_API_KEY" },
      { key: "ENV_TAVILY_API_KEY", value: "NEXT_PUBLIC_TAVILY_API_KEY" },
      { key: "ENV_WOLFRAM_APP_ID", value: "NEXT_PUBLIC_WOLFRAM_APP_ID" },
    ],
    title: "Our Options", // Title in Storybook
  },
};

export const WithTeamsSelect = {
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
