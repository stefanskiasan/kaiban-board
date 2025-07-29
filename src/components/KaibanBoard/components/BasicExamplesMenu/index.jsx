import React from 'react';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  CloseButton,
} from '@headlessui/react';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

// Basic Examples (Classic KaibanJS)
import { basicResumeTeamOpenai } from '../../assets/teams/basic_resume_team';
import { basicBlogWritingOpenai } from '../../assets/teams/basic_blog_writing';
import { basicResearchTeamOpenai } from '../../assets/teams/basic_research_team';
import { customerSupportTeamOpenai } from '../../assets/teams/customer_support_team';
import { basicTranslationTeamOpenai } from '../../assets/teams/basic_translation_team';

const BasicExamplesMenu = () => {
  const useAgentsPlaygroundStore = usePlaygroundStore();
  const { teamStore, setExampleCodeAction } = useAgentsPlaygroundStore(
    state => ({
      teamStore: state.teamStore,
      setExampleCodeAction: state.setExampleCodeAction,
    })
  );

  const { teamWorkflowStatus } = teamStore(state => ({
    teamWorkflowStatus: state.teamWorkflowStatus,
  }));

  const handleSelectExample = team => {
    switch (team) {
      case 'basicResumeTeamOpenai':
        setExampleCodeAction(basicResumeTeamOpenai);
        break;
      case 'basicBlogWritingOpenai':
        setExampleCodeAction(basicBlogWritingOpenai);
        break;
      case 'basicResearchTeamOpenai':
        setExampleCodeAction(basicResearchTeamOpenai);
        break;
      case 'customerSupportTeamOpenai':
        setExampleCodeAction(customerSupportTeamOpenai);
        break;
      case 'basicTranslationTeamOpenai':
        setExampleCodeAction(basicTranslationTeamOpenai);
        break;
      default:
        setExampleCodeAction(basicResumeTeamOpenai);
    }
  };

  return (
    <Popover>
      <PopoverButton
        disabled={teamWorkflowStatus === 'RUNNING'}
        className="kb-relative kb-group kb-w-[80px] kb-flex kb-items-center kb-justify-center kb-p-2 kb-text-sm kb-font-medium kb-text-slate-400 focus:kb-outline-none data-[hover]:kb-text-green-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
      >
        🟢 Basic
        <ChevronDownIcon className="kb-w-4 kb-h-4 kb-ml-1" />
      </PopoverButton>
      <PopoverPanel
        transition
        anchor="bottom"
        className="kb-min-w-[320px] kb-z-[51] kb-rounded-xl kb-bg-slate-900 kb-p-2 kb-ring-1 kb-ring-slate-950 kb-text-sm/6 kb-transition kb-duration-200 kb-ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-kb-translate-y-1 data-[closed]:kb-opacity-0"
      >
        <div className="kb-p-1 kb-max-h-96 kb-overflow-y-auto">
          <div className="kb-px-3 kb-py-2 kb-text-xs kb-font-semibold kb-text-slate-500 kb-uppercase kb-tracking-wider kb-border-b kb-border-slate-700 kb-mb-2">
            Basic Examples
          </div>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-green-500/15"
            onClick={() => {
              handleSelectExample('basicResumeTeamOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-green-400">
              📄 Basic Resume Team
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-green-500/15"
            onClick={() => {
              handleSelectExample('basicBlogWritingOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-green-400">
              ✍️ Blog Writing Team
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-green-500/15"
            onClick={() => {
              handleSelectExample('basicResearchTeamOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-green-400">
              🔬 Basic Research Team
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-green-500/15"
            onClick={() => {
              handleSelectExample('customerSupportTeamOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-green-400">
              🎧 Customer Support Team
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-green-500/15"
            onClick={() => {
              handleSelectExample('basicTranslationTeamOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-green-400">
              🌐 Translation Team
            </p>
          </CloseButton>
        </div>
      </PopoverPanel>
    </Popover>
  );
};

export default BasicExamplesMenu;