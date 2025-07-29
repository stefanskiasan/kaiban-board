import React, { useState, useMemo } from 'react';

const OrchestrationInsightsTab = ({ orchestrationLogs = [], workflowLogs = [], performanceMetrics }) => {
  const [selectedInsight, setSelectedInsight] = useState('decision-making');

  // Process orchestration data for insights
  const orchestrationInsights = useMemo(() => {
    if (!orchestrationLogs || orchestrationLogs.length === 0) {
      return {
        decisionMaking: {},
        taskSelection: {},
        adaptation: {},
        generation: {},
        strategy: {},
        performance: {}
      };
    }

    // Analyze decision making patterns
    const decisionEvents = orchestrationLogs.filter(log => 
      ['TASK_SELECTION', 'TASK_ADAPTATION', 'TASK_GENERATION', 'STRATEGY_CHANGE'].includes(log.orchestrationEvent)
    );

    const decisionMaking = {
      totalDecisions: decisionEvents.length,
      selectionDecisions: orchestrationLogs.filter(log => log.orchestrationEvent === 'TASK_SELECTION').length,
      adaptationDecisions: orchestrationLogs.filter(log => log.orchestrationEvent === 'TASK_ADAPTATION').length,
      generationDecisions: orchestrationLogs.filter(log => log.orchestrationEvent === 'TASK_GENERATION').length,
      strategyChanges: orchestrationLogs.filter(log => log.orchestrationEvent === 'STRATEGY_CHANGE').length,
      decisionFrequency: decisionEvents.length > 0 ? (Date.now() - Math.min(...decisionEvents.map(e => e.timestamp))) / decisionEvents.length : 0
    };

    // Analyze task selection patterns
    const taskSelectionLogs = orchestrationLogs.filter(log => log.orchestrationEvent === 'TASK_SELECTION');
    const taskSelection = {
      totalSelections: taskSelectionLogs.length,
      selectionReasons: {},
      selectedTasks: new Set(),
      averageSelectionTime: 0
    };

    taskSelectionLogs.forEach(log => {
      if (log.metadata?.selectedTask) {
        taskSelection.selectedTasks.add(log.metadata.selectedTask.id || log.metadata.selectedTask.title);
      }
      if (log.metadata?.reason) {
        const reason = log.metadata.reason;
        taskSelection.selectionReasons[reason] = (taskSelection.selectionReasons[reason] || 0) + 1;
      }
    });

    // Analyze adaptation patterns
    const adaptationLogs = orchestrationLogs.filter(log => log.orchestrationEvent === 'TASK_ADAPTATION');
    const adaptation = {
      totalAdaptations: adaptationLogs.length,
      adaptationTypes: {},
      adaptedTasks: new Set(),
      adaptationReasons: {}
    };

    adaptationLogs.forEach(log => {
      if (log.metadata?.adaptationType) {
        const type = log.metadata.adaptationType;
        adaptation.adaptationTypes[type] = (adaptation.adaptationTypes[type] || 0) + 1;
      }
      if (log.metadata?.taskId) {
        adaptation.adaptedTasks.add(log.metadata.taskId);
      }
      if (log.metadata?.reason) {
        const reason = log.metadata.reason;
        adaptation.adaptationReasons[reason] = (adaptation.adaptationReasons[reason] || 0) + 1;
      }
    });

    // Analyze generation patterns
    const generationLogs = orchestrationLogs.filter(log => log.orchestrationEvent === 'TASK_GENERATION');
    const generation = {
      totalGenerations: generationLogs.length,
      generationTriggers: {},
      generatedTaskTypes: {},
      generationSuccess: 0
    };

    generationLogs.forEach(log => {
      if (log.metadata?.trigger) {
        const trigger = log.metadata.trigger;
        generation.generationTriggers[trigger] = (generation.generationTriggers[trigger] || 0) + 1;
      }
      if (log.metadata?.taskType) {
        const type = log.metadata.taskType;
        generation.generatedTaskTypes[type] = (generation.generatedTaskTypes[type] || 0) + 1;
      }
      if (log.metadata?.success) {
        generation.generationSuccess++;
      }
    });

    // Analyze strategy patterns
    const strategyLogs = orchestrationLogs.filter(log => 
      log.orchestrationEvent === 'STRATEGY_CHANGE' || log.orchestrationEvent === 'MODE_CHANGE'
    );
    const strategy = {
      strategyChanges: strategyLogs.length,
      currentStrategy: null,
      strategyHistory: [],
      modeDistribution: {}
    };

    strategyLogs.forEach(log => {
      if (log.metadata?.newStrategy) {
        strategy.currentStrategy = log.metadata.newStrategy;
        strategy.strategyHistory.push({
          strategy: log.metadata.newStrategy,
          timestamp: log.timestamp,
          reason: log.metadata.reason
        });
      }
      if (log.metadata?.mode) {
        const mode = log.metadata.mode;
        strategy.modeDistribution[mode] = (strategy.modeDistribution[mode] || 0) + 1;
      }
    });

    return {
      decisionMaking,
      taskSelection,
      adaptation,
      generation,
      strategy,
      performance: performanceMetrics || {}
    };
  }, [orchestrationLogs, performanceMetrics]);

  if (orchestrationLogs.length === 0) {
    return (
      <div className="kb-p-6 kb-h-full kb-flex kb-items-center kb-justify-center">
        <div className="kb-text-center">
          <div className="kb-w-16 kb-h-16 kb-bg-purple-100 kb-rounded-full kb-flex kb-items-center kb-justify-center kb-mx-auto kb-mb-4">
            <span className="kb-text-2xl">🧠</span>
          </div>
          <h3 className="kb-text-lg kb-font-medium kb-text-gray-900 kb-mb-2">No Orchestration Data</h3>
          <p className="kb-text-gray-500">
            No AI orchestration events found. Enable intelligent orchestration to see insights.
          </p>
        </div>
      </div>
    );
  }

  const insightTabs = [
    { id: 'decision-making', label: 'Decision Making', icon: '🧠', count: orchestrationInsights.decisionMaking.totalDecisions },
    { id: 'task-selection', label: 'Task Selection', icon: '🎯', count: orchestrationInsights.taskSelection.totalSelections },
    { id: 'adaptation', label: 'Adaptation', icon: '🔄', count: orchestrationInsights.adaptation.totalAdaptations },
    { id: 'generation', label: 'Generation', icon: '✨', count: orchestrationInsights.generation.totalGenerations },
    { id: 'strategy', label: 'Strategy', icon: '📊', count: orchestrationInsights.strategy.strategyChanges }
  ];

  return (
    <div className="kb-h-full kb-flex kb-flex-col">
      
      {/* Header */}
      <div className="kb-p-6 kb-border-b kb-border-gray-200">
        <div className="kb-flex kb-items-center kb-justify-between">
          <div>
            <h2 className="kb-text-xl kb-font-semibold kb-text-gray-900">AI Orchestration Insights</h2>
            <p className="kb-text-sm kb-text-gray-500 kb-mt-1">
              Deep analysis of AI decision-making and orchestration patterns
            </p>
          </div>

          {/* Summary Stats */}
          <div className="kb-grid kb-grid-cols-3 kb-gap-4">
            <div className="kb-text-center">
              <div className="kb-text-2xl kb-font-bold kb-text-purple-600">
                {orchestrationLogs.length}
              </div>
              <div className="kb-text-xs kb-text-gray-500">Total Events</div>
            </div>
            <div className="kb-text-center">
              <div className="kb-text-2xl kb-font-bold kb-text-blue-600">
                {orchestrationInsights.decisionMaking.totalDecisions}
              </div>
              <div className="kb-text-xs kb-text-gray-500">Decisions</div>
            </div>
            <div className="kb-text-center">
              <div className="kb-text-2xl kb-font-bold kb-text-green-600">
                {orchestrationInsights.taskSelection.selectedTasks.size}
              </div>
              <div className="kb-text-xs kb-text-gray-500">Tasks Affected</div>
            </div>
          </div>
        </div>

        {/* Insight Navigation */}
        <div className="kb-flex kb-space-x-1 kb-mt-6 kb-bg-gray-100 kb-rounded-lg kb-p-1">
          {insightTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedInsight(tab.id)}
              className={`kb-flex-1 kb-flex kb-items-center kb-justify-center kb-space-x-2 kb-px-4 kb-py-2 kb-text-sm kb-font-medium kb-rounded-md kb-transition-colors ${
                selectedInsight === tab.id
                  ? 'kb-bg-white kb-text-gray-900 kb-shadow-sm'
                  : 'kb-text-gray-600 hover:kb-text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="kb-inline-flex kb-items-center kb-px-2 kb-py-0.5 kb-rounded-full kb-text-xs kb-bg-gray-200 kb-text-gray-700">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="kb-flex-1 kb-overflow-y-auto">
        {selectedInsight === 'decision-making' && (
          <DecisionMakingInsights insights={orchestrationInsights.decisionMaking} logs={orchestrationLogs} />
        )}
        {selectedInsight === 'task-selection' && (
          <TaskSelectionInsights insights={orchestrationInsights.taskSelection} logs={orchestrationLogs} />
        )}
        {selectedInsight === 'adaptation' && (
          <AdaptationInsights insights={orchestrationInsights.adaptation} logs={orchestrationLogs} />
        )}
        {selectedInsight === 'generation' && (
          <GenerationInsights insights={orchestrationInsights.generation} logs={orchestrationLogs} />
        )}
        {selectedInsight === 'strategy' && (
          <StrategyInsights insights={orchestrationInsights.strategy} logs={orchestrationLogs} />
        )}
      </div>
    </div>
  );
};

// Decision Making Insights Component
const DecisionMakingInsights = ({ insights, logs }) => {
  const decisionTimeline = logs
    .filter(log => ['TASK_SELECTION', 'TASK_ADAPTATION', 'TASK_GENERATION', 'STRATEGY_CHANGE'].includes(log.orchestrationEvent))
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);

  return (
    <div className="kb-p-6">
      
      {/* Decision Overview */}
      <div className="kb-grid kb-grid-cols-1 md:kb-grid-cols-2 lg:kb-grid-cols-4 kb-gap-6 kb-mb-8">
        <div className="kb-bg-blue-50 kb-border kb-border-blue-200 kb-rounded-lg kb-p-4">
          <div className="kb-text-sm kb-font-medium kb-text-gray-500">Task Selections</div>
          <div className="kb-text-2xl kb-font-semibold kb-text-gray-900">{insights.selectionDecisions}</div>
        </div>
        
        <div className="kb-bg-green-50 kb-border kb-border-green-200 kb-rounded-lg kb-p-4">
          <div className="kb-text-sm kb-font-medium kb-text-gray-500">Adaptations</div>
          <div className="kb-text-2xl kb-font-semibold kb-text-gray-900">{insights.adaptationDecisions}</div>
        </div>
        
        <div className="kb-bg-purple-50 kb-border kb-border-purple-200 kb-rounded-lg kb-p-4">
          <div className="kb-text-sm kb-font-medium kb-text-gray-500">Generations</div>
          <div className="kb-text-2xl kb-font-semibold kb-text-gray-900">{insights.generationDecisions}</div>
        </div>
        
        <div className="kb-bg-orange-50 kb-border kb-border-orange-200 kb-rounded-lg kb-p-4">
          <div className="kb-text-sm kb-font-medium kb-text-gray-500">Strategy Changes</div>
          <div className="kb-text-2xl kb-font-semibold kb-text-gray-900">{insights.strategyChanges}</div>
        </div>
      </div>

      {/* Decision Timeline */}
      <div className="kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg kb-p-6">
        <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Recent Decisions</h3>
        
        <div className="kb-space-y-4">
          {decisionTimeline.map((decision, index) => (
            <div key={index} className="kb-flex kb-items-start kb-space-x-4 kb-p-4 kb-border kb-border-gray-100 kb-rounded-lg">
              <div className="kb-flex-shrink-0">
                <div className={`kb-w-8 kb-h-8 kb-rounded-full kb-flex kb-items-center kb-justify-center ${
                  decision.orchestrationEvent === 'TASK_SELECTION' ? 'kb-bg-blue-100' :
                  decision.orchestrationEvent === 'TASK_ADAPTATION' ? 'kb-bg-green-100' :
                  decision.orchestrationEvent === 'TASK_GENERATION' ? 'kb-bg-purple-100' :
                  'kb-bg-orange-100'
                }`}>
                  <span className="kb-text-sm">
                    {decision.orchestrationEvent === 'TASK_SELECTION' && '🎯'}
                    {decision.orchestrationEvent === 'TASK_ADAPTATION' && '🔄'}
                    {decision.orchestrationEvent === 'TASK_GENERATION' && '✨'}
                    {decision.orchestrationEvent === 'STRATEGY_CHANGE' && '📊'}
                  </span>
                </div>
              </div>
              
              <div className="kb-flex-1">
                <div className="kb-flex kb-items-center kb-justify-between kb-mb-1">
                  <h4 className="kb-text-sm kb-font-medium kb-text-gray-900">
                    {decision.orchestrationEvent.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                  </h4>
                  <span className="kb-text-xs kb-text-gray-500">
                    {new Date(decision.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="kb-text-sm kb-text-gray-600">{decision.logDescription}</p>
                {decision.metadata?.reason && (
                  <p className="kb-text-xs kb-text-gray-500 kb-mt-1">
                    Reason: {decision.metadata.reason}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Task Selection Insights Component
const TaskSelectionInsights = ({ insights, logs }) => {
  const selectionLogs = logs.filter(log => log.orchestrationEvent === 'TASK_SELECTION');

  return (
    <div className="kb-p-6">
      <div className="kb-grid kb-grid-cols-1 lg:kb-grid-cols-2 kb-gap-8">
        
        {/* Selection Statistics */}
        <div className="kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg kb-p-6">
          <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Selection Statistics</h3>
          
          <div className="kb-space-y-4">
            <div className="kb-flex kb-justify-between kb-items-center">
              <span className="kb-text-sm kb-font-medium kb-text-gray-700">Total Selections</span>
              <span className="kb-text-sm kb-text-gray-900 kb-font-semibold">{insights.totalSelections}</span>
            </div>
            
            <div className="kb-flex kb-justify-between kb-items-center">
              <span className="kb-text-sm kb-font-medium kb-text-gray-700">Unique Tasks Selected</span>
              <span className="kb-text-sm kb-text-gray-900 kb-font-semibold">{insights.selectedTasks.size}</span>
            </div>
          </div>
        </div>

        {/* Selection Reasons */}
        {Object.keys(insights.selectionReasons).length > 0 && (
          <div className="kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg kb-p-6">
            <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Selection Reasons</h3>
            
            <div className="kb-space-y-3">
              {Object.entries(insights.selectionReasons)
                .sort(([,a], [,b]) => b - a)
                .map(([reason, count]) => (
                <div key={reason} className="kb-flex kb-items-center kb-justify-between">
                  <span className="kb-text-sm kb-text-gray-700 kb-flex-1 kb-truncate" title={reason}>
                    {reason}
                  </span>
                  <div className="kb-flex kb-items-center kb-space-x-2 kb-ml-4">
                    <div className="kb-w-16 kb-bg-gray-200 kb-rounded-full kb-h-2">
                      <div 
                        className="kb-bg-blue-600 kb-h-2 kb-rounded-full" 
                        style={{ 
                          width: `${(count / Math.max(...Object.values(insights.selectionReasons))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="kb-text-sm kb-font-medium kb-text-gray-900 kb-w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Selections */}
      <div className="kb-mt-8 kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg kb-p-6">
        <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Recent Task Selections</h3>
        
        <div className="kb-space-y-3">
          {selectionLogs.slice(0, 5).map((log, index) => (
            <div key={index} className="kb-flex kb-items-center kb-space-x-4 kb-p-3 kb-bg-blue-50 kb-border kb-border-blue-200 kb-rounded-lg">
              <span className="kb-text-blue-600 kb-text-lg">🎯</span>
              <div className="kb-flex-1">
                <p className="kb-text-sm kb-font-medium kb-text-gray-900">{log.logDescription}</p>
                <p className="kb-text-xs kb-text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Adaptation Insights Component
const AdaptationInsights = ({ insights, logs }) => {
  const adaptationLogs = logs.filter(log => log.orchestrationEvent === 'TASK_ADAPTATION');

  return (
    <div className="kb-p-6">
      <div className="kb-grid kb-grid-cols-1 lg:kb-grid-cols-2 kb-gap-8">
        
        {/* Adaptation Types */}
        {Object.keys(insights.adaptationTypes).length > 0 && (
          <div className="kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg kb-p-6">
            <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Adaptation Types</h3>
            
            <div className="kb-space-y-3">
              {Object.entries(insights.adaptationTypes)
                .sort(([,a], [,b]) => b - a)
                .map(([type, count]) => (
                <div key={type} className="kb-flex kb-items-center kb-justify-between">
                  <span className="kb-text-sm kb-text-gray-700 kb-capitalize">
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-bg-green-100 kb-text-green-800">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Adaptation Reasons */}
        {Object.keys(insights.adaptationReasons).length > 0 && (
          <div className="kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg kb-p-6">
            <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Adaptation Triggers</h3>
            
            <div className="kb-space-y-3">
              {Object.entries(insights.adaptationReasons)
                .sort(([,a], [,b]) => b - a)
                .map(([reason, count]) => (
                <div key={reason} className="kb-flex kb-items-center kb-justify-between">
                  <span className="kb-text-sm kb-text-gray-700 kb-flex-1 kb-truncate" title={reason}>
                    {reason}
                  </span>
                  <span className="kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-bg-yellow-100 kb-text-yellow-800">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Adaptations */}
      <div className="kb-mt-8 kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg kb-p-6">
        <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Recent Adaptations</h3>
        
        <div className="kb-space-y-3">
          {adaptationLogs.slice(0, 5).map((log, index) => (
            <div key={index} className="kb-flex kb-items-center kb-space-x-4 kb-p-3 kb-bg-green-50 kb-border kb-border-green-200 kb-rounded-lg">
              <span className="kb-text-green-600 kb-text-lg">🔄</span>
              <div className="kb-flex-1">
                <p className="kb-text-sm kb-font-medium kb-text-gray-900">{log.logDescription}</p>
                <p className="kb-text-xs kb-text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Generation Insights Component
const GenerationInsights = ({ insights, logs }) => {
  const generationLogs = logs.filter(log => log.orchestrationEvent === 'TASK_GENERATION');

  return (
    <div className="kb-p-6">
      <div className="kb-grid kb-grid-cols-1 lg:kb-grid-cols-2 kb-gap-8">
        
        {/* Generation Triggers */}
        {Object.keys(insights.generationTriggers).length > 0 && (
          <div className="kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg kb-p-6">
            <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Generation Triggers</h3>
            
            <div className="kb-space-y-3">
              {Object.entries(insights.generationTriggers)
                .sort(([,a], [,b]) => b - a)
                .map(([trigger, count]) => (
                <div key={trigger} className="kb-flex kb-items-center kb-justify-between">
                  <span className="kb-text-sm kb-text-gray-700 kb-capitalize">
                    {trigger.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-bg-purple-100 kb-text-purple-800">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Rate */}
        <div className="kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg kb-p-6">
          <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Generation Success</h3>
          
          <div className="kb-space-y-4">
            <div className="kb-flex kb-justify-between kb-items-center">
              <span className="kb-text-sm kb-font-medium kb-text-gray-700">Total Attempts</span>
              <span className="kb-text-sm kb-text-gray-900 kb-font-semibold">{insights.totalGenerations}</span>
            </div>
            
            <div className="kb-flex kb-justify-between kb-items-center">
              <span className="kb-text-sm kb-font-medium kb-text-gray-700">Successful</span>
              <span className="kb-text-sm kb-text-gray-900 kb-font-semibold">{insights.generationSuccess}</span>
            </div>
            
            {insights.totalGenerations > 0 && (
              <div className="kb-flex kb-justify-between kb-items-center">
                <span className="kb-text-sm kb-font-medium kb-text-gray-700">Success Rate</span>
                <span className="kb-text-sm kb-text-green-600 kb-font-semibold">
                  {Math.round((insights.generationSuccess / insights.totalGenerations) * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Generations */}
      <div className="kb-mt-8 kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg kb-p-6">
        <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Recent Task Generations</h3>
        
        <div className="kb-space-y-3">
          {generationLogs.slice(0, 5).map((log, index) => (
            <div key={index} className="kb-flex kb-items-center kb-space-x-4 kb-p-3 kb-bg-purple-50 kb-border kb-border-purple-200 kb-rounded-lg">
              <span className="kb-text-purple-600 kb-text-lg">✨</span>
              <div className="kb-flex-1">
                <p className="kb-text-sm kb-font-medium kb-text-gray-900">{log.logDescription}</p>
                <p className="kb-text-xs kb-text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Strategy Insights Component
const StrategyInsights = ({ insights, logs }) => {
  const strategyLogs = logs.filter(log => 
    log.orchestrationEvent === 'STRATEGY_CHANGE' || log.orchestrationEvent === 'MODE_CHANGE'
  );

  return (
    <div className="kb-p-6">
      <div className="kb-grid kb-grid-cols-1 lg:kb-grid-cols-2 kb-gap-8">
        
        {/* Current Strategy */}
        <div className="kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg kb-p-6">
          <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Strategy Overview</h3>
          
          <div className="kb-space-y-4">
            {insights.currentStrategy && (
              <div className="kb-flex kb-justify-between kb-items-center">
                <span className="kb-text-sm kb-font-medium kb-text-gray-700">Current Strategy</span>
                <span className="kb-inline-flex kb-items-center kb-px-3 kb-py-1 kb-rounded-full kb-text-sm kb-font-medium kb-bg-blue-100 kb-text-blue-800">
                  {insights.currentStrategy}
                </span>
              </div>
            )}
            
            <div className="kb-flex kb-justify-between kb-items-center">
              <span className="kb-text-sm kb-font-medium kb-text-gray-700">Strategy Changes</span>
              <span className="kb-text-sm kb-text-gray-900 kb-font-semibold">{insights.strategyChanges}</span>
            </div>
          </div>
        </div>

        {/* Mode Distribution */}
        {Object.keys(insights.modeDistribution).length > 0 && (
          <div className="kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg kb-p-6">
            <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Mode Distribution</h3>
            
            <div className="kb-space-y-3">
              {Object.entries(insights.modeDistribution)
                .sort(([,a], [,b]) => b - a)
                .map(([mode, count]) => (
                <div key={mode} className="kb-flex kb-items-center kb-justify-between">
                  <span className="kb-text-sm kb-text-gray-700 kb-capitalize">
                    {mode}
                  </span>
                  <span className="kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-bg-orange-100 kb-text-orange-800">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Strategy History */}
      {insights.strategyHistory.length > 0 && (
        <div className="kb-mt-8 kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg kb-p-6">
          <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Strategy Evolution</h3>
          
          <div className="kb-space-y-4">
            {insights.strategyHistory.slice(0, 5).map((change, index) => (
              <div key={index} className="kb-flex kb-items-start kb-space-x-4 kb-p-3 kb-bg-orange-50 kb-border kb-border-orange-200 kb-rounded-lg">
                <span className="kb-text-orange-600 kb-text-lg">📊</span>
                <div className="kb-flex-1">
                  <div className="kb-flex kb-items-center kb-space-x-2 kb-mb-1">
                    <span className="kb-text-sm kb-font-medium kb-text-gray-900">
                      Changed to: {change.strategy}
                    </span>
                    <span className="kb-text-xs kb-text-gray-500">
                      {new Date(change.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {change.reason && (
                    <p className="kb-text-xs kb-text-gray-600">
                      Reason: {change.reason}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrchestrationInsightsTab;