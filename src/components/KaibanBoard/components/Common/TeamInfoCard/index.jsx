/* eslint-disable react/prop-types */
import React from 'react';
import { BuildingOfficeIcon, CogIcon, ClockIcon, UserGroupIcon, Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const TeamInfoCard = ({ teamStore }) => {
  if (!teamStore) return null;

  const teamState = teamStore.getState();
  
  // Get orchestration-related data from team state
  const orchestrationEnabled = teamState.enableOrchestration || false;
  const orchestrationMode = teamState.mode || 'adaptive';
  const continuousOrchestration = teamState.continuousOrchestration || false;
  const maxActiveTasks = teamState.maxActiveTasks || 5;
  const taskPrioritization = teamState.taskPrioritization || 'dynamic';
  const workloadDistribution = teamState.workloadDistribution || 'balanced';

  const getModeColor = (mode) => {
    switch (mode) {
      case 'conservative':
        return 'kb-text-blue-400 kb-bg-blue-400/10 kb-border-blue-400/20';
      case 'adaptive':
        return 'kb-text-green-400 kb-bg-green-400/10 kb-border-green-400/20';
      case 'innovative':
        return 'kb-text-purple-400 kb-bg-purple-400/10 kb-border-purple-400/20';
      case 'learning':
        return 'kb-text-orange-400 kb-bg-orange-400/10 kb-border-orange-400/20';
      default:
        return 'kb-text-slate-400 kb-bg-slate-400/10 kb-border-slate-400/20';
    }
  };

  return (
    <div className="kb-bg-slate-900 kb-rounded-lg kb-border kb-border-slate-700 kb-p-4">
      {/* Team Header */}
      <div className="kb-flex kb-items-center kb-gap-3 kb-mb-4">
        <div className="kb-flex kb-items-center kb-gap-2">
          <BuildingOfficeIcon className="kb-w-5 kb-h-5 kb-text-indigo-400" />
          <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200">
            {teamState.name || 'Unnamed Team'}
          </h3>
        </div>
      </div>

      {/* Team Stats */}
      <div className="kb-grid kb-grid-cols-2 kb-gap-4 kb-mb-4">
        <div className="kb-flex kb-items-center kb-gap-2">
          <UserGroupIcon className="kb-w-4 kb-h-4 kb-text-slate-400" />
          <span className="kb-text-sm kb-text-slate-300">
            {teamState.agents?.length || 0} Agents
          </span>
        </div>
        <div className="kb-flex kb-items-center kb-gap-2">
          <Square3Stack3DIcon className="kb-w-4 kb-h-4 kb-text-slate-400" />
          <span className="kb-text-sm kb-text-slate-300">
            {teamState.tasks?.length || 0} Tasks
          </span>
        </div>
      </div>

      {/* Orchestration Status */}
      <div className="kb-border-t kb-border-slate-700 kb-pt-4">
        <div className="kb-flex kb-items-center kb-gap-2 kb-mb-3">
          <CogIcon className="kb-w-4 kb-h-4 kb-text-slate-400" />
          <span className="kb-text-sm kb-font-medium kb-text-slate-300">Orchestration</span>
        </div>

        <div className="kb-space-y-3">
          {/* Orchestration Enabled */}
          <div className="kb-flex kb-items-center kb-justify-between">
            <span className="kb-text-xs kb-text-slate-400">Status</span>
            <div className="kb-flex kb-items-center kb-gap-2">
              {orchestrationEnabled ? (
                <CheckCircleIcon className="kb-w-4 kb-h-4 kb-text-green-400" />
              ) : (
                <XCircleIcon className="kb-w-4 kb-h-4 kb-text-red-400" />
              )}
              <span className="kb-text-xs kb-text-slate-300">
                {orchestrationEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          {orchestrationEnabled && (
            <>
              {/* Orchestration Mode */}
              <div className="kb-flex kb-items-center kb-justify-between">
                <span className="kb-text-xs kb-text-slate-400">Mode</span>
                <span className={`kb-inline-flex kb-items-center kb-px-2 kb-py-1 kb-rounded-full kb-text-xs kb-font-medium kb-border ${getModeColor(orchestrationMode)}`}>
                  {orchestrationMode}
                </span>
              </div>

              {/* Continuous Orchestration */}
              <div className="kb-flex kb-items-center kb-justify-between">
                <span className="kb-text-xs kb-text-slate-400">Continuous</span>
                <div className="kb-flex kb-items-center kb-gap-2">
                  {continuousOrchestration ? (
                    <CheckCircleIcon className="kb-w-3 kb-h-3 kb-text-green-400" />
                  ) : (
                    <XCircleIcon className="kb-w-3 kb-h-3 kb-text-slate-500" />
                  )}
                  <span className="kb-text-xs kb-text-slate-300">
                    {continuousOrchestration ? 'Yes' : 'Initial Only'}
                  </span>
                </div>
              </div>

              {/* Max Active Tasks */}
              <div className="kb-flex kb-items-center kb-justify-between">
                <span className="kb-text-xs kb-text-slate-400">Max Active</span>
                <span className="kb-text-xs kb-text-slate-300">{maxActiveTasks} tasks</span>
              </div>

              {/* Task Prioritization */}
              <div className="kb-flex kb-items-center kb-justify-between">
                <span className="kb-text-xs kb-text-slate-400">Prioritization</span>
                <span className="kb-text-xs kb-text-slate-300 kb-capitalize">{taskPrioritization}</span>
              </div>

              {/* Workload Distribution */}
              <div className="kb-flex kb-items-center kb-justify-between">
                <span className="kb-text-xs kb-text-slate-400">Distribution</span>
                <span className="kb-text-xs kb-text-slate-300 kb-capitalize">{workloadDistribution}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Team Workflow Status */}
      <div className="kb-border-t kb-border-slate-700 kb-pt-4 kb-mt-4">
        <div className="kb-flex kb-items-center kb-justify-between">
          <span className="kb-text-xs kb-text-slate-400">Workflow Status</span>
          <span className="kb-text-xs kb-text-slate-300 kb-capitalize">
            {teamState.teamWorkflowStatus || 'Not Started'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeamInfoCard;