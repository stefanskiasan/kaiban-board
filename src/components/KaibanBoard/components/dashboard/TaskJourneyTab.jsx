import React, { useState } from 'react';

const TaskJourneyTab = ({ taskFlows, workflowLogs = [] }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState('flows'); // 'flows' or 'individual'

  // If no task flow data, show empty state
  if (!taskFlows || !taskFlows.taskJourneys || Object.keys(taskFlows.taskJourneys).length === 0) {
    return (
      <div className="kb-p-6 kb-h-full kb-flex kb-items-center kb-justify-center">
        <div className="kb-text-center">
          <div className="kb-w-16 kb-h-16 kb-bg-blue-100 kb-rounded-full kb-flex kb-items-center kb-justify-center kb-mx-auto kb-mb-4">
            <span className="kb-text-2xl">🎯</span>
          </div>
          <h3 className="kb-text-lg kb-font-medium kb-text-gray-900 kb-mb-2">No Task Data</h3>
          <p className="kb-text-gray-500">
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
      <div className="kb-p-6 kb-border-b kb-border-gray-200">
        <div className="kb-flex kb-items-center kb-justify-between">
          <div>
            <h2 className="kb-text-xl kb-font-semibold kb-text-gray-900">Task Journey Analysis</h2>
            <p className="kb-text-sm kb-text-gray-500 kb-mt-1">
              Track task progression and identify bottlenecks
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="kb-flex kb-bg-gray-100 kb-rounded-lg kb-p-1">
            <button
              onClick={() => setViewMode('flows')}
              className={`kb-px-4 kb-py-2 kb-text-sm kb-font-medium kb-rounded-md kb-transition-colors ${
                viewMode === 'flows'
                  ? 'kb-bg-white kb-text-gray-900 kb-shadow-sm'
                  : 'kb-text-gray-600 hover:kb-text-gray-900'
              }`}
            >
              📊 Flow Analysis
            </button>
            <button
              onClick={() => setViewMode('individual')}
              className={`kb-px-4 kb-py-2 kb-text-sm kb-font-medium kb-rounded-md kb-transition-colors ${
                viewMode === 'individual'
                  ? 'kb-bg-white kb-text-gray-900 kb-shadow-sm'
                  : 'kb-text-gray-600 hover:kb-text-gray-900'
              }`}
            >
              🎯 Individual Tasks
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="kb-grid kb-grid-cols-2 md:kb-grid-cols-4 kb-gap-4 kb-mt-6">
          <div className="kb-bg-blue-50 kb-rounded-lg kb-p-4">
            <div className="kb-text-sm kb-font-medium kb-text-gray-500">Total Tasks</div>
            <div className="kb-text-2xl kb-font-semibold kb-text-gray-900">
              {Object.keys(taskFlows.taskJourneys).length}
            </div>
          </div>
          
          <div className="kb-bg-green-50 kb-rounded-lg kb-p-4">
            <div className="kb-text-sm kb-font-medium kb-text-gray-500">Completed</div>
            <div className="kb-text-2xl kb-font-semibold kb-text-gray-900">
              {Object.values(taskFlows.taskJourneys).filter(journey => 
                journey.statusTransitions.some(t => t.toStatus === 'COMPLETED')
              ).length}
            </div>
          </div>

          <div className="kb-bg-yellow-50 kb-rounded-lg kb-p-4">
            <div className="kb-text-sm kb-font-medium kb-text-gray-500">Avg Duration</div>
            <div className="kb-text-2xl kb-font-semibold kb-text-gray-900">
              {taskFlows.averageTaskDuration 
                ? formatDuration(taskFlows.averageTaskDuration)
                : 'N/A'
              }
            </div>
          </div>

          <div className="kb-bg-red-50 kb-rounded-lg kb-p-4">
            <div className="kb-text-sm kb-font-medium kb-text-gray-500">Blocked</div>
            <div className="kb-text-2xl kb-font-semibold kb-text-gray-900">
              {taskFlows.blockageAnalysis?.blockedTasks?.length || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="kb-flex-1 kb-overflow-hidden">
        {viewMode === 'flows' ? (
          <FlowAnalysisView taskFlows={taskFlows} />
        ) : (
          <IndividualTasksView 
            taskFlows={taskFlows} 
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
          />
        )}
      </div>
    </div>
  );
};

// Flow Analysis View Component
const FlowAnalysisView = ({ taskFlows }) => {
  return (
    <div className="kb-p-6 kb-overflow-y-auto kb-h-full">
      
      {/* Status Transition Flow */}
      <div className="kb-mb-8">
        <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Status Transition Flow</h3>
        
        {taskFlows.statusTransitions && Object.keys(taskFlows.statusTransitions).length > 0 ? (
          <div className="kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg kb-p-6">
            <div className="kb-space-y-4">
              {Object.entries(taskFlows.statusTransitions).map(([transition, count]) => {
                const [fromStatus, toStatus] = transition.split('->');
                return (
                  <div key={transition} className="kb-flex kb-items-center kb-justify-between">
                    <div className="kb-flex kb-items-center kb-space-x-4">
                      <span className={`kb-inline-flex kb-items-center kb-px-3 kb-py-1 kb-rounded-full kb-text-sm kb-font-medium kb-border ${getStatusColor(fromStatus)}`}>
                        {getStatusIcon(fromStatus)} {fromStatus}
                      </span>
                      <svg className="kb-w-5 kb-h-5 kb-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className={`kb-inline-flex kb-items-center kb-px-3 kb-py-1 kb-rounded-full kb-text-sm kb-font-medium kb-border ${getStatusColor(toStatus)}`}>
                        {getStatusIcon(toStatus)} {toStatus}
                      </span>
                    </div>
                    <div className="kb-flex kb-items-center kb-space-x-3">
                      <span className="kb-text-sm kb-text-gray-600">{count} transitions</span>
                      <div className="kb-w-20 kb-bg-gray-200 kb-rounded-full kb-h-2">
                        <div 
                          className="kb-bg-blue-600 kb-h-2 kb-rounded-full" 
                          style={{ 
                            width: `${Math.min(100, (count / Math.max(...Object.values(taskFlows.statusTransitions))) * 100)}%` 
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
          <div className="kb-bg-gray-50 kb-rounded-lg kb-p-8 kb-text-center">
            <p className="kb-text-gray-500">No status transition data available</p>
          </div>
        )}
      </div>

      {/* Bottleneck Analysis */}
      {taskFlows.blockageAnalysis && (
        <div className="kb-mb-8">
          <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Bottleneck Analysis</h3>
          
          {taskFlows.blockageAnalysis.blockedTasks && taskFlows.blockageAnalysis.blockedTasks.length > 0 ? (
            <div className="kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg">
              {taskFlows.blockageAnalysis.blockedTasks.map((blockedTask, index) => (
                <div key={index} className="kb-p-4 kb-border-b kb-border-gray-100 last:kb-border-b-0">
                  <div className="kb-flex kb-items-start kb-space-x-4">
                    <div className="kb-flex-shrink-0">
                      <div className="kb-w-8 kb-h-8 kb-bg-red-100 kb-rounded-full kb-flex kb-items-center kb-justify-center">
                        <span className="kb-text-red-600 kb-text-sm">🚧</span>
                      </div>
                    </div>
                    <div className="kb-flex-1">
                      <h4 className="kb-text-sm kb-font-medium kb-text-gray-900">
                        {blockedTask.taskId}
                      </h4>
                      <p className="kb-text-xs kb-text-gray-600 kb-mt-1">
                        Blocked for: {formatDuration(blockedTask.duration)}
                      </p>
                      {blockedTask.reason && (
                        <p className="kb-text-xs kb-text-red-600 kb-mt-1">
                          Reason: {blockedTask.reason}
                        </p>
                      )}
                    </div>
                    <div className="kb-text-right">
                      <span className="kb-text-xs kb-text-gray-500">
                        {new Date(blockedTask.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="kb-bg-green-50 kb-border kb-border-green-200 kb-rounded-lg kb-p-6">
              <div className="kb-flex kb-items-center kb-space-x-3">
                <span className="kb-text-green-600 kb-text-xl">✅</span>
                <div>
                  <p className="kb-text-sm kb-font-medium kb-text-green-800">No Bottlenecks Found</p>
                  <p className="kb-text-xs kb-text-green-700">Tasks are flowing smoothly through the workflow</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Performance Insights */}
      {taskFlows.performanceInsights && (
        <div>
          <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Performance Insights</h3>
          
          <div className="kb-grid kb-grid-cols-1 md:kb-grid-cols-2 kb-gap-6">
            
            {/* Fastest Tasks */}
            {taskFlows.performanceInsights.fastestTasks && taskFlows.performanceInsights.fastestTasks.length > 0 && (
              <div className="kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg kb-p-4">
                <h4 className="kb-text-sm kb-font-medium kb-text-gray-900 kb-mb-3">⚡ Fastest Tasks</h4>
                <div className="kb-space-y-2">
                  {taskFlows.performanceInsights.fastestTasks.slice(0, 5).map((task, index) => (
                    <div key={index} className="kb-flex kb-justify-between kb-items-center">
                      <span className="kb-text-sm kb-text-gray-700 kb-truncate">{task.taskId}</span>
                      <span className="kb-text-sm kb-font-medium kb-text-green-600">
                        {formatDuration(task.duration)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Slowest Tasks */}
            {taskFlows.performanceInsights.slowestTasks && taskFlows.performanceInsights.slowestTasks.length > 0 && (
              <div className="kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg kb-p-4">
                <h4 className="kb-text-sm kb-font-medium kb-text-gray-900 kb-mb-3">🐌 Slowest Tasks</h4>
                <div className="kb-space-y-2">
                  {taskFlows.performanceInsights.slowestTasks.slice(0, 5).map((task, index) => (
                    <div key={index} className="kb-flex kb-justify-between kb-items-center">
                      <span className="kb-text-sm kb-text-gray-700 kb-truncate">{task.taskId}</span>
                      <span className="kb-text-sm kb-font-medium kb-text-red-600">
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
const IndividualTasksView = ({ taskFlows, selectedTask, setSelectedTask }) => {
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
    <div className="kb-h-full kb-flex">
      
      {/* Left Panel: Task List */}
      <div className="kb-w-1/2 kb-border-r kb-border-gray-200 kb-overflow-y-auto">
        <div className="kb-p-6">
          <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Tasks</h3>
          
          <div className="kb-space-y-3">
            {Object.entries(taskFlows.taskJourneys).map(([taskId, journey]) => (
              <button
                key={taskId}
                onClick={() => setSelectedTask({ taskId, journey })}
                className={`kb-w-full kb-p-4 kb-text-left kb-border kb-rounded-lg kb-transition-colors ${
                  selectedTask?.taskId === taskId
                    ? 'kb-border-blue-300 kb-bg-blue-50'
                    : 'kb-border-gray-200 hover:kb-border-gray-300 hover:kb-bg-gray-50'
                }`}
              >
                <div className="kb-flex kb-items-center kb-justify-between kb-mb-2">
                  <h4 className="kb-text-sm kb-font-medium kb-text-gray-900 kb-truncate">
                    {taskId}
                  </h4>
                  {journey.statusTransitions.length > 0 && (
                    <span className={`kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-border ${
                      getStatusColor(journey.statusTransitions[journey.statusTransitions.length - 1].toStatus)
                    }`}>
                      {getStatusIcon(journey.statusTransitions[journey.statusTransitions.length - 1].toStatus)}
                      {journey.statusTransitions[journey.statusTransitions.length - 1].toStatus}
                    </span>
                  )}
                </div>
                
                <div className="kb-flex kb-items-center kb-justify-between kb-text-xs kb-text-gray-500">
                  <span>{journey.statusTransitions.length} transitions</span>
                  {journey.totalDuration && (
                    <span>Duration: {formatDuration(journey.totalDuration)}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Task Details */}
      <div className="kb-w-1/2 kb-overflow-y-auto">
        {selectedTask ? (
          <div className="kb-p-6">
            <div className="kb-mb-6">
              <h2 className="kb-text-xl kb-font-semibold kb-text-gray-900 kb-mb-2">
                Task Details
              </h2>
              <p className="kb-text-sm kb-text-gray-600 kb-font-mono">
                {selectedTask.taskId}
              </p>
            </div>

            {/* Status Timeline */}
            <div className="kb-mb-8">
              <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Status Timeline</h3>
              
              <div className="kb-space-y-4">
                {selectedTask.journey.statusTransitions.map((transition, index) => (
                  <div key={index} className="kb-flex kb-items-start kb-space-x-4">
                    <div className="kb-flex-shrink-0 kb-mt-1">
                      <div className="kb-w-8 kb-h-8 kb-bg-blue-100 kb-rounded-full kb-flex kb-items-center kb-justify-center">
                        <span className="kb-text-blue-600 kb-text-xs">{index + 1}</span>
                      </div>
                    </div>
                    
                    <div className="kb-flex-1 kb-min-w-0">
                      <div className="kb-flex kb-items-center kb-space-x-3 kb-mb-2">
                        {transition.fromStatus && (
                          <>
                            <span className={`kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-border ${getStatusColor(transition.fromStatus)}`}>
                              {getStatusIcon(transition.fromStatus)} {transition.fromStatus}
                            </span>
                            <svg className="kb-w-4 kb-h-4 kb-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </>
                        )}
                        <span className={`kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-border ${getStatusColor(transition.toStatus)}`}>
                          {getStatusIcon(transition.toStatus)} {transition.toStatus}
                        </span>
                      </div>
                      
                      <div className="kb-text-xs kb-text-gray-500">
                        {new Date(transition.timestamp).toLocaleString()}
                        {transition.duration && (
                          <> • Duration: {formatDuration(transition.duration)}</>
                        )}
                      </div>
                      
                      {transition.reason && (
                        <p className="kb-text-xs kb-text-gray-600 kb-mt-1">
                          Reason: {transition.reason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Metrics */}
            {selectedTask.journey.totalDuration && (
              <div className="kb-mb-8">
                <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Performance Metrics</h3>
                
                <div className="kb-grid kb-grid-cols-1 md:kb-grid-cols-2 kb-gap-4">
                  <div className="kb-bg-blue-50 kb-border kb-border-blue-200 kb-rounded-lg kb-p-4">
                    <div className="kb-text-sm kb-font-medium kb-text-gray-500">Total Duration</div>
                    <div className="kb-text-xl kb-font-semibold kb-text-gray-900">
                      {formatDuration(selectedTask.journey.totalDuration)}
                    </div>
                  </div>
                  
                  <div className="kb-bg-green-50 kb-border kb-border-green-200 kb-rounded-lg kb-p-4">
                    <div className="kb-text-sm kb-font-medium kb-text-gray-500">Status Changes</div>
                    <div className="kb-text-xl kb-font-semibold kb-text-gray-900">
                      {selectedTask.journey.statusTransitions.length}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Related Logs */}
            <div>
              <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Related Events</h3>
              
              <div className="kb-bg-gray-50 kb-rounded-lg kb-p-4">
                <p className="kb-text-sm kb-text-gray-600">
                  {selectedTask.journey.statusTransitions.length} status transition events recorded
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="kb-p-6 kb-h-full kb-flex kb-items-center kb-justify-center">
            <div className="kb-text-center kb-text-gray-500">
              <div className="kb-w-16 kb-h-16 kb-bg-gray-100 kb-rounded-full kb-flex kb-items-center kb-justify-center kb-mx-auto kb-mb-4">
                <span className="kb-text-2xl">👈</span>
              </div>
              <p>Select a task from the list to see its journey details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskJourneyTab;