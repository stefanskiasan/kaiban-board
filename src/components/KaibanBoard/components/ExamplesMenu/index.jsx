
import React from 'react';
import { Popover, PopoverButton, PopoverPanel, CloseButton } from '@headlessui/react';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { sportsNewsOpenai } from '../../assets/teams/sports_news';
import { tripPlanningOpenai } from '../../assets/teams/trip_planning';
import { resumeCreationOpenai } from '../../assets/teams/resume_creation';

const ExamplesMenu = () => {
    const useAgentsPlaygroundStore = usePlaygroundStore();
    const {
        teamStore,
        setExampleCodeAction
    } = useAgentsPlaygroundStore(
        (state) => ({
            teamStore: state.teamStore,
            setExampleCodeAction: state.setExampleCodeAction
        })
    );

    const {
        teamWorkflowStatus
    } = teamStore(state => ({
        teamWorkflowStatus: state.teamWorkflowStatus
    }));

    const handleSelectExample = (team) => {
        switch (team) {
            case 'sportsNewsOpenai':
                setExampleCodeAction(sportsNewsOpenai);
                break;
            case 'tripPlanningOpenai':
                setExampleCodeAction(tripPlanningOpenai);
                break;
            case 'resumeCreationOpenai':
                setExampleCodeAction(resumeCreationOpenai);
                break;
            default:
                setExampleCodeAction(sportsNewsOpenai);
        };
    };

    return (
        <Popover>
            <PopoverButton disabled={teamWorkflowStatus === 'RUNNING'} className="relative group w-min flex items-center p-2 text-sm font-medium text-slate-400 focus:outline-none data-[hover]:text-indigo-500 data-[focus]:outline-1 data-[focus]:outline-white">
                <div className="border-r border-slate-700 h-[32px] mr-5"></div>
                Examples
                <ChevronDownIcon className="w-4 h-4 ml-1" />
            </PopoverButton>
            <PopoverPanel
                transition
                anchor="bottom"
                className="min-w-[125px] z-[51] rounded-xl bg-slate-900 p-2 ring-1 ring-slate-950 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
            >
                <div className="p-1">
                    <CloseButton className="group block w-full rounded-lg py-2 px-3 transition hover:bg-indigo-500/15"
                        onClick={() => { handleSelectExample("sportsNewsOpenai") }}>
                        <p className="text-sm font-medium text-slate-400 text-left group-hover:text-indigo-500">Sports News Team</p>
                    </CloseButton>
                    <CloseButton className="group block w-full rounded-lg py-2 px-3 transition hover:bg-indigo-500/15"
                        onClick={() => { handleSelectExample("tripPlanningOpenai") }}>
                        <p className="text-sm font-medium text-slate-400 text-left group-hover:text-indigo-500">Trip Planning Team</p>
                    </CloseButton>
                    <CloseButton className="group block w-full rounded-lg py-2 px-3 transition hover:bg-indigo-500/15"
                        onClick={() => { handleSelectExample("resumeCreationOpenai") }}>
                        <p className="text-sm font-medium text-slate-400 text-left group-hover:text-indigo-500">Resume Creation Team</p>
                    </CloseButton>
                </div>
            </PopoverPanel>
        </Popover>
    );
};

export default ExamplesMenu;