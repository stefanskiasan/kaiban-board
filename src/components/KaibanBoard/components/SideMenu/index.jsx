import { Squares2X2Icon, SparklesIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { Tab, TabList } from '@headlessui/react';
import Tooltip from "../Common/Tooltip";
import { usePlaygroundStore } from '../../store/PlaygroundProvider';

const SideMenu = () => {
    const useAgentsPlaygroundStore = usePlaygroundStore();
    const {
        teamStore,
        setTabAction
    } = useAgentsPlaygroundStore(
        (state) => ({
            teamStore: state.teamStore,
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
                <CodeBracketIcon className="w-6 h-6" />
                <Tooltip text="Setup Team" />
            </Tab>
            <Tab className="relative z-10 isolate group w-full h-[55px] flex justify-center items-center border-l-2 pr-[2px] border-slate-900 text-sm font-medium text-slate-400 focus:outline-none data-[selected]:border-indigo-500 data-[selected]:text-indigo-500 data-[hover]:text-indigo-500 data-[focus]:outline-1 data-[focus]:outline-white"
                onClick={() => setTabAction(1)}
            >
                <Squares2X2Icon className="w-6 h-6" />
                <Tooltip text="Task Board" />
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