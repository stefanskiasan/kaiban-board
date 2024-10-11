import KaibanBoard from "../components/KaibanBoard";
import teamOpenAI from "../teams/resume_creation/openai";
import teamProductSpecs from "../teams/product_specs/openai";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
    title: "Components/KaibanBoard",
    component: KaibanBoard,
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const basic = {
    args: {
        teams: [teamOpenAI, teamProductSpecs],
        title: "Basic",// Title in Storybook
    },
};

export const withoutWelcomeInfo = {
    args: {
        uiSettings: {
            showWelcomeInfo: false,
        },
        teams: [teamOpenAI, teamProductSpecs],
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
        },
        title: "Our Options",// Title in Storybook
    },
};





