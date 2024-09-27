import React, { useRef } from 'react';
import { Squares2X2Icon, UserGroupIcon } from '@heroicons/react/24/solid';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { Textarea } from '@headlessui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

import AgentCard from '../../components/Common/AgentCard';
import TaskCard from '../../components/Common/TaskCard';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import TeamsMenu from '../../components/TeamsMenu';

const Dashboard = ({ onChange = () => { } }) => {
    return (
        <div className="relative flex flex-col mt-6 px-6">
            <div className="flex">
                <span className="text-2xl font-semibold text-slate-200">Welcome to your Kaiban Board</span>
            </div>
            {/* --- TEAMS --- */}
            <TeamsMenu onChange={onChange} />
            {/* --- TEAMS --- */}
            {/* --- INFO --- */}
            <ul className="mt-6 ring-1 ring-slate-800 rounded-lg p-4">
                <li className="text-sm text-slate-400">- Make changes on the sample.kban.js file in the root of your project to start playing around.</li>
                <li className="text-sm text-slate-400">- You will need an OpenAI API key to make it work. (The key is being stored locally... So you don't have to have to worry)</li>
                <li className="text-sm text-slate-400">- Click Start Workflow to See the Team in Action.</li>
                <li className="text-sm text-slate-400">- Add more teams by creating .kban.js files on your project root.</li>
            </ul>
            {/* --- INFO --- */}
            {/* --- RESOURCES --- */}
            <div className="mt-6 pb-2">
                <span className="text-slate-200 text-lg font-medium">Resources</span>
            </div>
            <div className="flex flex-col gap-2">
                <a className="text-sm text-indigo-500 hover:underline" href="https://docs.kaibanjs.com/get-started/Using%20the%20Agentic%20Kanban%20Board" target="_blank">
                    Tutorial: Kaiban Board Walkthrough
                </a>
                <a className="text-sm text-indigo-500 hover:underline" href="https://www.kaibanjs.com/share/9lyzu1VjBFPOl6FRgNWu" target="_blank">
                    Example: Sports News Creation Team
                </a>
                <a className="text-sm text-indigo-500 hover:underline" href="https://www.kaibanjs.com/" target="_blank">
                    KaibanJS project Website
                </a>
                <a className="text-sm text-indigo-500 hover:underline" href="https://github.com/kaiban-ai/KaibanJS" target="_blank">
                    KaibanJS Github Repository
                </a>
            </div>
            {/* --- RESOURCES --- */}
            {/* --- PRIVACY --- */}
            <div className="fixed bottom-0 bg-slate-900 pb-8 md:pb-4 pr-4 md:w-3/6">
                <div className="pb-1">
                    <span className="text-slate-300 text-xs font-medium">Privacy Notice</span>
                </div>
                <span className="text-xs font-normal text-slate-400">All your do on this UI is done at local level... this means we are NOT getting access to your API keys, Data, Code or anything else. Other legal stuff here. Have fun ;)</span>
            </div>
            {/* --- PRIVACY --- */}
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
                    <div className="col-span-3 pb-6 h-full overflow-auto">
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
                            <div className="pb-6 h-full overflow-auto">
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