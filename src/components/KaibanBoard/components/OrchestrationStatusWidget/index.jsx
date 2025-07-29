/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Button } from '@headlessui/react';
import { 
  CpuChipIcon, 
  SparklesIcon, 
  PauseCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { 
  getOrchestrationEvents,
  getOrchestrationStatus, 
  getOrchestrationMetrics,
  getRecentActivity,
  formatOrchestrationMode,
  getOrchestrationConfig
} from '../../utils/orchestrationHelper';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';

const OrchestrationStatusWidget = () => {
  const useAgentsPlaygroundStore = usePlaygroundStore();
  const [orchestrationEvents, setOrchestrationEvents] = useState([]);
  const [orchestrationStatus, setOrchestrationStatus] = useState({});
  const [orchestrationMetrics, setOrchestrationMetrics] = useState({});

  const { teamStore } = useAgentsPlaygroundStore(state => ({
    teamStore: state.teamStore,
  }));

  const { workflowLogs } = teamStore(state => ({
    workflowLogs: state.workflowLogs || [],
  }));

  // Update orchestration data when logs change
  useEffect(() => {
    const events = getOrchestrationEvents(workflowLogs);
    const status = getOrchestrationStatus(events);
    const metrics = getOrchestrationMetrics(events);
    
    setOrchestrationEvents(events);
    setOrchestrationStatus(status);
    setOrchestrationMetrics(metrics);
  }, [workflowLogs]);

  // Check if orchestration is configured
  const orchestrationConfig = getOrchestrationConfig(teamStore);
  const isOrchestrationEnabled = orchestrationConfig?.enableOrchestration;

  // Don't show widget if orchestration is not enabled
  if (!isOrchestrationEnabled) {
    return null;
  }

  const getStatusIcon = () => {
    if (!orchestrationStatus.isActive) {
      return <PauseCircleIcon className="kb-w-5 kb-h-5" />;
    }
    
    switch (orchestrationStatus.status) {
      case 'error':
        return <ExclamationTriangleIcon className="kb-w-5 kb-h-5" />;
      case 'active':
      case 'analyzing':
      case 'selecting':
      case 'adapting':
      case 'generating':
      case 'optimizing':
        return <SparklesIcon className="kb-w-5 kb-h-5" />;
      case 'completed':
        return <CpuChipIcon className="kb-w-5 kb-h-5" />;
      default:
        return <CpuChipIcon className="kb-w-5 kb-h-5" />;
    }
  };

  const getStatusColor = () => {
    if (!orchestrationStatus.isActive) {
      return 'kb-text-slate-400';
    }
    
    switch (orchestrationStatus.status) {
      case 'error':
        return 'kb-text-red-400';
      case 'active':
      case 'analyzing':
      case 'selecting':
      case 'adapting':
      case 'generating':
      case 'optimizing':
        return 'kb-text-indigo-400';
      case 'completed':
        return 'kb-text-green-400';
      default:
        return 'kb-text-indigo-400';
    }
  };

  const getStatusText = () => {
    if (!orchestrationStatus.isActive) {
      return 'Inactive';
    }
    
    switch (orchestrationStatus.status) {
      case 'analyzing':
        return 'Analyzing...';
      case 'selecting':
        return 'Selecting Tasks...';
      case 'adapting':
        return 'Adapting Tasks...';
      case 'generating':
        return 'Generating Tasks...';
      case 'optimizing':
        return 'Optimizing...';
      case 'error':
        return 'Error';
      case 'completed':
        return 'Completed';
      default:
        return 'Active';
    }
  };

  const getBadgeColor = () => {
    if (!orchestrationStatus.isActive) {
      return 'kb-bg-slate-600';
    }
    
    switch (orchestrationStatus.status) {
      case 'error':
        return 'kb-bg-red-500';
      case 'active':
      case 'analyzing':
      case 'selecting':
      case 'adapting':
      case 'generating':
      case 'optimizing':
        return 'kb-bg-indigo-500';
      case 'completed':
        return 'kb-bg-green-500';
      default:
        return 'kb-bg-indigo-500';
    }
  };

  return (
    <>
      <div className="kb-relative kb-group kb-flex kb-items-center">
        <div className="kb-inline-flex kb-items-center kb-gap-2 kb-rounded-lg kb-bg-slate-900 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium">
          <div className={`kb-flex kb-items-center kb-gap-2 ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="kb-hidden md:kb-block">Orchestration</span>
            <span className="kb-block md:kb-hidden">AI</span>
          </div>
          
          {/* Status Badge */}
          <div className={`kb-inline-flex kb-items-center kb-gap-1 kb-px-2 kb-py-0.5 kb-rounded-full kb-text-xs kb-text-white ${getBadgeColor()}`}>
            {orchestrationStatus.mode && (
              <span className="kb-hidden sm:kb-inline">
                {formatOrchestrationMode(orchestrationStatus.mode)}
              </span>
            )}
            <span className="kb-inline sm:kb-hidden">
              {getStatusText()}
            </span>
          </div>

          {/* Metrics Preview */}
          {orchestrationStatus.isActive && Object.values(orchestrationMetrics).some(v => v > 0) && (
            <div className="kb-hidden lg:kb-flex kb-items-center kb-gap-2 kb-text-xs kb-text-slate-400">
              {orchestrationMetrics.tasksSelected > 0 && (
                <span>✅ {orchestrationMetrics.tasksSelected}</span>
              )}
              {orchestrationMetrics.tasksAdapted > 0 && (
                <span>🔄 {orchestrationMetrics.tasksAdapted}</span>
              )}
              {orchestrationMetrics.tasksGenerated > 0 && (
                <span>🤖 {orchestrationMetrics.tasksGenerated}</span>
              )}
            </div>
          )}
        </div>

        {/* Tooltip */}
        <div className="kb-absolute kb-bottom-full kb-left-1/2 kb-transform kb--translate-x-1/2 kb-mb-2 kb-px-2 kb-py-1 kb-bg-slate-800 kb-text-white kb-text-xs kb-rounded kb-opacity-0 kb-pointer-events-none group-hover:kb-opacity-100 kb-transition-opacity kb-whitespace-nowrap">
          {orchestrationStatus.isActive ? (
            <div className="kb-space-y-1">
              <div>Status: {getStatusText()}</div>
              {orchestrationStatus.mode && (
                <div>Mode: {formatOrchestrationMode(orchestrationStatus.mode)}</div>
              )}
              {orchestrationStatus.continuousMode && (
                <div>Continuous: Enabled</div>
              )}
            </div>
          ) : (
            'Orchestration Inactive'
          )}
        </div>
      </div>
    </>
  );
};

export default OrchestrationStatusWidget;