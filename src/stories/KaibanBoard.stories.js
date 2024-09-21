import KaibanBoard from "../components/KaibanBoard";
import teamOpenAI from "../teams/resume_creation/openai";
import teamProductSpecs from "../teams/product_specs/openai";
import "../components/KaibanBoard/styles/index.css";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
    title: "Components/KaibanBoard",
    component: KaibanBoard,
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const basic = {
    args: {
        uiSettings:{
            fullScreen: true,
            showExampleMenu: true,
            showShareOption: true,
            showSettingsOption: true
        }, 
        teams: [teamOpenAI, teamProductSpecs],       
        title: "Basic",
    },
};