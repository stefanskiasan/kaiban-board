
import { Popover, PopoverButton, PopoverPanel, CloseButton } from '@headlessui/react';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const TeamsMenu = () => {
    const useAgentsPlaygroundStore = usePlaygroundStore();
    const {
        teams,
        project,
        teamStore,
        setTeamAction
    } = useAgentsPlaygroundStore(
        (state) => ({
            teams: state.teams,
            project: state.project,
            teamStore: state.teamStore,
            setTeamAction: state.setTeamAction
        })
    );

    const {
        teamWorkflowStatus
    } = teamStore(state => ({
        teamWorkflowStatus: state.teamWorkflowStatus
    }));

    return (
        <Popover>
            <PopoverButton disabled={teamWorkflowStatus === 'RUNNING'}
                className={`relative group w-min flex items-center p-2 text-sm font-medium text-slate-400 focus:outline-none data-[hover]:text-indigo-500 data-[focus]:outline-1 data-[focus]:outline-white ${!teams.length ? 'hidden' : ''}`}>
                <div className="border-r border-slate-700 h-[32px] mr-5"></div>
                Teams
                <ChevronDownIcon className="w-4 h-4 ml-1" />
            </PopoverButton>
            <PopoverPanel
                transition
                anchor="bottom"
                className="min-w-[125px] z-[51] rounded-xl bg-slate-900 p-2 ring-1 ring-slate-950 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
            >
                <div className="p-1">
                    {teams.map((team, idx) => (
                        <CloseButton key={idx} className={`group block w-full rounded-lg py-2 px-3 transition hover:bg-indigo-500/15 ${project?.name === team.store?.getState().name ? 'bg-indigo-500/15' : ''} ${idx !== teams.length - 1 ? 'mb-[2px]' : ''}`}
                            onClick={() => { setTeamAction(team) }}>
                            <p className={`text-sm font-medium ${project?.name === team.store?.getState().name ? 'text-indigo-500' : 'text-slate-400'} text-left group-hover:text-indigo-500`}>
                                {team.store?.getState().name || "Untitled Project"}
                            </p>
                        </CloseButton>
                    ))}
                </div>
            </PopoverPanel>
        </Popover>
    );
};

export default TeamsMenu;