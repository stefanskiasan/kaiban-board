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
        uiSettings:{
            showExampleMenu: false,
            showShareOption: false,
            showSettingsOption: false,
            isPreviewMode: true,
        }, 
        teams: [teamOpenAI, teamProductSpecs],       
        title: "Basic",// Title in Storybook
    },
};

export const standard = {
    args: {    
        title: "Default",// Title in Storybook
    },
};





