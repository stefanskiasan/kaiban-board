import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@headlessui/react';
import { SparklesIcon } from '@heroicons/react/24/solid';
import {
  ClipboardIcon,
  SparklesIcon as SparklesOutlineIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { copyToClipboard } from '../../utils/helper';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import OrchestrationDashboard from '../../components/dashboard/OrchestrationDashboard';

const ResultView = () => {
  const [activeTab, setActiveTab] = useState('results');
  
  const useAgentsPlaygroundStore = usePlaygroundStore();
  const { teamStore, persistedWorkflowLogs } = useAgentsPlaygroundStore(state => ({
    teamStore: state.teamStore,
    persistedWorkflowLogs: state.persistedWorkflowLogs,
  }));

  const { workflowResult, workflowLogs } = teamStore(state => ({
    workflowResult: state.workflowResult,
    workflowLogs: state.workflowLogs || [],
  }));

  // Use persisted logs if current logs are empty
  const displayLogs = workflowLogs.length > 0 ? workflowLogs : persistedWorkflowLogs;

  const tabs = [
    { id: 'results', label: 'Results', icon: DocumentTextIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
  ];

  return (
    <div className="kb-flex kb-flex-col kb-h-full">
      {/* Header */}
      <div className="kb-flex kb-flex-row">
        <div className="kb-px-6 kb-mt-3 kb-pb-3 kb-flex kb-items-center kb-gap-1.5">
          <SparklesOutlineIcon className="kb-w-4 kb-h-4 kb-text-white" />
          <span className="kb-text-sm kb-font-medium kb-text-white">
            Results Overview
          </span>
        </div>
        <div className="kb-flex-grow kb-border kb-border-slate-700 kb-border-r-0 kb-border-t-0 kb-bg-slate-900">
          <div className="kb-flex kb-items-center kb-gap-4 kb-h-full kb-pr-3.5">
            {/* Copy Button */}
            {workflowResult && activeTab === 'results' && (
              <Button
                className="kb-ml-auto kb-inline-flex kb-items-center kb-gap-2 kb-rounded-lg kb-bg-slate-900  kb-py-1.5 kb-px-3 kb-text-slate-400 kb-text-sm focus:kb-outline-none data-[hover]:kb-bg-indigo-500/15 data-[hover]:kb-text-indigo-500 data-[open]:kb-bg-gray-700 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
                onClick={() => {
                  copyToClipboard(
                    typeof workflowResult === 'string'
                      ? workflowResult
                      : JSON.stringify(workflowResult)
                  );
                }}
              >
                <ClipboardIcon className="kb-w-5 kb-h-5" />
                <span className="kb-hidden md:kb-block">Copy</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="kb-flex kb-border-b kb-border-slate-700">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`kb-flex kb-items-center kb-gap-2 kb-px-6 kb-py-3 kb-text-sm kb-font-medium kb-border-b-2 kb-transition-colors ${
                activeTab === tab.id
                  ? 'kb-text-indigo-400 kb-border-indigo-400'
                  : 'kb-text-slate-400 kb-border-transparent hover:kb-text-white hover:kb-border-slate-600'
              }`}
            >
              <Icon className="kb-w-4 kb-h-4" />
              {tab.label}
              {tab.id === 'analytics' && displayLogs.length > 0 && (
                <span className="kb-inline-flex kb-items-center kb-px-2 kb-py-0.5 kb-rounded-full kb-text-xs kb-bg-blue-600/20 kb-text-blue-400">
                  {displayLogs.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="kb-flex-1 kb-flex kb-flex-col kb-overflow-y-auto">
        {activeTab === 'results' && (
          /* Results View */
          <div className="kb-mt-4 kb-px-6 kb-flex-1 kb-overflow-hidden">
            {workflowResult && (
              <div className="kb-p-4 kb-h-full kb-overflow-y-auto" style={{ background: '#0C1117' }}>
                <div data-color-mode="dark">
                  <MDEditor.Markdown
                    source={
                      typeof workflowResult === 'string'
                        ? workflowResult
                        : JSON.stringify(workflowResult)
                    }
                  />
                </div>
              </div>
            )}
            {!workflowResult && (
              <div className="kb-flex kb-flex-col kb-items-center kb-justify-center kb-gap-2 kb-h-[calc(100vh-250px)]">
                <SparklesIcon className="kb-w-9 kb-h-9 kb-text-indigo-300" />
                <div className="kb-flex kb-flex-col kb-items-center">
                  <span className="kb-text-base kb-font-semibold kb-text-slate-200">
                    No Results Yet
                  </span>
                  <span className="kb-text-sm kb-font-normal kb-text-slate-400 kb-max-w-md kb-text-center">
                    The workflow has not been executed or no results are available.
                    Please run the workflow to see results.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          /* Analytics View */
          <div className="kb-flex-1 kb-px-6 kb-pb-6 kb-overflow-y-auto">
            <OrchestrationDashboard workflowLogs={displayLogs} />
          </div>
        )}

      </div>
    </div>
  );
};

export default ResultView;
