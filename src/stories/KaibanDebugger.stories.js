import KaibanDebugger from "../components/KaibanDebugger";
import teamOpenAI from "../teams/resume_creation/openai";
// import "../components/KaibanDebugger/index.css";
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
    title: "Components/KaibanDebugger",
    component: KaibanDebugger,
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const basic = {
    args: {
        team: teamOpenAI,
        title: "Basic",
    },
};