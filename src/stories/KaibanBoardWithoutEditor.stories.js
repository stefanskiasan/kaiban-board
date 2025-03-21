import KaibanBoard from "../components/KaibanBoard";
// Teams
import teamOpenAI from "../teams/resume_creation/openai";
import teamProductSpecs from "../teams/product_specs/openai";
import teamTripPlanning from "../teams/trip_planning/openai";
import teamEventPlanning from "../teams/event_planning/openai";

export default {
  title: "Components/KaibanBoard (Without Editor)",
  component: KaibanBoard,
};

export const Basic = {
  args: {
    teams: [teamOpenAI, teamProductSpecs, teamEventPlanning],
    title: "Basic", // Title in Storybook
  },
};

export const WithoutWelcomeInfo = {
  args: {
    uiSettings: {
      showWelcomeInfo: false,
    },
    teams: [teamOpenAI, teamProductSpecs, teamTripPlanning, teamEventPlanning],
    title: "Without Welcome Info", // Title in Storybook
  },
};
