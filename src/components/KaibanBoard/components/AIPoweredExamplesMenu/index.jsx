import React from 'react';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  CloseButton,
} from '@headlessui/react';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

// AI-Powered Examples
import { sportsNewsOpenai } from '../../assets/teams/sports_news';
import { tripPlanningOpenai } from '../../assets/teams/trip_planning';
import { resumeCreationOpenai } from '../../assets/teams/resume_creation';
import { globalNewsOpenai } from '../../assets/teams/global_news';
import { scientificComputingOpenai } from '../../assets/teams/scientific_computing';
import { githubIssueAnalysisOpenai } from '../../assets/teams/github_issue_analysis';
import { websiteRoastOpenai } from '../../assets/teams/website_roast';
import { eventPlanningOpenai } from '../../assets/teams/event_planning';
import { researchAnalysisOpenai } from '../../assets/teams/research_analysis';
import { kaibanScraperOpenai } from '../../assets/teams/kaiban_scraper/openai';

const AIPoweredExamplesMenu = () => {
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
      case 'sportsNewsOpenai':
        setExampleCodeAction(sportsNewsOpenai);
        break;
      case 'tripPlanningOpenai':
        setExampleCodeAction(tripPlanningOpenai);
        break;
      case 'resumeCreationOpenai':
        setExampleCodeAction(resumeCreationOpenai);
        break;
      case 'globalNewsOpenai':
        setExampleCodeAction(globalNewsOpenai);
        break;
      case 'scientificComputingOpenai':
        setExampleCodeAction(scientificComputingOpenai);
        break;
      case 'eventPlanningOpenai':
        setExampleCodeAction(eventPlanningOpenai);
        break;
      case 'researchAnalysisOpenai':
        setExampleCodeAction(researchAnalysisOpenai);
        break;
      case 'githubIssueAnalysisOpenai':
        setExampleCodeAction(githubIssueAnalysisOpenai);
        break;
      case 'websiteRoastOpenai':
        setExampleCodeAction(websiteRoastOpenai);
        break;
      case 'kaibanScraperOpenai':
        setExampleCodeAction(kaibanScraperOpenai);
        break;
      default:
        setExampleCodeAction(eventPlanningOpenai);
    }
  };

  return (
    <Popover>
      <PopoverButton
        disabled={teamWorkflowStatus === 'RUNNING'}
        className="kb-relative kb-group kb-w-[120px] kb-flex kb-items-center kb-justify-center kb-p-2 kb-text-sm kb-font-medium kb-text-slate-400 focus:kb-outline-none data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
      >
        🤖 AI-Powered
        <ChevronDownIcon className="kb-w-4 kb-h-4 kb-ml-1" />
      </PopoverButton>
      <PopoverPanel
        transition
        anchor="bottom"
        className="kb-min-w-[380px] kb-z-[51] kb-rounded-xl kb-bg-slate-900 kb-p-2 kb-ring-1 kb-ring-slate-950 kb-text-sm/6 kb-transition kb-duration-200 kb-ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-kb-translate-y-1 data-[closed]:kb-opacity-0"
      >
        <div className="kb-p-1 kb-max-h-96 kb-overflow-y-auto">
          <div className="kb-px-3 kb-py-2 kb-text-xs kb-font-semibold kb-text-slate-500 kb-uppercase kb-tracking-wider kb-border-b kb-border-slate-700 kb-mb-2">
            AI-Powered Examples
          </div>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-indigo-500/15"
            onClick={() => {
              handleSelectExample('eventPlanningOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-indigo-500">
              Event Planning Team
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-indigo-500/15"
            onClick={() => {
              handleSelectExample('tripPlanningOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-indigo-500">
              Trip Planning Team
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-indigo-500/15"
            onClick={() => {
              handleSelectExample('researchAnalysisOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-indigo-500">
              Research Analysis Team
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-indigo-500/15"
            onClick={() => {
              handleSelectExample('githubIssueAnalysisOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-indigo-500">
              GitHub Issue Analysis Team
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-indigo-500/15"
            onClick={() => {
              handleSelectExample('scientificComputingOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-indigo-500">
              Scientific Computing Team
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-indigo-500/15"
            onClick={() => {
              handleSelectExample('resumeCreationOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-indigo-500">
              Resume Creation Team
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-indigo-500/15"
            onClick={() => {
              handleSelectExample('sportsNewsOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-indigo-500">
              Sports News Team
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-indigo-500/15"
            onClick={() => {
              handleSelectExample('globalNewsOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-indigo-500">
              Global News Team
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-indigo-500/15"
            onClick={() => {
              handleSelectExample('websiteRoastOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-indigo-500">
              Website Roast Team
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-indigo-500/15"
            onClick={() => {
              handleSelectExample('kaibanScraperOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-indigo-500">
              Kaiban Scraper Team
            </p>
          </CloseButton>
        </div>
      </PopoverPanel>
    </Popover>
  );
};

export default AIPoweredExamplesMenu;