import React, { useState } from 'react';

const TaskJourneyTab = ({ taskFlows, workflowLogs = [] }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState('flows'); // 'flows' or 'individual'

  // If no task flow data, show empty state
  if (!taskFlows || !taskFlows.taskJourneys || Object.keys(taskFlows.taskJourneys).length === 0) {
    return (
      <div className="kb-p-6 kb-h-full kb-flex kb-items-center kb-justify-center">
        <div className="kb-text-center">
          <div className="kb-w-16 kb-h-16 kb-bg-slate-800 kb-rounded-full kb-flex kb-items-center kb-justify-center kb-mx-auto kb-mb-4">
            <span className="kb-text-2xl">🎯</span>
          </div>
          <h3 className="kb-text-lg kb-font-medium kb-text-slate-200 kb-mb-2">No Task Data</h3>
          <p className="kb-text-slate-400">
            No task journey information found in the logs.
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'kb-bg-green-100 kb-text-green-800 kb-border-green-200';
      case 'running':
      case 'doing':
        return 'kb-bg-blue-100 kb-text-blue-800 kb-border-blue-200';
      case 'todo':
      case 'pending':
        return 'kb-bg-gray-100 kb-text-gray-800 kb-border-gray-200';
      case 'blocked':
        return 'kb-bg-red-100 kb-text-red-800 kb-border-red-200';
      case 'error':
        return 'kb-bg-red-100 kb-text-red-800 kb-border-red-200';
      case 'awaiting_validation':
        return 'kb-bg-yellow-100 kb-text-yellow-800 kb-border-yellow-200';
      default:
        return 'kb-bg-gray-100 kb-text-gray-800 kb-border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '✅';
      case 'running':
      case 'doing':
        return '🔄';
      case 'todo':
      case 'pending':
        return '📋';
      case 'blocked':
        return '🚧';
      case 'error':
        return '❌';
      case 'awaiting_validation':
        return '⏳';
      default:
        return '📝';
    }
  };

  const formatDuration = (ms) => {
    if (!ms || ms < 1000) return '<1s';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="kb-h-full kb-flex kb-flex-col">
      
      {/* Header with View Mode Toggle */}
      <div className="kb-p-6 kb-border-b kb-border-slate-700">
        <div className="kb-flex kb-items-center kb-justify-between">
          <div>
            <h2 className="kb-text-xl kb-font-semibold kb-text-slate-200">Task Journey Analysis</h2>
            <p className="kb-text-sm kb-text-slate-400 kb-mt-1">
              Track task progression and identify bottlenecks
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="kb-flex kb-bg-slate-700 kb-rounded-lg kb-p-1">
            <button
              onClick={() => setViewMode('flows')}
              className={`kb-px-4 kb-py-2 kb-text-sm kb-font-medium kb-rounded-md kb-transition-colors ${
                viewMode === 'flows'
                  ? 'kb-bg-slate-600 kb-text-slate-200 kb-shadow-sm'
                  : 'kb-text-slate-400 hover:kb-text-slate-200'
              }`}
            >
              📊 Flow Analysis
            </button>
            <button
              onClick={() => setViewMode('individual')}
              className={`kb-px-4 kb-py-2 kb-text-sm kb-font-medium kb-rounded-md kb-transition-colors ${
                viewMode === 'individual'
                  ? 'kb-bg-slate-600 kb-text-slate-200 kb-shadow-sm'
                  : 'kb-text-slate-400 hover:kb-text-slate-200'
              }`}
            >
              🎯 Individual Tasks
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="kb-grid kb-grid-cols-2 md:kb-grid-cols-4 kb-gap-4 kb-mt-6">
          <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
            <div className="kb-flex kb-items-center">
              <div className="kb-flex-shrink-0">
                <div className="kb-w-8 kb-h-8 kb-bg-blue-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                  <span className="kb-text-white kb-text-sm">📊</span>
                </div>
              </div>
              <div className="kb-ml-4">
                <div className="kb-text-sm kb-font-medium kb-text-slate-400">Total Tasks</div>
                <div className="kb-text-2xl kb-font-semibold kb-text-slate-200">
                  {Object.keys(taskFlows.taskJourneys).length}
                </div>
              </div>
            </div>
          </div>
          
          <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
            <div className="kb-flex kb-items-center">
              <div className="kb-flex-shrink-0">
                <div className="kb-w-8 kb-h-8 kb-bg-green-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                  <span className="kb-text-white kb-text-sm">✅</span>
                </div>
              </div>
              <div className="kb-ml-4">
                <div className="kb-text-sm kb-font-medium kb-text-slate-400">Completed</div>
                <div className="kb-text-2xl kb-font-semibold kb-text-slate-200">
                  {Object.values(taskFlows.taskJourneys).filter(journey => 
                    journey.statusTransitions?.some(t => t.toStatus === 'COMPLETED')
                  ).length}
                </div>
              </div>
            </div>
          </div>

          <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
            <div className="kb-flex kb-items-center">
              <div className="kb-flex-shrink-0">
                <div className="kb-w-8 kb-h-8 kb-bg-purple-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                  <span className="kb-text-white kb-text-sm">⏱️</span>
                </div>
              </div>
              <div className="kb-ml-4">
                <div className="kb-text-sm kb-font-medium kb-text-slate-400">Avg Duration</div>
                <div className="kb-text-2xl kb-font-semibold kb-text-slate-200">
                  {taskFlows.averageTaskDuration 
                    ? formatDuration(taskFlows.averageTaskDuration)
                    : 'N/A'
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
            <div className="kb-flex kb-items-center">
              <div className="kb-flex-shrink-0">
                <div className="kb-w-8 kb-h-8 kb-bg-orange-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                  <span className="kb-text-white kb-text-sm">🚧</span>
                </div>
              </div>
              <div className="kb-ml-4">
                <div className="kb-text-sm kb-font-medium kb-text-slate-400">Blocked</div>
                <div className="kb-text-2xl kb-font-semibold kb-text-slate-200">
                  {taskFlows.blockageAnalysis?.blockedTasks?.length || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="kb-flex-1 kb-overflow-y-auto">
        {viewMode === 'flows' ? (
          <FlowAnalysisView 
            taskFlows={taskFlows} 
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
            formatDuration={formatDuration}
          />
        ) : (
          <IndividualTasksView 
            taskFlows={taskFlows} 
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            formatDuration={formatDuration}
          />
        )}
      </div>
    </div>
  );
};

// Flow Analysis View Component
const FlowAnalysisView = ({ taskFlows, getStatusColor, getStatusIcon, formatDuration }) => {
  return (
    <div className="kb-p-6 kb-overflow-y-auto kb-h-full">
      
      {/* Status Transition Flow */}
      <div className="kb-mb-8">
        <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Status Transition Flow</h3>
        
        {taskFlows.statusTransitions && Object.keys(taskFlows.statusTransitions).length > 0 ? (
          <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
            <div className="kb-space-y-4">
              {Object.entries(taskFlows.statusTransitions).map(([transition, data]) => {
                const [fromStatus, toStatus] = transition.split('->');
                return (
                  <div key={transition} className="kb-flex kb-items-center kb-justify-between">
                    <div className="kb-flex kb-items-center kb-space-x-4">
                      <span className={`kb-inline-flex kb-items-center kb-px-3 kb-py-1 kb-rounded-full kb-text-sm kb-font-medium kb-border ${getStatusColor(fromStatus)}`}>
                        {getStatusIcon(fromStatus)} {fromStatus}
                      </span>
                      <svg className="kb-w-5 kb-h-5 kb-text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className={`kb-inline-flex kb-items-center kb-px-3 kb-py-1 kb-rounded-full kb-text-sm kb-font-medium kb-border ${getStatusColor(toStatus)}`}>
                        {getStatusIcon(toStatus)} {toStatus}
                      </span>
                    </div>
                    <div className="kb-flex kb-items-center kb-space-x-3">
                      <span className="kb-text-sm kb-text-slate-400">{data.count} transitions</span>
                      <div className="kb-w-20 kb-bg-slate-700 kb-rounded-full kb-h-2">
                        <div 
                          className="kb-bg-blue-600 kb-h-2 kb-rounded-full" 
                          style={{ 
                            width: `${Math.min(100, (data.count / Math.max(...Object.values(taskFlows.statusTransitions).map(d => d.count))) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (  
          <div className="kb-bg-slate-700 kb-rounded-lg kb-p-8 kb-text-center">
            <p className="kb-text-slate-400">No status transition data available</p>
          </div>
        )}
      </div>

      {/* Bottleneck Analysis */}
      {taskFlows.blockageAnalysis && (
        <div className="kb-mb-8">
          <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Bottleneck Analysis</h3>
          
          {taskFlows.blockageAnalysis.blockedTasks && taskFlows.blockageAnalysis.blockedTasks.length > 0 ? (
            <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg">
              {taskFlows.blockageAnalysis.blockedTasks.map((blockedTask, index) => (
                <div key={index} className="kb-p-4 kb-border-b kb-border-slate-700 last:kb-border-b-0">
                  <div className="kb-flex kb-items-start kb-space-x-4">
                    <div className="kb-flex-shrink-0">
                      <div className="kb-w-8 kb-h-8 kb-bg-red-600/20 kb-rounded-full kb-flex kb-items-center kb-justify-center">
                        <span className="kb-text-red-400 kb-text-sm">🚧</span>
                      </div>
                    </div>
                    <div className="kb-flex-1">
                      <h4 className="kb-text-sm kb-font-medium kb-text-slate-200">
                        {blockedTask.taskId}
                      </h4>
                      <p className="kb-text-xs kb-text-slate-400 kb-mt-1">
                        Blocked for: {formatDuration(blockedTask.duration)}
                      </p>
                      {blockedTask.reason && (
                        <p className="kb-text-xs kb-text-red-400 kb-mt-1">
                          Reason: {blockedTask.reason}
                        </p>
                      )}
                    </div>
                    <div className="kb-text-right">
                      <span className="kb-text-xs kb-text-slate-400">
                        {new Date(blockedTask.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="kb-bg-green-600/20 kb-border kb-border-green-500/30 kb-rounded-lg kb-p-6">
              <div className="kb-flex kb-items-center kb-space-x-3">
                <span className="kb-text-green-400 kb-text-xl">✅</span>
                <div>
                  <p className="kb-text-sm kb-font-medium kb-text-green-400">No Bottlenecks Found</p>
                  <p className="kb-text-xs kb-text-green-300">Tasks are flowing smoothly through the workflow</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Performance Insights */}
      {taskFlows.performanceInsights && (
        <div>
          <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Performance Insights</h3>
          
          <div className="kb-grid kb-grid-cols-1 md:kb-grid-cols-2 kb-gap-6">
            
            {/* Fastest Tasks */}
            {taskFlows.performanceInsights.fastestTasks && taskFlows.performanceInsights.fastestTasks.length > 0 && (
              <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-4">
                <h4 className="kb-text-sm kb-font-medium kb-text-slate-200 kb-mb-3">⚡ Fastest Tasks</h4>
                <div className="kb-space-y-2">
                  {taskFlows.performanceInsights.fastestTasks.slice(0, 5).map((task, index) => (
                    <div key={index} className="kb-flex kb-justify-between kb-items-center">
                      <span className="kb-text-sm kb-text-slate-300 kb-truncate">{task.taskId}</span>
                      <span className="kb-text-sm kb-font-medium kb-text-green-400">
                        {formatDuration(task.duration)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Slowest Tasks */}
            {taskFlows.performanceInsights.slowestTasks && taskFlows.performanceInsights.slowestTasks.length > 0 && (
              <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-4">
                <h4 className="kb-text-sm kb-font-medium kb-text-slate-200 kb-mb-3">🐌 Slowest Tasks</h4>
                <div className="kb-space-y-2">
                  {taskFlows.performanceInsights.slowestTasks.slice(0, 5).map((task, index) => (
                    <div key={index} className="kb-flex kb-justify-between kb-items-center">
                      <span className="kb-text-sm kb-text-slate-300 kb-truncate">{task.taskId}</span>
                      <span className="kb-text-sm kb-font-medium kb-text-red-400">
                        {formatDuration(task.duration)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Individual Tasks View Component
const IndividualTasksView = ({ taskFlows, selectedTask, setSelectedTask, formatDuration }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'kb-bg-green-600/20 kb-text-green-400 kb-border-green-500/30';
      case 'running':
      case 'doing':
        return 'kb-bg-blue-600/20 kb-text-blue-400 kb-border-blue-500/30';
      case 'todo':
      case 'pending':
        return 'kb-bg-slate-600/20 kb-text-slate-400 kb-border-slate-500/30';
      case 'blocked':
        return 'kb-bg-red-600/20 kb-text-red-400 kb-border-red-500/30';
      case 'error':
        return 'kb-bg-red-600/20 kb-text-red-400 kb-border-red-500/30';
      case 'awaiting_validation':
        return 'kb-bg-yellow-600/20 kb-text-yellow-400 kb-border-yellow-500/30';
      default:
        return 'kb-bg-slate-600/20 kb-text-slate-400 kb-border-slate-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '✅';
      case 'running':
      case 'doing':
        return '🔄';
      case 'todo':
      case 'pending':
        return '📋';
      case 'blocked':
        return '🚧';
      case 'error':
        return '❌';
      case 'awaiting_validation':
        return '⏳';
      default:
        return '📝';
    }
  };

  return (
    <div className="kb-h-full kb-flex">
      
      {/* Left Panel: Task List */}
      <div className="kb-w-1/2 kb-border-r kb-border-slate-700 kb-overflow-y-auto kb-bg-slate-900">
        <div className="kb-p-6">
          <div className="kb-flex kb-items-center kb-space-x-3 kb-mb-6">
            <div className="kb-w-8 kb-h-8 kb-bg-blue-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
              <span className="kb-text-white kb-text-sm">📋</span>
            </div>
            <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200">Task List</h3>
          </div>
          
          <div className="kb-space-y-3">
            {Object.entries(taskFlows.taskJourneys).map(([taskId, journey]) => (
              <button
                key={taskId}
                onClick={() => setSelectedTask({ taskId, journey })}
                className={`kb-w-full kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-4 kb-text-left kb-transition-all kb-duration-200 ${
                  selectedTask?.taskId === taskId
                    ? 'kb-border-blue-500 kb-bg-blue-600/10 kb-shadow-lg'
                    : 'hover:kb-border-slate-600 hover:kb-bg-slate-700/50 hover:kb-shadow-md'
                }`}
              >
                <div className="kb-flex kb-items-center kb-justify-between kb-mb-3">
                  <div className="kb-flex kb-items-center kb-space-x-3">
                    <div className="kb-w-6 kb-h-6 kb-bg-slate-700 kb-rounded-md kb-flex kb-items-center kb-justify-center kb-flex-shrink-0">
                      <span className="kb-text-slate-400 kb-text-xs">🎯</span>
                    </div>
                    <h4 className="kb-text-sm kb-font-medium kb-text-slate-200 kb-truncate">
                      {taskId}
                    </h4>
                  </div>
                  {journey.statusTransitions && journey.statusTransitions.length > 0 && (
                    <span className={`kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-border kb-flex-shrink-0 ${
                      getStatusColor(journey.statusTransitions[journey.statusTransitions.length - 1].toStatus)
                    }`}>
                      <span className="kb-mr-1">
                        {getStatusIcon(journey.statusTransitions[journey.statusTransitions.length - 1].toStatus)}
                      </span>
                      {journey.statusTransitions[journey.statusTransitions.length - 1].toStatus}
                    </span>
                  )}
                </div>
                
                <div className="kb-grid kb-grid-cols-2 kb-gap-3 kb-text-xs">
                  <div className="kb-flex kb-items-center kb-space-x-2">
                    <span className="kb-text-slate-500">⚡</span>
                    <span className="kb-text-slate-400">{journey.statusTransitions?.length || 0} transitions</span>
                  </div>
                  {journey.totalDuration && (
                    <div className="kb-flex kb-items-center kb-space-x-2">
                      <span className="kb-text-slate-500">⏱️</span>
                      <span className="kb-text-slate-400">{formatDuration(journey.totalDuration)}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Task Details */}
      <div className="kb-w-1/2 kb-overflow-y-auto kb-bg-slate-900">
        {selectedTask ? (
          <div className="kb-p-6">
            <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6 kb-mb-6">
              <div className="kb-flex kb-items-center kb-space-x-3 kb-mb-4">
                <div className="kb-w-10 kb-h-10 kb-bg-blue-600 kb-rounded-lg kb-flex kb-items-center kb-justify-center">
                  <span className="kb-text-white kb-text-lg">📋</span>
                </div>
                <div>
                  <h2 className="kb-text-xl kb-font-semibold kb-text-slate-200">
                    Task Details
                  </h2>
                  <p className="kb-text-sm kb-text-slate-400">
                    Individual task analysis
                  </p>
                </div>
              </div>
              <div className="kb-bg-slate-700 kb-border kb-border-slate-600 kb-rounded-md kb-p-3">
                <p className="kb-text-sm kb-text-slate-300 kb-font-mono kb-break-all">
                  {selectedTask.taskId}
                </p>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="kb-mb-8">
              <div className="kb-flex kb-items-center kb-space-x-3 kb-mb-4">
                <div className="kb-w-8 kb-h-8 kb-bg-purple-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                  <span className="kb-text-white kb-text-sm">⏳</span>
                </div>
                <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200">Status Timeline</h3>
              </div>
              
              <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
                <div className="kb-space-y-6">
                  {(selectedTask.journey.statusTransitions || []).map((transition, index) => (
                    <div key={index} className="kb-flex kb-items-start kb-space-x-4">
                      <div className="kb-flex-shrink-0 kb-mt-1">
                        <div className="kb-w-8 kb-h-8 kb-bg-blue-600 kb-rounded-full kb-flex kb-items-center kb-justify-center">
                          <span className="kb-text-white kb-text-sm">{index + 1}</span>
                        </div>
                        {index < (selectedTask.journey.statusTransitions || []).length - 1 && (
                          <div className="kb-w-0.5 kb-h-8 kb-bg-slate-700 kb-mx-auto kb-mt-2"></div>
                        )}
                      </div>
                      
                      <div className="kb-flex-1 kb-min-w-0 kb-bg-slate-700 kb-border kb-border-slate-600 kb-rounded-lg kb-p-4">
                        <div className="kb-flex kb-items-center kb-flex-wrap kb-gap-3 kb-mb-3">
                          {transition.fromStatus && (
                            <>
                              <span className={`kb-inline-flex kb-items-center kb-px-3 kb-py-1 kb-rounded-full kb-text-xs kb-font-medium kb-border ${getStatusColor(transition.fromStatus)}`}>
                                <span className="kb-mr-1">{getStatusIcon(transition.fromStatus)}</span>
                                {transition.fromStatus}
                              </span>
                              <svg className="kb-w-4 kb-h-4 kb-text-slate-400 kb-flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </>
                          )}
                          <span className={`kb-inline-flex kb-items-center kb-px-3 kb-py-1 kb-rounded-full kb-text-xs kb-font-medium kb-border ${getStatusColor(transition.toStatus)}`}>
                            <span className="kb-mr-1">{getStatusIcon(transition.toStatus)}</span>
                            {transition.toStatus}
                          </span>
                        </div>
                        
                        <div className="kb-grid kb-grid-cols-1 md:kb-grid-cols-2 kb-gap-3 kb-text-xs">
                          <div className="kb-flex kb-items-center kb-space-x-2">
                            <span className="kb-text-slate-500">📅</span>
                            <span className="kb-text-slate-300">
                              {new Date(transition.timestamp).toLocaleString()}
                            </span>
                          </div>
                          {transition.duration && (
                            <div className="kb-flex kb-items-center kb-space-x-2">
                              <span className="kb-text-slate-500">⏱️</span>
                              <span className="kb-text-slate-300">
                                {formatDuration(transition.duration)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {transition.reason && (
                          <div className="kb-mt-3 kb-pt-3 kb-border-t kb-border-slate-600">
                            <div className="kb-flex kb-items-start kb-space-x-2">
                              <span className="kb-text-slate-500 kb-flex-shrink-0">💬</span>
                              <p className="kb-text-xs kb-text-slate-300">
                                {transition.reason}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Task Metrics */}
            {selectedTask.journey.totalDuration && (
              <div className="kb-mb-8">
                <div className="kb-flex kb-items-center kb-space-x-3 kb-mb-4">
                  <div className="kb-w-8 kb-h-8 kb-bg-green-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                    <span className="kb-text-white kb-text-sm">📊</span>
                  </div>
                  <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200">Performance Metrics</h3>
                </div>
                
                <div className="kb-grid kb-grid-cols-1 md:kb-grid-cols-2 kb-gap-4">
                  <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
                    <div className="kb-flex kb-items-center">
                      <div className="kb-flex-shrink-0">
                        <div className="kb-w-8 kb-h-8 kb-bg-blue-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                          <span className="kb-text-white kb-text-sm">⏱️</span>
                        </div>
                      </div>
                      <div className="kb-ml-4">
                        <div className="kb-text-sm kb-font-medium kb-text-slate-400">Total Duration</div>
                        <div className="kb-text-2xl kb-font-semibold kb-text-slate-200">
                          {formatDuration(selectedTask.journey.totalDuration)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
                    <div className="kb-flex kb-items-center">
                      <div className="kb-flex-shrink-0">
                        <div className="kb-w-8 kb-h-8 kb-bg-purple-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                          <span className="kb-text-white kb-text-sm">🔄</span>
                        </div>
                      </div>
                      <div className="kb-ml-4">
                        <div className="kb-text-sm kb-font-medium kb-text-slate-400">Status Changes</div>
                        <div className="kb-text-2xl kb-font-semibold kb-text-slate-200">
                          {selectedTask.journey.statusTransitions?.length || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Metrics */}
                  <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
                    <div className="kb-flex kb-items-center">
                      <div className="kb-flex-shrink-0">
                        <div className="kb-w-8 kb-h-8 kb-bg-orange-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                          <span className="kb-text-white kb-text-sm">📈</span>
                        </div>
                      </div>
                      <div className="kb-ml-4">
                        <div className="kb-text-sm kb-font-medium kb-text-slate-400">Avg Per Status</div>
                        <div className="kb-text-2xl kb-font-semibold kb-text-slate-200">
                          {selectedTask.journey.statusTransitions?.length 
                            ? formatDuration(selectedTask.journey.totalDuration / selectedTask.journey.statusTransitions.length)
                            : 'N/A'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
                    <div className="kb-flex kb-items-center">
                      <div className="kb-flex-shrink-0">
                        <div className="kb-w-8 kb-h-8 kb-bg-red-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                          <span className="kb-text-white kb-text-sm">
                            {selectedTask.journey.statusTransitions?.some(t => t.toStatus?.toLowerCase().includes('completed')) ? '✅' : '🔄'}
                          </span>
                        </div>
                      </div>
                      <div className="kb-ml-4">
                        <div className="kb-text-sm kb-font-medium kb-text-slate-400">Final Status</div>
                        <div className="kb-text-lg kb-font-semibold kb-text-slate-200">
                          {selectedTask.journey.statusTransitions?.length > 0
                            ? selectedTask.journey.statusTransitions[selectedTask.journey.statusTransitions.length - 1].toStatus
                            : 'Unknown'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Related Events */}
            <div>
              <div className="kb-flex kb-items-center kb-space-x-3 kb-mb-4">
                <div className="kb-w-8 kb-h-8 kb-bg-yellow-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                  <span className="kb-text-white kb-text-sm">📄</span>
                </div>
                <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200">Related Events</h3>
              </div>
              
              <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
                <div className="kb-flex kb-items-center kb-space-x-4">
                  <div className="kb-w-12 kb-h-12 kb-bg-blue-600/20 kb-rounded-lg kb-flex kb-items-center kb-justify-center">
                    <span className="kb-text-blue-400 kb-text-lg">📊</span>
                  </div>
                  <div>
                    <div className="kb-text-sm kb-font-medium kb-text-slate-200">
                      Event Summary
                    </div>
                    <div className="kb-text-xs kb-text-slate-400 kb-mt-1">
                      {selectedTask.journey.statusTransitions?.length || 0} status transition events have been recorded for this task
                    </div>
                    <div className="kb-flex kb-items-center kb-space-x-4 kb-mt-2">
                      <div className="kb-text-xs kb-text-slate-500">
                        <span className="kb-text-green-400">●</span> Completed transitions: {
                          selectedTask.journey.statusTransitions?.filter(t => 
                            t.toStatus?.toLowerCase().includes('completed')
                          ).length || 0
                        }
                      </div>
                      <div className="kb-text-xs kb-text-slate-500">
                        <span className="kb-text-blue-400">●</span> Active transitions: {
                          selectedTask.journey.statusTransitions?.filter(t => 
                            !t.toStatus?.toLowerCase().includes('completed')
                          ).length || 0
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="kb-p-6 kb-h-full kb-flex kb-items-center kb-justify-center">
            <div className="kb-text-center">
              <div className="kb-w-20 kb-h-20 kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-full kb-flex kb-items-center kb-justify-center kb-mx-auto kb-mb-6">
                <span className="kb-text-3xl">👈</span>
              </div>
              <h3 className="kb-text-lg kb-font-medium kb-text-slate-200 kb-mb-2">
                Select a Task
              </h3>
              <p className="kb-text-sm kb-text-slate-400 kb-max-w-md">
                Choose a task from the list on the left to see detailed journey information, status transitions, and performance metrics.
              </p>
              <div className="kb-mt-6 kb-flex kb-items-center kb-justify-center kb-space-x-4">
                <div className="kb-flex kb-items-center kb-space-x-2 kb-text-xs kb-text-slate-500">
                  <span className="kb-w-2 kb-h-2 kb-bg-blue-500 kb-rounded-full"></span>
                  <span>Status Timeline</span>
                </div>
                <div className="kb-flex kb-items-center kb-space-x-2 kb-text-xs kb-text-slate-500">
                  <span className="kb-w-2 kb-h-2 kb-bg-green-500 kb-rounded-full"></span>
                  <span>Performance Data</span>
                </div>
                <div className="kb-flex kb-items-center kb-space-x-2 kb-text-xs kb-text-slate-500">
                  <span className="kb-w-2 kb-h-2 kb-bg-purple-500 kb-rounded-full"></span>
                  <span>Event History</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskJourneyTab;