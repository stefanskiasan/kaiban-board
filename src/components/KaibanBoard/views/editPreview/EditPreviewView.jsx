import React, { useRef } from 'react';
import { Squares2X2Icon, UserGroupIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon, BookOpenIcon, ChatBubbleLeftEllipsisIcon, GlobeAltIcon, Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

import AgentCard from '../../components/Common/AgentCard';
import TaskCard from '../../components/Common/TaskCard';
import ResizableTextarea from '../../components/Common/ResizableTextarea';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import TeamsMenu from '../../components/TeamsMenu';
import { GitHubIcon } from '../../assets/icons';

const Dashboard = ({ onChange = () => { } }) => {
    const useAgentsPlaygroundStore = usePlaygroundStore();

    const {
        uiSettings
    } = useAgentsPlaygroundStore(
        (state) => ({
            uiSettings: state.uiSettings
        })
    );

    return (
        <div className="kb-flex kb-flex-col kb-min-h-[calc(100vh-55px)] kb-p-6">
            <div className="kb-flex-grow">
                <span className="kb-text-2xl kb-font-semibold kb-text-slate-200">Welcome to your Kaiban Board</span>
                {/* --- TEAMS --- */}
                <TeamsMenu onChange={onChange} />
                {/* --- TEAMS --- */}
                {uiSettings.showWelcomeInfo && (
                    <>
                        {/* --- STEPS --- */}
                        <div className="kb-mt-8 kb-pb-2">
                            <span className="kb-text-slate-400 kb-text-lg kb-font-medium">Steps</span>
                        </div>
                        <div className="kb-relative kb-bg-slate-950 kb-rounded-xl kb-ring-1 kb-ring-slate-800">
                            <div className="kb-relative kb-px-5 kb-py-4">
                                <pre className="kb-text-xs kb-leading-6 kb-text-slate-300 kb-flex kb-flex-col kb-gap-1 kb-overflow-auto">
                                    <code className="kb-flex-none kb-min-w-full">
                                        <span className="kb-flex">
                                            <svg viewBox="0 -9 3 24" aria-hidden="true" className="kb-flex-none kb-overflow-visible kb-text-pink-400 kb-w-auto kb-h-6 kb-mr-3">
                                                <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                            <span className="kb-flex-auto">
                                                Add `VITE_OPENAI_API_KEY` to your `.env` file with your OpenAI API key (stored locally).
                                            </span>
                                        </span>
                                    </code>
                                    <code className="kb-flex-none kb-min-w-full">
                                        <span className="kb-flex">
                                            <svg viewBox="0 -9 3 24" aria-hidden="true" className="kb-flex-none kb-overflow-visible kb-text-pink-400 kb-w-auto kb-h-6 kb-mr-3">
                                                <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                            <span className="kb-flex-auto">
                                                Click 'Start Workflow' to see your agents in action.
                                            </span>
                                        </span>
                                    </code>
                                    <code className="kb-flex-none kb-min-w-full">
                                        <span className="kb-flex">
                                            <svg viewBox="0 -9 3 24" aria-hidden="true" className="kb-flex-none kb-overflow-visible kb-text-pink-400 kb-w-auto kb-h-6 kb-mr-3">
                                                <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                            <span className="kb-flex-auto">
                                                Edit `team.kban.js` in your project root to start customizing.
                                            </span>
                                        </span>
                                    </code>
                                    <code className="kb-flex-none kb-min-w-full">
                                        <span className="kb-flex">
                                            <svg viewBox="0 -9 3 24" aria-hidden="true" className="kb-flex-none kb-overflow-visible kb-text-pink-400 kb-w-auto kb-h-6 kb-mr-3">
                                                <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                            <span className="kb-flex-auto">
                                                Add more teams by creating `*.kban.js` files in your project.
                                            </span>
                                        </span>
                                    </code>
                                </pre>
                            </div>
                        </div>
                        {/* --- STEPS --- */}
                        {/* --- RESOURCES --- */}
                        <div className="kb-mt-8 kb-pb-2">
                            <span className="kb-text-slate-400 kb-text-lg kb-font-medium">Resources</span>
                        </div>
                        <div className="kb-flex kb-flex-col kb-gap-2">
                            <a className="kb-flex kb-gap-1 kb-items-center kb-text-sm kb-text-slate-200 hover:kb-underline hover:kb-text-slate-200" href="https://docs.kaibanjs.com/get-started/Quick%20Start" target="_blank">
                                <BookmarkIcon className="kb-w-4 kb-h-4 kb-text-indigo-500" />
                                Quick Start Guide
                            </a>
                            <a className="kb-flex kb-gap-1 kb-items-center kb-text-sm kb-text-slate-200 hover:kb-underline hover:kb-text-slate-200" href="https://docs.kaibanjs.com/" target="_blank">
                                <BookOpenIcon className="kb-w-4 kb-h-4 kb-text-indigo-500" />
                                Full documentation
                            </a>
                            <a className="kb-flex kb-gap-1 kb-items-center kb-text-sm kb-text-slate-200 hover:kb-underline hover:kb-text-slate-200" href="https://github.com/kaiban-ai/KaibanJS" target="_blank">
                                <span className="kb-text-indigo-500"><GitHubIcon /></span>
                                Code & Contribute
                            </a>
                            <a className="kb-flex kb-gap-1 kb-items-center kb-text-sm kb-text-slate-200 hover:kb-underline hover:kb-text-slate-200" href="https://www.kaibanjs.com/" target="_blank">
                                <GlobeAltIcon className="kb-w-4 kb-h-4 kb-text-indigo-500" />
                                Learn about KaibanJS
                            </a>
                            <a className="kb-flex kb-gap-1 kb-items-center kb-text-sm kb-text-slate-200 hover:kb-underline hover:kb-text-slate-200" href="https://kaibanjs.com/discord" target="_blank">
                                <ChatBubbleLeftEllipsisIcon className="kb-w-4 kb-h-4 kb-text-indigo-500" />
                                Community Support
                            </a>
                        </div>
                        {/* --- RESOURCES --- */}
                    </>
                )}
            </div>
            {/* --- Footer --- */}
            <div className="kb-border-t kb-border-slate-950 kb-pt-6">
                {/* --- PRIVACY --- */}
                <div className="kb-pb-1">
                    <span className="kb-text-slate-300 kb-text-xs kb-font-medium">Privacy Notice</span>
                </div>
                <span className="kb-text-xs kb-font-normal kb-text-slate-400">
                    Everything you do here is local. We don’t access your API keys, data, or code. Have fun and build with confidence!
                </span>
                {/* --- PRIVACY --- */}
            </div>
            {/* --- Footer --- */}
        </div>
    );
};

const Preview = () => {
    const useAgentsPlaygroundStore = usePlaygroundStore();
    const {
        teamStore,
        errorState,
        uiSettings,
    } = useAgentsPlaygroundStore(
        (state) => ({
            teamStore: state.teamStore,
            errorState: state.errorState,
            uiSettings: state.uiSettings
        })
    );

    const {
        agents,
        tasks,
        inputs,
        setInputs
    } = teamStore(state => ({
        agents: state.agents,
        tasks: state.tasks,
        inputs: state.inputs,
        setInputs: state.setInputs
    }));

    const formatString = (str) => {
        let formattedStr = str.replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/[_:]/g, ' ');

        formattedStr = formattedStr.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return formattedStr;
    };

    return (
        <div className="kb-relative">
            <div className="kb-flex kb-flex-row">
                <div className="kb-px-6 kb-mt-3 kb-pb-3 kb-flex kb-items-center kb-gap-1.5">
                    <Square3Stack3DIcon className="kb-w-4 kb-h-4 kb-text-white" />
                    <span className="kb-text-sm kb-font-medium kb-text-white">Preview</span>
                </div>
                <div className="kb-flex-grow kb-border kb-border-slate-700 kb-border-r-0 kb-border-t-0 kb-bg-slate-950"></div>
            </div>
            <div className="kb-mt-4 kb-px-6 kb-divide-y kb-divide-slate-950">
                {!errorState.hasError ? (
                    <>
                        {/* TOPIC */}
                        <div className="kb-mt-4 kb-pb-6">
                            <span className="kb-text-slate-400 kb-text-lg kb-font-medium">Inputs</span>
                            <div className="kb-flex kb-flex-col kb-gap-3 kb-mt-2">
                                {Object.keys(inputs).map((item, index) => (
                                    <div key={index} className="kb-flex kb-flex-col kb-gap-1">
                                        <span className="kb-text-xs kb-font-semibold kb-text-slate-200">{formatString(item)}</span>
                                        <ResizableTextarea
                                            name="input"
                                            value={inputs[item]}
                                            onChange={(event) => {
                                                setInputs({ ...inputs, [item]: event.target.value });
                                            }}
                                            placeholder="Enter input value"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* TOPIC */}
                        {/* AGENTS */}
                        <div className="kb-pt-6 kb-pb-6">
                            <span className="kb-text-slate-400 kb-text-lg kb-font-medium">Agents</span>
                            <div className="kb-flex kb-flex-wrap kb-gap-3 kb-mt-2">
                                {agents?.map((agent) => (
                                    <AgentCard key={agent.id} agent={agent} />
                                ))}
                                {agents.length === 0 && (
                                    <div className="kb-flex kb-flex-col kb-items-center kb-gap-1 kb-p-4 kb-min-w-full">
                                        <UserGroupIcon className="kb-w-8 kb-h-8 kb-text-indigo-300" />
                                        <div className="kb-flex kb-flex-col kb-items-center">
                                            <span className="kb-text-sm kb-text-slate-200">Agents Unavailable</span>
                                            <span className="kb-max-w-md kb-text-center kb-text-slate-400 kb-text-xs kb-font-normal">No agents are currently set up or available. Please ensure the appropriate configurations are in place to proceed.</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* AGENTS */}
                        {/* TASK */}
                        <div className="kb-pt-6">
                            <span className="kb-text-slate-400 kb-text-lg kb-font-medium">Tasks</span>
                            <div className={`${uiSettings.isPreviewMode && !uiSettings.showWelcomeInfo ? "kb-grid kb-grid-cols-1 md:kb-grid-cols-2" : "kb-flex kb-flex-wrap"} kb-gap-3 kb-mt-2`}>
                                {tasks.map((task) => (
                                    <TaskCard key={task.id} task={task} showOptions={false} />
                                ))}
                            </div>
                            {tasks.length === 0 && (
                                <div className="kb-flex kb-flex-col kb-items-center kb-gap-1 kb-p-4 kb-min-w-full kb-mt-2">
                                    <Squares2X2Icon className="kb-w-8 kb-h-8 kb-text-indigo-300" />
                                    <div className="kb-flex kb-flex-col kb-items-center">
                                        <span className="kb-text-sm kb-text-slate-200">Tasks Unavailable</span>
                                        <span className="kb-max-w-md kb-text-center kb-text-slate-400 kb-text-xs kb-font-normal">No tasks are currently set up or available. Please ensure the appropriate configurations are in place to proceed.</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* TASK */}
                    </>
                ) : (
                    <div className="kb-mt-4 kb-pb-6">
                        <span className="kb-text-slate-400 kb-text-lg kb-font-medium">Error</span>
                        <div className="kb-flex kb-flex-wrap kb-gap-3 mt-2">
                            <ul className="kb-list-inside kb-list-disc">
                                <li className="kb-text-red-400 kb-text-sm">{errorState.error}</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const EditPreviewView = ({ editorComponent }) => {
    const useAgentsPlaygroundStore = usePlaygroundStore();
    const {
        uiSettings,
    } = useAgentsPlaygroundStore(
        (state) => ({
            uiSettings: state.uiSettings
        })
    );

    const swiperRef = useRef(null);

    const goToPreviewSlide = () => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(1);
        }
    };

    return (
        <>
            {/* --- DESKTOP --- */}
            <div className="kb-hidden md:kb-grid kb-grid-cols-5 kb-divide-x kb-divide-slate-700 kb-h-full">
                {/* --- EDITOR --- */}
                {!uiSettings.isPreviewMode && editorComponent && (
                    <div className="kb-col-span-3 kb-h-full">
                        {editorComponent}
                    </div>
                )}
                {/* --- EDITOR --- */}
                {/* --- DASHBOARD --- */}
                {uiSettings.isPreviewMode && (
                    <div className={`${uiSettings.showWelcomeInfo ? "kb-col-span-3" : "kb-col-span-2"} kb-h-full kb-overflow-auto`}>
                        <Dashboard />
                    </div>
                )}
                {/* --- DASHBOARD --- */}
                {/* --- PREVIEW --- */}
                <div className={`${uiSettings.showWelcomeInfo ? "kb-col-span-2" : "kb-col-span-3"} kb-pb-6 kb-h-full kb-overflow-auto`}>
                    <Preview />
                </div>
                {/* --- PREVIEW --- */}
            </div>
            {/* --- DESKTOP --- */}
            {/* --- MOBILE --- */}
            <div className="kb-block md:kb-hidden kb-relative kb-h-full">
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    spaceBetween={12}
                    pagination={{ clickable: true }}
                    modules={[Pagination]}>
                    <SwiperSlide>
                        {/* --- EDITOR --- */}
                        {!uiSettings.isPreviewMode && editorComponent && (
                            <div className="kb-h-full">
                                {editorComponent}
                            </div>
                        )}
                        {/* --- EDITOR --- */}
                        {/* --- DASHBOARD --- */}
                        {uiSettings.isPreviewMode && (
                            <div className="kb-h-full kb-overflow-auto">
                                <Dashboard onChange={goToPreviewSlide} />
                            </div>
                        )}
                        {/* --- DASHBOARD --- */}
                    </SwiperSlide>
                    <SwiperSlide>
                        {/* --- PREVIEW --- */}
                        <div className="kb-pb-8 kb-h-full kb-overflow-auto">
                            <Preview />
                        </div>
                        {/* --- PREVIEW --- */}
                    </SwiperSlide>
                </Swiper>
            </div>
            {/* --- MOBILE --- */}
        </>
    );
};

export default EditPreviewView;