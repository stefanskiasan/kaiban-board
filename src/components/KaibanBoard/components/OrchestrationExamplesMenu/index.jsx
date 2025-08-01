import React from 'react';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  CloseButton,
} from '@headlessui/react';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

// Industry-Specific Orchestration Examples
import { orchestrationHealthcareOpenai } from '../../assets/teams/orchestration_healthcare.js';
import { orchestrationFinanceOpenai } from '../../assets/teams/orchestration_finance.js';
import { orchestrationEducationOpenai } from '../../assets/teams/orchestration_education.js';
import { orchestrationRetailOpenai } from '../../assets/teams/orchestration_retail.js';
import { orchestrationManufacturingOpenai } from '../../assets/teams/orchestration_manufacturing.js';
import { orchestrationLegalOpenai } from '../../assets/teams/orchestration_legal.js';
import { orchestrationMarketingOpenai } from '../../assets/teams/orchestration_marketing.js';
import { orchestrationLogisticsOpenai } from '../../assets/teams/orchestration_logistics.js';
import { orchestrationResearchOpenai } from '../../assets/teams/orchestration_research.js';
import { orchestrationEventPlanningOpenai } from '../../assets/teams/orchestration_event_planning.js';
import { orchestrationConstructionOpenai } from '../../assets/teams/orchestration_construction.js';
import { orchestrationGamingOpenai } from '../../assets/teams/orchestration_gaming.js';
import { orchestrationNonprofitOpenai } from '../../assets/teams/orchestration_nonprofit.js';
import { orchestrationHospitalityOpenai } from '../../assets/teams/orchestration_hospitality.js';

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
      case 'orchestrationHealthcareOpenai':
        setExampleCodeAction(orchestrationHealthcareOpenai);
        break;
      case 'orchestrationFinanceOpenai':
        setExampleCodeAction(orchestrationFinanceOpenai);
        break;
      case 'orchestrationEducationOpenai':
        setExampleCodeAction(orchestrationEducationOpenai);
        break;
      case 'orchestrationRetailOpenai':
        setExampleCodeAction(orchestrationRetailOpenai);
        break;
      case 'orchestrationManufacturingOpenai':
        setExampleCodeAction(orchestrationManufacturingOpenai);
        break;
      case 'orchestrationLegalOpenai':
        setExampleCodeAction(orchestrationLegalOpenai);
        break;
      case 'orchestrationMarketingOpenai':
        setExampleCodeAction(orchestrationMarketingOpenai);
        break;
      case 'orchestrationLogisticsOpenai':
        setExampleCodeAction(orchestrationLogisticsOpenai);
        break;
      case 'orchestrationResearchOpenai':
        setExampleCodeAction(orchestrationResearchOpenai);
        break;
      case 'orchestrationEventPlanningOpenai':
        setExampleCodeAction(orchestrationEventPlanningOpenai);
        break;
      case 'orchestrationConstructionOpenai':
        setExampleCodeAction(orchestrationConstructionOpenai);
        break;
      case 'orchestrationGamingOpenai':
        setExampleCodeAction(orchestrationGamingOpenai);
        break;
      case 'orchestrationNonprofitOpenai':
        setExampleCodeAction(orchestrationNonprofitOpenai);
        break;
      case 'orchestrationHospitalityOpenai':
        setExampleCodeAction(orchestrationHospitalityOpenai);
        break;
      default:
        setExampleCodeAction(orchestrationHealthcareOpenai);
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
            Industry Orchestration Examples
          </div>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestrationHealthcareOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🏥 Healthcare - Hospital Operations
            </p>
            <p className="kb-text-xs kb-text-slate-500 kb-text-left kb-mt-1">
              Patient care coordination with safety protocols
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestrationFinanceOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              💰 Finance - Investment Management
            </p>
            <p className="kb-text-xs kb-text-slate-500 kb-text-left kb-mt-1">
              Portfolio optimization with compliance focus
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestrationEducationOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🎓 Education - Course Development
            </p>
            <p className="kb-text-xs kb-text-slate-500 kb-text-left kb-mt-1">
              Adaptive learning with continuous improvement
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestrationRetailOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🛒 Retail - E-commerce Operations
            </p>
            <p className="kb-text-xs kb-text-slate-500 kb-text-left kb-mt-1">
              High-volume inventory and pricing management
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestrationManufacturingOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🏭 Manufacturing - Smart Factory
            </p>
            <p className="kb-text-xs kb-text-slate-500 kb-text-left kb-mt-1">
              Real-time production optimization with AI
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestrationLegalOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              ⚖️ Legal - Contract & Compliance
            </p>
            <p className="kb-text-xs kb-text-slate-500 kb-text-left kb-mt-1">
              Precise document analysis with validation
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestrationMarketingOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              📣 Marketing - Campaign Management
            </p>
            <p className="kb-text-xs kb-text-slate-500 kb-text-left kb-mt-1">
              Creative campaigns with data optimization
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestrationLogisticsOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🚚 Logistics - Supply Chain
            </p>
            <p className="kb-text-xs kb-text-slate-500 kb-text-left kb-mt-1">
              Dynamic route and inventory optimization
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestrationResearchOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🔬 Research - Scientific Studies
            </p>
            <p className="kb-text-xs kb-text-slate-500 kb-text-left kb-mt-1">
              Adaptive research with continuous learning
            </p>
          </CloseButton>
          
          <div className="kb-px-3 kb-py-2 kb-text-xs kb-font-semibold kb-text-slate-500 kb-uppercase kb-tracking-wider kb-border-b kb-border-slate-700 kb-mt-3 kb-mb-2">
            Advanced Orchestration Patterns
          </div>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestrationEventPlanningOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🎉 Event Planning - Initial Orchestration
            </p>
            <p className="kb-text-xs kb-text-slate-500 kb-text-left kb-mt-1">
              One-time planning with task generation enabled
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestrationConstructionOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🏗️ Construction - Continuous Adaptation
            </p>
            <p className="kb-text-xs kb-text-slate-500 kb-text-left kb-mt-1">
              Ongoing optimization without new task creation
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestrationGamingOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🎮 Gaming - Innovative AI-Driven
            </p>
            <p className="kb-text-xs kb-text-slate-500 kb-text-left kb-mt-1">
              Creative mode with AI priority optimization
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestrationNonprofitOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🤝 Nonprofit - Learning Mode
            </p>
            <p className="kb-text-xs kb-text-slate-500 kb-text-left kb-mt-1">
              Continuous improvement with mission focus
            </p>
          </CloseButton>
          
          <CloseButton
            className="kb-group kb-block kb-w-full kb-rounded-lg kb-py-2 kb-px-3 kb-transition hover:kb-bg-purple-500/15"
            onClick={() => {
              handleSelectExample('orchestrationHospitalityOpenai');
            }}
          >
            <p className="kb-text-sm kb-font-medium kb-text-slate-400 kb-text-left group-hover:kb-text-purple-400">
              🏨 Hospitality - Adaptive Static
            </p>
            <p className="kb-text-xs kb-text-slate-500 kb-text-left kb-mt-1">
              Dynamic mode with fixed priority structure
            </p>
          </CloseButton>
        </div>
      </PopoverPanel>
    </Popover>
  );
};

export default OrchestrationExamplesMenu;