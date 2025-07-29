import React from 'react';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  CloseButton,
} from '@headlessui/react';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

// Orchestration Examples - All 15 examples
import { orchestration01BasicOpenai } from '../../assets/teams/orchestration_01_basic';
import { orchestration02ConservativeOpenai } from '../../assets/teams/orchestration_02_conservative';
import { orchestration03InnovativeOpenai } from '../../assets/teams/orchestration_03_innovative';
import { orchestration04LearningOpenai } from '../../assets/teams/orchestration_04_learning';
import { orchestration05SkillsOpenai } from '../../assets/teams/orchestration_05_skills';
import { orchestration06AiDrivenOpenai } from '../../assets/teams/orchestration_06_ai_driven';
import { orchestration07AdaptationOpenai } from '../../assets/teams/orchestration_07_adaptation';
import { orchestration08OptimizationOpenai } from '../../assets/teams/orchestration_08_optimization';
import { orchestration09GenerationOpenai } from '../../assets/teams/orchestration_09_generation';
import { orchestration10EnterpriseOpenai } from '../../assets/teams/orchestration_10_enterprise';
import { orchestration11EcommerceOpenai } from '../../assets/teams/orchestration_11_ecommerce';
import { orchestration12MicroservicesOpenai } from '../../assets/teams/orchestration_12_microservices';
import { orchestration13ContinuousOpenai } from '../../assets/teams/orchestration_13_continuous';
import { orchestration14ComparisonOpenai } from '../../assets/teams/orchestration_14_comparison';
import { orchestration15RuntimeOpenai } from '../../assets/teams/orchestration_15_runtime';

const OrchestrationExamplesMenu = () => {
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
      case 'orchestration01BasicOpenai':
        setExampleCodeAction(orchestration01BasicOpenai);
        break;
      case 'orchestration02ConservativeOpenai':
        setExampleCodeAction(orchestration02ConservativeOpenai);
        break;
      case 'orchestration03InnovativeOpenai':
        setExampleCodeAction(orchestration03InnovativeOpenai);
        break;
      case 'orchestration04LearningOpenai':
        setExampleCodeAction(orchestration04LearningOpenai);
        break;
      case 'orchestration05SkillsOpenai':
        setExampleCodeAction(orchestration05SkillsOpenai);
        break;
      case 'orchestration06AiDrivenOpenai':
        setExampleCodeAction(orchestration06AiDrivenOpenai);
        break;
      case 'orchestration07AdaptationOpenai':
        setExampleCodeAction(orchestration07AdaptationOpenai);
        break;
      case 'orchestration08OptimizationOpenai':
        setExampleCodeAction(orchestration08OptimizationOpenai);
        break;
      case 'orchestration09GenerationOpenai':
        setExampleCodeAction(orchestration09GenerationOpenai);
        break;
      case 'orchestration10EnterpriseOpenai':
        setExampleCodeAction(orchestration10EnterpriseOpenai);
        break;
      case 'orchestration11EcommerceOpenai':
        setExampleCodeAction(orchestration11EcommerceOpenai);
        break;
      case 'orchestration12MicroservicesOpenai':
        setExampleCodeAction(orchestration12MicroservicesOpenai);
        break;
      case 'orchestration13ContinuousOpenai':
        setExampleCodeAction(orchestration13ContinuousOpenai);
        break;
      case 'orchestration14ComparisonOpenai':
        setExampleCodeAction(orchestration14ComparisonOpenai);
        break;
      case 'orchestration15RuntimeOpenai':
        setExampleCodeAction(orchestration15RuntimeOpenai);
        break;
      default:
        setExampleCodeAction(orchestration01BasicOpenai);
    }
  };

  return (
    <Popover>
      <PopoverButton
        disabled={teamWorkflowStatus === 'RUNNING'}
        className="kb-relative kb-group kb-w-[140px] kb-flex kb-items-center kb-justify-center kb-p-2 kb-text-sm kb-font-medium kb-text-slate-400 focus:kb-outline-none data-[hover]:kb-text-purple-400 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
      >
        ⚙️ Orchestration
        <ChevronDownIcon className="kb-w-4 kb-h-4 kb-ml-1" />
      </PopoverButton>
      <PopoverPanel
        transition
        anchor="bottom"
        className="kb-min-w-[420px] kb-z-[51] kb-rounded-xl kb-bg-slate-900 kb-p-2 kb-ring-1 kb-ring-slate-950 kb-text-sm/6 kb-transition kb-duration-200 kb-ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-kb-translate-y-1 data-[closed]:kb-opacity-0"
      >
        <div className="kb-p-1 kb-max-h-96 kb-overflow-y-auto">
          <div className="kb-px-3 kb-py-2 kb-text-xs kb-font-semibold kb-text-slate-500 kb-uppercase kb-tracking-wider kb-border-b kb-border-slate-700 kb-mb-2">
            Orchestration Examples
          </div>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestration01BasicOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🚀 01 - Basic Orchestration
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestration02ConservativeOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🛡️ 02 - Conservative Mode
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestration03InnovativeOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              ✨ 03 - Innovative Mode
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestration04LearningOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🧠 04 - Learning Mode
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestration05SkillsOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🎯 05 - Skills-Based Distribution
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestration06AiDrivenOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🤖 06 - AI-Driven Prioritization
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestration07AdaptationOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🔄 07 - Task Adaptation
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestration08OptimizationOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              ⚡ 08 - Continuous Optimization
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestration09GenerationOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              ➕ 09 - Task Generation
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestration10EnterpriseOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🏢 10 - Enterprise Setup
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestration11EcommerceOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🛒 11 - E-commerce Project
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestration12MicroservicesOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🔧 12 - Microservices Architecture
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestration13ContinuousOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🔄 13 - Continuous Orchestration
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestration14ComparisonOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              ⚖️ 14 - Mode Comparison
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestration15RuntimeOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🎛️ 15 - Runtime Control
            </p>
          </CloseButton>
        </div>
      </PopoverPanel>
    </Popover>
  );
};

export default OrchestrationExamplesMenu;