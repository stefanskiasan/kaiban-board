import React, { useRef } from 'react';
import { Squares2X2Icon, UserGroupIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon, BookOpenIcon, ChatBubbleLeftEllipsisIcon, GlobeAltIcon, Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { Textarea } from '@headlessui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

import AgentCard from '../../components/Common/AgentCard';
import TaskCard from '../../components/Common/TaskCard';
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
        <div className="flex flex-col min-h-[calc(100vh-55px)] p-6">
            <div className="flex-grow">
                <span className="text-2xl font-semibold text-slate-200">Welcome to your Kaiban Board</span>
                {/* --- TEAMS --- */}
                <TeamsMenu onChange={onChange} />
                {/* --- TEAMS --- */}
                {uiSettings.showWelcomeInfo && (
                    <>
                        {/* --- STEPS --- */}
                        <div className="mt-8 pb-2">
                            <span className="text-slate-400 text-lg font-medium">Steps</span>
                        </div>
                        <div className="relative bg-slate-950 rounded-xl ring-1 ring-slate-800">
                            <div className="relative px-5 py-4">
                                <pre className="text-xs leading-6 text-slate-300 flex flex-col gap-1 overflow-auto">
                                    <code className="flex-none min-w-full">
                                        <span className="flex">
                                            <svg viewBox="0 -9 3 24" aria-hidden="true" className="flex-none overflow-visible text-pink-400 w-auto h-6 mr-3">
                                                <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                            <span className="flex-auto">
                                                Add `VITE_OPENAI_API_KEY` to your `.env` file with your OpenAI API key (stored locally).
                                            </span>
                                        </span>
                                    </code>
                                    <code className="flex-none min-w-full">
                                        <span className="flex">
                                            <svg viewBox="0 -9 3 24" aria-hidden="true" className="flex-none overflow-visible text-pink-400 w-auto h-6 mr-3">
                                                <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                            <span className="flex-auto">
                                                Click 'Start Workflow' to see your agents in action.
                                            </span>
                                        </span>
                                    </code>
                                    <code className="flex-none min-w-full">
                                        <span className="flex">
                                            <svg viewBox="0 -9 3 24" aria-hidden="true" className="flex-none overflow-visible text-pink-400 w-auto h-6 mr-3">
                                                <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                            <span className="flex-auto">
                                                Edit `sample.kban.js` in your project root to start customizing.
                                            </span>
                                        </span>
                                    </code>
                                    <code className="flex-none min-w-full">
                                        <span className="flex">
                                            <svg viewBox="0 -9 3 24" aria-hidden="true" className="flex-none overflow-visible text-pink-400 w-auto h-6 mr-3">
                                                <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                            <span className="flex-auto">
                                                Add more teams by creating `*.kban.js` files in your project.
                                            </span>
                                        </span>
                                    </code>
                                </pre>
                            </div>
                        </div>
                        {/* --- STEPS --- */}
                        {/* --- RESOURCES --- */}
                        <div className="mt-8 pb-2">
                            <span className="text-slate-400 text-lg font-medium">Resources</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <a className="flex gap-1 items-center text-sm text-slate-200 hover:underline hover:text-slate-200" href="https://docs.kaibanjs.com/get-started/Using%20the%20Agentic%20Kanban%20Board" target="_blank">
                                <BookmarkIcon className="w-4 h-4 text-indigo-500" />
                                Quick Start Guide
                            </a>
                            <a className="flex gap-1 items-center text-sm text-slate-200 hover:underline hover:text-slate-200" href="https://docs.kaibanjs.com/" target="_blank">
                                <BookOpenIcon className="w-4 h-4 text-indigo-500" />
                                Full documentation
                            </a>
                            <a className="flex gap-1 items-center text-sm text-slate-200 hover:underline hover:text-slate-200" href="https://github.com/kaiban-ai/KaibanJS" target="_blank">
                                <span className="text-indigo-500"><GitHubIcon /></span>
                                Code & Contribute
                            </a>
                            <a className="flex gap-1 items-center text-sm text-slate-200 hover:underline hover:text-slate-200" href="https://www.kaibanjs.com/" target="_blank">
                                <GlobeAltIcon className="w-4 h-4 text-indigo-500" />
                                Learn about KaibanJS
                            </a>
                            <a className="flex gap-1 items-center text-sm text-slate-200 hover:underline hover:text-slate-200" href="https://kaibanjs.com/discord" target="_blank">
                                <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-indigo-500" />
                                Community Support
                            </a>
                        </div>
                        {/* --- RESOURCES --- */}
                    </>
                )}
            </div>
            {/* --- Footer --- */}
            <div className="border-t border-slate-950 pt-6">
                {/* --- PRIVACY --- */}
                <div className="pb-1">
                    <span className="text-slate-300 text-xs font-medium">Privacy Notice</span>
                </div>
                <span className="text-xs font-normal text-slate-400">
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
    } = useAgentsPlaygroundStore(
        (state) => ({
            teamStore: state.teamStore,
            errorState: state.errorState
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

    const removeLineBreaksAndExtraSpaces = (text) => {
        return text.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ");
    };

    return (
        <div className="relative">
            <div className="flex flex-row">
                <div className="px-6 mt-3 pb-3 flex items-center gap-1.5">
                    <Square3Stack3DIcon className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">Preview</span>
                </div>
                <div className="flex-grow border border-slate-700 border-r-0 border-t-0 bg-slate-950"></div>
            </div>
            <div className="mt-4 px-6 divide-y divide-slate-950">
                {!errorState.hasError ? (
                    <>
                        {/* TOPIC */}
                        <div className="mt-4 pb-6">
                            <span className="text-slate-400 text-lg font-medium">Inputs</span>
                            <div className="flex flex-col gap-3 mt-2">
                                {Object.keys(inputs).map((item, index) => (
                                    <div key={index} className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold text-slate-200">{formatString(item)}</span>
                                        <Textarea
                                            name="input"
                                            value={removeLineBreaksAndExtraSpaces(inputs[item])}
                                            onChange={(event) => {
                                                setInputs({ ...inputs, [item]: event.target.value });
                                            }}
                                            placeholder="Enter input value"
                                            className="block resize-none w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* TOPIC */}
                        {/* AGENTS */}
                        <div className="pt-6 pb-6">
                            <span className="text-slate-400 text-lg font-medium">Agents</span>
                            <div className="flex flex-wrap gap-3 mt-2">
                                {agents?.map((agent) => (
                                    <AgentCard key={agent.id} agent={agent} />
                                ))}
                                {agents.length === 0 && (
                                    <div className="flex flex-col items-center gap-1 p-4 min-w-full">
                                        <UserGroupIcon className="w-8 h-8 text-indigo-300" />
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm text-slate-200">Agents Unavailable</span>
                                            <span className="max-w-md text-center text-slate-400 text-xs font-normal">No agents are currently set up or available. Please ensure the appropriate configurations are in place to proceed.</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* AGENTS */}
                        {/* TASK */}
                        <div className="pt-6">
                            <span className="text-slate-400 text-lg font-medium">Tasks</span>
                            <div className="flex flex-wrap gap-3 mt-2">
                                {tasks.map((task) => (
                                    <TaskCard key={task.id} task={task} showOptions={false} />
                                ))}
                                {tasks.length === 0 && (
                                    <div className="flex flex-col items-center gap-1 p-4 min-w-full">
                                        <Squares2X2Icon className="w-8 h-8 text-indigo-300" />
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm text-slate-200">Tasks Unavailable</span>
                                            <span className="max-w-md text-center text-slate-400 text-xs font-normal">No tasks are currently set up or available. Please ensure the appropriate configurations are in place to proceed.</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* TASK */}
                    </>
                ) : (
                    <div className="mt-4 pb-6">
                        <span className="text-slate-400 text-lg font-medium">Error</span>
                        <div className="flex flex-wrap gap-3 mt-2">
                            <ul className="list-inside list-disc">
                                <li className="text-red-400 text-sm">{errorState.error}</li>
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
            <div className="hidden md:grid grid-cols-5 divide-x divide-slate-700 h-full">
                {/* --- EDITOR --- */}
                {!uiSettings.isPreviewMode && editorComponent && (
                    <div className="col-span-3 h-full">
                        {editorComponent}
                    </div>
                )}
                {/* --- EDITOR --- */}
                {/* --- DASHBOARD --- */}
                {uiSettings.isPreviewMode && (
                    <div className="col-span-3 h-full overflow-auto">
                        <Dashboard />
                    </div>
                )}
                {/* --- DASHBOARD --- */}
                {/* --- PREVIEW --- */}
                <div className="col-span-2 pb-6 h-full overflow-auto">
                    <Preview />
                </div>
                {/* --- PREVIEW --- */}
            </div>
            {/* --- DESKTOP --- */}
            {/* --- MOBILE --- */}
            <div className="block md:hidden relative h-full">
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
                            <div className="h-full">
                                {editorComponent}
                            </div>
                        )}
                        {/* --- EDITOR --- */}
                        {/* --- DASHBOARD --- */}
                        {uiSettings.isPreviewMode && (
                            <div className="h-full overflow-auto">
                                <Dashboard onChange={goToPreviewSlide} />
                            </div>
                        )}
                        {/* --- DASHBOARD --- */}
                    </SwiperSlide>
                    <SwiperSlide>
                        {/* --- PREVIEW --- */}
                        <div className="pb-8 h-full overflow-auto">
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