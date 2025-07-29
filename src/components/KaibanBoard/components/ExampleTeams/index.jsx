import React from 'react';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  CloseButton,
} from '@headlessui/react';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { extractTeamName } from '../../utils/helper';

const ExampleTeams = () => {
  const useAgentsPlaygroundStore = usePlaygroundStore();
  const { teamStore, exampleTeams, setExampleCodeAction } =
    useAgentsPlaygroundStore(state => ({
      teamStore: state.teamStore,
      exampleTeams: state.exampleTeams,
      setExampleCodeAction: state.setExampleCodeAction,
    }));

  const { teamWorkflowStatus } = teamStore(state => ({
    teamWorkflowStatus: state.teamWorkflowStatus,
  }));

  return (
    <Popover>
      <PopoverButton
        disabled={teamWorkflowStatus === 'RUNNING' || !exampleTeams.length}
        className="kb-relative kb-group kb-w-[90px] kb-flex kb-items-center kb-justify-center kb-p-2 kb-text-sm kb-font-medium kb-text-slate-400 focus:kb-outline-none data-[hover]:kb-text-blue-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white data-[disabled]:kb-text-slate-600"
      >
        👥 Teams
        <ChevronDownIcon className="kb-w-4 kb-h-4 kb-ml-1" />
      </PopoverButton>
      <PopoverPanel
        transition
        anchor="bottom"
        className="kb-min-w-[125px] kb-z-[51] kb-rounded-xl kb-bg-slate-900 kb-p-2 kb-ring-1 kb-ring-slate-950 kb-text-sm/6 kb-transition kb-duration-200 kb-ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-kb-translate-y-1 data-[closed]:kb-opacity-0"
      >
        <div className="kb-p-1">
          {exampleTeams.map((team, idx) => (
            <CloseButton
              key={idx}
              className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-blue-500/15"
              onClick={() => {
                setExampleCodeAction(team);
              }}
            >
              <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-blue-500">
                {extractTeamName(team().code)}
              </p>
            </CloseButton>
          ))}
        </div>
      </PopoverPanel>
    </Popover>
  );
};

export default ExampleTeams;
