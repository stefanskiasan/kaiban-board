import React from 'react';
import { Squares2X2Icon, SparklesIcon, CodeBracketIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';
import { Tab, TabList } from '@headlessui/react';
import Tooltip from "../Common/Tooltip";
import { usePlaygroundStore } from '../../store/PlaygroundProvider';

const SideMenu = () => {
    const useAgentsPlaygroundStore = usePlaygroundStore();
    const {
        teamStore,
        uiSettings,
        setTabAction
    } = useAgentsPlaygroundStore(
        (state) => ({
            teamStore: state.teamStore,
            uiSettings: state.uiSettings,
            setTabAction: state.setTabAction
        })
    );

    const {
        teamWorkflowStatus,
    } = teamStore(state => ({
        teamWorkflowStatus: state.teamWorkflowStatus,
    }));

    return (
        <TabList className="w-[55px] flex flex-col">
            <Tab className="relative z-10 isolate group w-full h-[55px] flex justify-center items-center border-l-2 pr-[2px] border-slate-900 text-sm font-medium text-slate-400 focus:outline-none data-[selected]:border-indigo-500 data-[selected]:text-indigo-500 data-[hover]:text-indigo-500 data-[focus]:outline-1 data-[focus]:outline-white data-[disabled]:text-slate-500"
                onClick={() => setTabAction(0)}
                disabled={teamWorkflowStatus === 'RUNNING'}
            >
                {!uiSettings.isPreviewMode ? (
                    <>
                        <CodeBracketIcon className="w-6 h-6" />
                        <Tooltip text="Setup Team" />
                    </>
                ) : (
                    <>
                        <Squares2X2Icon className="w-6 h-6" />
                        <Tooltip text="Dashboard" />
                    </>
                )}

            </Tab>
            <Tab className="relative z-10 isolate group w-full h-[55px] flex justify-center items-center border-l-2 pr-[2px] border-slate-900 text-sm font-medium text-slate-400 focus:outline-none data-[selected]:border-indigo-500 data-[selected]:text-indigo-500 data-[hover]:text-indigo-500 data-[focus]:outline-1 data-[focus]:outline-white"
                onClick={() => setTabAction(1)}
            >
                <ViewColumnsIcon className="w-6 h-6" />
                <Tooltip text="Kaiban Board" />
            </Tab>
            <Tab className="relative z-10 isolate group w-full h-[55px] flex justify-center items-center border-l-2 pr-[2px] border-slate-900 text-sm font-medium text-slate-400 focus:outline-none data-[selected]:border-indigo-500 data-[selected]:text-indigo-500 data-[hover]:text-indigo-500 data-[focus]:outline-1 data-[focus]:outline-white data-[disabled]:text-slate-500"
                onClick={() => setTabAction(2)}
                disabled={teamWorkflowStatus === 'RUNNING'}
            >
                <SparklesIcon className="w-6 h-6" />
                <Tooltip text="Results Overview" />
            </Tab>
        </TabList>
    );
};

export default SideMenu;