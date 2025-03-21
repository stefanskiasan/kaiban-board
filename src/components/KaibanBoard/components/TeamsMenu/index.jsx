/* eslint-disable react/prop-types */
import React from 'react';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';

const TeamsMenu = ({ onChange }) => {
  const useAgentsPlaygroundStore = usePlaygroundStore();
  const { teams, project, setTeamAction } = useAgentsPlaygroundStore(state => ({
    teams: state.teams,
    project: state.project,
    setTeamAction: state.setTeamAction,
  }));

  return (
    <>
      <div className="kb-mt-6 kb-pb-2">
        <span className="kb-text-slate-400 kb-text-lg kb-font-medium">
          Your Teams
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {teams.map((team, idx) => (
          <a
            key={idx}
            className={`kb-group kb-flex kb-gap-2 kb-items-center kb-cursor-pointer`}
            onClick={() => {
              setTeamAction(team);
              onChange();
            }}
          >
            <div
              className={`kb-w-[10px] kb-h-[10px] kb-ring-1 kb-rounded-sm kb-ring-indigo-500 group-hover:kb-bg-indigo-500 ${project?.name === team.store?.getState().name ? 'kb-bg-indigo-500' : 'kb-bg-slate-800'}`}
            ></div>
            <span className="kb-text-sm kb-text-slate-200">
              {team.store?.getState().name || 'Untitled Project'}
            </span>
          </a>
        ))}
      </div>
    </>
  );
};

export default TeamsMenu;
