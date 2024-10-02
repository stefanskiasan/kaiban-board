
import React from 'react';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import AgentAvatar from '../Common/AgentAvatar';

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
                <span className="text-slate-400 text-lg font-medium">Your Teams</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team, idx) => (
                    <div key={idx} className={`group flex flex-col gap-3 cursor-pointer p-4 bg-slate-800 rounded-lg ring-1 hover:ring-indigo-500 transition-all ${project?.name === team.store?.getState().name ? "ring-indigo-500" : "ring-slate-950"}`}
                        onClick={() => {
                            setTeamAction(team);
                            onChange();
                        }}>
                        <div className="flex gap-2 relative">
                            <span className="text-sm font-medium text-slate-200 w-[70%] overflow-hidden text-ellipsis whitespace-nowrap">
                                {team.store?.getState().name || "Untitled Project"}
                            </span>
                            {project?.name === team.store?.getState().name && (
                                <div className="absolute top-0 right-0 flex items-center bg-indigo-500/15 py-1 px-2 rounded-full">
                                    <span className="text-xs text-indigo-500 font-medium">Active</span>
                                </div>
                            )}
                        </div>
                        <div className="flex -space-x-2">
                            {team.store?.getState().agents?.map((agent) => (
                                <AgentAvatar key={agent.id} agent={agent} />
                            ))}
                        </div>

                    </div>
                ))}
            </div>
        </>
    );
};

export default TeamsMenu;