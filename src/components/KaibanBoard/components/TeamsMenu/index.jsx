
import React from 'react';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';

const TeamsMenu = ({ onChange }) => {
    const useAgentsPlaygroundStore = usePlaygroundStore();
    const {
        teams,
        project,
        setTeamAction
    } = useAgentsPlaygroundStore(
        (state) => ({
            teams: state.teams,
            project: state.project,
            setTeamAction: state.setTeamAction
        })
    );

    return (
        <>
            <div className="mt-6 pb-2">
                <span className="text-slate-200 text-lg font-medium">Your Teams</span>
            </div>
            <div className="flex flex-col gap-2">
                {teams.map((team, idx) => (
                    <a key={idx} className={`group flex gap-2 items-center cursor-pointer`}
                        onClick={() => {
                            setTeamAction(team);
                            onChange();
                        }}>
                        <div className={`w-[10px] h-[10px] ring-1 rounded-sm ring-indigo-500 group-hover:bg-indigo-500 ${project?.name === team.store?.getState().name ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
                        <span className="text-sm text-slate-400">
                            {team.store?.getState().name || "Untitled Project"}
                        </span>
                    </a>
                ))}
            </div>
        </>
    );
};

export default TeamsMenu;