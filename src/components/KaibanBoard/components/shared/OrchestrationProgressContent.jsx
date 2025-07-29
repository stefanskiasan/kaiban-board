/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDownIcon, ChevronUpIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { 
  getOrchestrationEvents, 
  getOrchestrationStatus, 
  getErrorType, 
  getAffectedComponent,
  isOrchestrationActive 
} from '../../utils/orchestrationHelper';

const OrchestrationProgressContent = ({ workflowLogs = [], compact = false }) => {
  // Validate props
  if (!Array.isArray(workflowLogs)) {
    console.warn('OrchestrationProgressContent: workflowLogs should be an array, received:', typeof workflowLogs);
    workflowLogs = []; // Fallback to empty array
  }
  if (typeof compact !== 'boolean') {
    console.warn('OrchestrationProgressContent: compact should be a boolean, received:', typeof compact);
  }
  const [selectedErrorLevel, setSelectedErrorLevel] = useState('all');
  const [selectedLogLevel, setSelectedLogLevel] = useState('all');
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const logStreamRef = useRef(null);

  // Process orchestration data with error handling
  const orchestrationData = useMemo(() => {
    try {
      const orchestrationEvents = getOrchestrationEvents(workflowLogs) || [];
      const statusObject = getOrchestrationStatus(orchestrationEvents) || {};
      const currentStatus = statusObject?.status || 'IDLE';
    
    // Calculate statistics
    const stats = {
      totalEvents: orchestrationEvents.length,
      taskSelections: orchestrationEvents.filter(e => e.orchestrationEvent === 'TASK_SELECTION').length,
      taskAdaptations: orchestrationEvents.filter(e => e.orchestrationEvent === 'TASK_ADAPTATION').length,
      taskGenerations: orchestrationEvents.filter(e => e.orchestrationEvent === 'TASK_GENERATION').length,
      currentPhase: currentStatus
    };

    // Get errors from logs
    const errors = workflowLogs.filter(log => {
      if (!log || typeof log !== 'object') return false;
      const errorType = getErrorType(log);
      return errorType && !['unknown', 'orchestrationEvent'].includes(errorType);
    });

    // Get critical errors
    const criticalErrors = errors.filter(error => {
      const severity = error.severity || 'medium';
      return ['critical', 'high'].includes(severity.toLowerCase());
    });

      return {
        orchestrationEvents,
        statusObject,
        currentStatus,
        stats,
        errors,
        criticalErrors,
        isActive: isOrchestrationActive(orchestrationEvents)
      };
    } catch (error) {
      console.error('Error processing orchestration data:', error);
      // Return safe default values
      return {
        orchestrationEvents: [],
        statusObject: { status: 'ERROR', isActive: false },
        currentStatus: 'ERROR',
        stats: { totalEvents: 0, taskSelections: 0, taskAdaptations: 0, taskGenerations: 0 },
        errors: [],
        criticalErrors: [],
        isActive: false
      };
    }
  }, [workflowLogs]);

  // Auto-scroll to bottom when new logs arrive (debounce for performance)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (logStreamRef.current) {
        logStreamRef.current.scrollTop = logStreamRef.current.scrollHeight;
      }
    }, 100); // Small delay to avoid excessive scrolling

    return () => clearTimeout(timeoutId);
  }, [workflowLogs.length]); // Only trigger on length change, not content change

  // Filter logs based on selected level
  const filteredLogs = useMemo(() => {
    if (selectedLogLevel === 'all') return workflowLogs;
    if (selectedLogLevel === 'orchestration') {
      return workflowLogs.filter(log => log.logType === 'OrchestrationStatusUpdate');
    }
    if (selectedLogLevel === 'errors') {
      return orchestrationData.errors;
    }
    return workflowLogs.filter(log => log.logType === selectedLogLevel);
  }, [workflowLogs, selectedLogLevel, orchestrationData.errors]);

  // Filter errors based on selected level
  const filteredErrors = useMemo(() => {
    if (selectedErrorLevel === 'all') return orchestrationData.errors;
    return orchestrationData.errors.filter(error => {
      const severity = error.severity || 'medium';
      return severity.toLowerCase() === selectedErrorLevel;
    });
  }, [orchestrationData.errors, selectedErrorLevel]);

  const getPhaseProgress = (phase, events) => {
    // Validate inputs
    if (!Array.isArray(events) || events.length === 0) return 0;
    if (!phase) return 0;

    // Check which events have actually occurred
    const hasActivated = events.some(e => e?.orchestrationEvent === 'ACTIVATED');
    const hasTaskSelection = events.some(e => e?.orchestrationEvent === 'TASK_SELECTION');
    const hasTaskAdaptation = events.some(e => e?.orchestrationEvent === 'TASK_ADAPTATION');
    const hasTaskGeneration = events.some(e => e?.orchestrationEvent === 'TASK_GENERATION');
    const hasCompleted = events.some(e => e?.orchestrationEvent === 'COMPLETED');
    const hasError = events.some(e => e?.orchestrationEvent === 'ERROR');

    // If there's an error, show progress based on how far we got
    if (hasError) {
      if (hasTaskGeneration) return 80;
      if (hasTaskAdaptation) return 60;
      if (hasTaskSelection) return 40;
      if (hasActivated) return 20;
      return 0;
    }

    // Calculate progress based on actual events that occurred and current phase
    if (hasCompleted) return 100;
    
    // If we're in the task generation phase and it has occurred
    if (phase === 'TASK_GENERATION' && hasTaskGeneration) return 90;
    if (hasTaskGeneration) return 80;
    
    // If we're in the task adaptation phase and it has occurred
    if (phase === 'TASK_ADAPTATION' && hasTaskAdaptation) return 70;
    if (hasTaskAdaptation) return 60;
    
    // If we're in the task selection phase and it has occurred
    if (phase === 'TASK_SELECTION' && hasTaskSelection) return 50;
    if (hasTaskSelection) return 40;
    
    // If we're activated and in the activated phase
    if (phase === 'ACTIVATED' && hasActivated) return 30;
    if (hasActivated) return 20;
    
    // If no events yet, show 0%
    return 0;
  };

  const getPhaseDisplayName = (phase) => {
    const phaseNames = {
      'IDLE': 'Idle',
      'ACTIVATED': 'Activated',
      'TASK_SELECTION': 'Task Selection',
      'TASK_ADAPTATION': 'Task Adaptation', 
      'TASK_GENERATION': 'Task Generation',
      'COMPLETED': 'Completed',
      'ERROR': 'Error'
    };
    return phaseNames[phase] || phase;
  };

  const getLogIcon = (log) => {
    const errorType = getErrorType(log);
    if (errorType && !['unknown', 'orchestrationEvent'].includes(errorType)) {
      return '🚨';
    }
    
    if (log.logType === 'OrchestrationStatusUpdate') {
      const event = log.orchestrationEvent;
      if (event === 'ACTIVATED') return '🚀';
      if (event === 'TASK_SELECTION') return '🎯';
      if (event === 'TASK_ADAPTATION') return '🔄';
      if (event === 'TASK_GENERATION') return '⚡';
      if (event === 'COMPLETED') return '✅';
      return '🤖';
    }
    
    if (log.logType === 'AgentStatusUpdate') return '👤';
    if (log.logType === 'TaskStatusUpdate') return '📋';
    if (log.logType === 'WorkflowStatusUpdate') return '🔄';
    return 'ℹ️';
  };

  const formatLogMessage = (log) => {
    try {
      if (!log || typeof log !== 'object') return 'Invalid log entry';
      
      if (log.orchestrationEvent) {
        const eventName = log.orchestrationEvent.replace(/_/g, ' ');
        const message = log.message || 'Event triggered';
        return `${eventName} - ${message}`;
      }
      return log.message || 'Log entry';
    } catch (error) {
      console.error('Error formatting log message:', error);
      return 'Error formatting log';
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      if (!timestamp) return '';
      if (typeof timestamp !== 'number' && typeof timestamp !== 'string') return '';
      
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      
      return date.toLocaleTimeString();
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'kb-text-red-400 kb-bg-red-500/10 kb-border-red-500/20';
      case 'high': return 'kb-text-orange-400 kb-bg-orange-500/10 kb-border-orange-500/20';
      case 'medium': return 'kb-text-yellow-400 kb-bg-yellow-500/10 kb-border-yellow-500/20';
      case 'low': return 'kb-text-blue-400 kb-bg-blue-500/10 kb-border-blue-500/20';
      default: return 'kb-text-slate-400 kb-bg-slate-500/10 kb-border-slate-500/20';
    }
  };

  if (compact) {
    // Compact view for results tab
    return (
      <div className="kb-space-y-4">
        {/* Critical Errors Alert */}
        {orchestrationData.criticalErrors.length > 0 && (
          <div className="kb-bg-red-500/10 kb-border kb-border-red-500/20 kb-rounded-lg kb-p-4">
            <div className="kb-flex kb-items-center kb-gap-2 kb-text-red-400">
              <ExclamationTriangleIcon className="kb-w-5 kb-h-5" />
              <span className="kb-font-medium">
                {orchestrationData.criticalErrors.length} Critical Error{orchestrationData.criticalErrors.length !== 1 ? 's' : ''} Detected
              </span>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="kb-grid kb-grid-cols-2 md:kb-grid-cols-4 kb-gap-4">
          <div className="kb-bg-slate-800 kb-rounded-lg kb-p-4">
            <div className="kb-text-2xl kb-font-bold kb-text-indigo-400">{orchestrationData.stats.totalEvents}</div>
            <div className="kb-text-sm kb-text-slate-400">Total Events</div>
          </div>
          <div className="kb-bg-slate-800 kb-rounded-lg kb-p-4">
            <div className="kb-text-2xl kb-font-bold kb-text-green-400">{orchestrationData.stats.taskSelections}</div>
            <div className="kb-text-sm kb-text-slate-400">Task Selections</div>
          </div>
          <div className="kb-bg-slate-800 kb-rounded-lg kb-p-4">
            <div className="kb-text-2xl kb-font-bold kb-text-blue-400">{orchestrationData.stats.taskAdaptations}</div>
            <div className="kb-text-sm kb-text-slate-400">Adaptations</div>
          </div>
          <div className="kb-bg-slate-800 kb-rounded-lg kb-p-4">
            <div className="kb-text-2xl kb-font-bold kb-text-purple-400">{orchestrationData.stats.taskGenerations}</div>
            <div className="kb-text-sm kb-text-slate-400">Generations</div>
          </div>
        </div>

        {/* Errors Summary */}
        {orchestrationData.errors.length > 0 && (
          <div className="kb-bg-slate-800 kb-rounded-lg kb-p-4">
            <h3 className="kb-text-lg kb-font-medium kb-text-white kb-mb-3">Error Summary</h3>
            <div className="kb-space-y-2">
              {orchestrationData.errors.slice(0, 3).map((error, index) => (
                <div key={index} className={`kb-p-3 kb-rounded-lg kb-border ${getSeverityColor(error.severity)}`}>
                  <div className="kb-flex kb-items-start kb-justify-between">
                    <div className="kb-flex-1">
                      <div className="kb-text-sm kb-font-medium">{error.message || 'Error occurred'}</div>
                      <div className="kb-text-xs kb-opacity-75 kb-mt-1">
                        {getAffectedComponent(error)} • {error.severity || 'medium'} severity
                      </div>
                    </div>
                    <div className="kb-text-xs kb-opacity-75">{formatTimestamp(error.timestamp)}</div>
                  </div>
                </div>
              ))}
              {orchestrationData.errors.length > 3 && (
                <div className="kb-text-sm kb-text-slate-400 kb-text-center kb-py-2">
                  +{orchestrationData.errors.length - 3} more errors
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="kb-bg-slate-800 kb-rounded-lg kb-p-4">
          <h3 className="kb-text-lg kb-font-medium kb-text-white kb-mb-3">Recent Activity</h3>
          <div className="kb-space-y-2 kb-max-h-64 kb-overflow-y-auto">
            {filteredLogs.slice(-10).map((log, index) => (
              <div key={index} className="kb-flex kb-items-start kb-gap-3 kb-text-sm">
                <span className="kb-text-lg kb-mt-0.5">{getLogIcon(log)}</span>
                <div className="kb-flex-1 kb-min-w-0">
                  <div className="kb-text-white kb-truncate">{formatLogMessage(log)}</div>
                  <div className="kb-text-xs kb-text-slate-400">{formatTimestamp(log.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full view for modal dialog
  return (
    <div className="kb-flex kb-h-full kb-gap-6">
      {/* Main Content */}
      <div className="kb-flex-1 kb-flex kb-flex-col kb-space-y-6">
        {/* Critical Errors Alert */}
        {orchestrationData.criticalErrors.length > 0 && (
          <div className="kb-bg-red-500/10 kb-border kb-border-red-500/20 kb-rounded-lg kb-p-4">
            <div className="kb-flex kb-items-center kb-justify-between">
              <div className="kb-flex kb-items-center kb-gap-2 kb-text-red-400">
                <ExclamationTriangleIcon className="kb-w-5 kb-h-5" />
                <span className="kb-font-medium">
                  {orchestrationData.criticalErrors.length} Critical Error{orchestrationData.criticalErrors.length !== 1 ? 's' : ''} Detected
                </span>
              </div>
              <button
                onClick={() => setIsPanelExpanded(!isPanelExpanded)}
                className="kb-text-red-400 hover:kb-text-red-300"
              >
                {isPanelExpanded ? (
                  <ChevronUpIcon className="kb-w-4 kb-h-4" />
                ) : (
                  <ChevronDownIcon className="kb-w-4 kb-h-4" />
                )}
              </button>
            </div>
            {isPanelExpanded && (
              <div className="kb-mt-3 kb-space-y-2">
                {orchestrationData.criticalErrors.slice(0, 3).map((error, index) => (
                  <div key={index} className="kb-text-sm kb-text-red-300">
                    • {error.message || 'Critical error occurred'} ({getAffectedComponent(error)})
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Current Status */}
        <div className="kb-bg-slate-800 kb-rounded-lg kb-p-4">
          <div className="kb-flex kb-items-center kb-justify-between kb-mb-4">
            <h3 className="kb-text-lg kb-font-medium kb-text-white">Current Status</h3>
            <div className={`kb-px-3 kb-py-1 kb-rounded-full kb-text-sm kb-font-medium ${
              orchestrationData.isActive ? 'kb-bg-green-500/20 kb-text-green-400' : 'kb-bg-slate-600/50 kb-text-slate-400'
            }`}>
              {orchestrationData.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>

          <div className="kb-space-y-3">
            <div>
              <div className="kb-flex kb-justify-between kb-text-sm kb-mb-1">
                <span className="kb-text-slate-400">Phase: {getPhaseDisplayName(orchestrationData.currentStatus)}</span>
                <span className="kb-text-slate-400">{getPhaseProgress(orchestrationData.currentStatus, orchestrationData.orchestrationEvents)}%</span>
              </div>
              <div className="kb-w-full kb-bg-slate-700 kb-rounded-full kb-h-2">
                <div 
                  className="kb-bg-indigo-500 kb-h-2 kb-rounded-full kb-transition-all kb-duration-300"
                  style={{ width: `${getPhaseProgress(orchestrationData.currentStatus, orchestrationData.orchestrationEvents)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="kb-bg-slate-800 kb-rounded-lg kb-p-4">
          <h3 className="kb-text-lg kb-font-medium kb-text-white kb-mb-4">Statistics</h3>
          <div className="kb-grid kb-grid-cols-2 kb-gap-4">
            <div>
              <div className="kb-text-2xl kb-font-bold kb-text-indigo-400">{orchestrationData.stats.totalEvents}</div>
              <div className="kb-text-sm kb-text-slate-400">Total Events</div>
            </div>
            <div>
              <div className="kb-text-2xl kb-font-bold kb-text-green-400">{orchestrationData.stats.taskSelections}</div>
              <div className="kb-text-sm kb-text-slate-400">Task Selections</div>
            </div>
            <div>
              <div className="kb-text-2xl kb-font-bold kb-text-blue-400">{orchestrationData.stats.taskAdaptations}</div>
              <div className="kb-text-sm kb-text-slate-400">Adaptations</div>
            </div>
            <div>
              <div className="kb-text-2xl kb-font-bold kb-text-purple-400">{orchestrationData.stats.taskGenerations}</div>
              <div className="kb-text-sm kb-text-slate-400">Generations</div>
            </div>
          </div>
        </div>

        {/* Live Event Stream */}
        <div className="kb-bg-slate-800 kb-rounded-lg kb-p-4 kb-flex-1 kb-flex kb-flex-col">
          <div className="kb-flex kb-items-center kb-justify-between kb-mb-4">
            <h3 className="kb-text-lg kb-font-medium kb-text-white">Live Event Stream</h3>
            <select 
              value={selectedLogLevel}
              onChange={(e) => setSelectedLogLevel(e.target.value)}
              className="kb-bg-slate-700 kb-text-white kb-border kb-border-slate-600 kb-rounded kb-px-2 kb-py-1 kb-text-sm"
            >
              <option value="all">All Events</option>
              <option value="orchestration">Orchestration Only</option>
              <option value="errors">Errors Only</option>
            </select>
          </div>
          
          <div 
            ref={logStreamRef}
            className="kb-flex-1 kb-overflow-y-auto kb-space-y-2 kb-max-h-64"
          >
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <div key={index} className="kb-flex kb-items-start kb-gap-3 kb-text-sm">
                  <span className="kb-text-lg kb-mt-0.5">{getLogIcon(log)}</span>
                  <div className="kb-flex-1 kb-min-w-0">
                    <div className="kb-text-white kb-truncate">{formatLogMessage(log)}</div>
                    <div className="kb-text-xs kb-text-slate-400">{formatTimestamp(log.timestamp)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="kb-flex kb-items-center kb-justify-center kb-h-32 kb-text-slate-400">
                <div className="kb-text-center">
                  <InformationCircleIcon className="kb-w-8 kb-h-8 kb-mx-auto kb-mb-2 kb-opacity-50" />
                  <div>No events yet</div>
                  <div className="kb-text-xs kb-mt-1">Events will appear here when orchestration is active</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Errors Sidebar */}
      {orchestrationData.errors.length > 0 && (
        <div className="kb-w-80 kb-bg-slate-800 kb-rounded-lg kb-p-4">
          <div className="kb-flex kb-items-center kb-justify-between kb-mb-4">
            <h3 className="kb-text-lg kb-font-medium kb-text-white">Errors</h3>
            <select 
              value={selectedErrorLevel}
              onChange={(e) => setSelectedErrorLevel(e.target.value)}
              className="kb-bg-slate-700 kb-text-white kb-border kb-border-slate-600 kb-rounded kb-px-2 kb-py-1 kb-text-sm"
            >
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div className="kb-space-y-3 kb-max-h-96 kb-overflow-y-auto">
            {filteredErrors.map((error, index) => (
              <div key={index} className={`kb-p-3 kb-rounded-lg kb-border ${getSeverityColor(error.severity)}`}>
                <div className="kb-flex kb-items-start kb-justify-between kb-mb-2">
                  <div className="kb-text-sm kb-font-medium">{error.message || 'Error occurred'}</div>
                  <div className="kb-text-xs kb-opacity-75">{formatTimestamp(error.timestamp)}</div>
                </div>
                <div className="kb-text-xs kb-opacity-75">
                  <div>Component: {getAffectedComponent(error)}</div>
                  <div>Type: {getErrorType(error)}</div>
                  <div>Severity: {error.severity || 'medium'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrchestrationProgressContent;