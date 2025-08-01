import React, { useState, useMemo } from 'react';
import { loadAnalyticsFromLocalStorage, deleteAnalyticsSession, clearAnalyticsFromLocalStorage } from '../../utils/localStorageKeys';

const OrchestrationInsightsTab = ({ orchestrationLogs = [], workflowLogs = [], performanceMetrics }) => {
  const [selectedInsight, setSelectedInsight] = useState('decision-making');
  const [selectedSession, setSelectedSession] = useState('current');
  const [showHistoricalData, setShowHistoricalData] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Export functionality
  const exportAnalyticsData = (format = 'json') => {
    try {
      const analytics = loadAnalyticsFromLocalStorage();
      let exportData;
      let filename;
      let mimeType;

      if (format === 'json') {
        exportData = JSON.stringify(analytics, null, 2);
        filename = `orchestration_analytics_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      } else if (format === 'csv') {
        // Convert to CSV format
        const csvHeader = 'Session ID,Team Name,Start Time,End Time,Duration (ms),Total Events,Task Selections,Adaptations,Generations,Strategy Changes\n';
        const csvData = analytics.map(session => {
          return [
            session.sessionId,
            session.teamName,
            new Date(session.startTime).toISOString(),
            new Date(session.endTime).toISOString(),
            session.duration,
            session.totalLogs,
            session.summary?.taskSelections || 0,
            session.summary?.adaptations || 0,
            session.summary?.generations || 0,
            session.summary?.strategyChanges || 0
          ].join(',');
        }).join('\n');
        
        exportData = csvHeader + csvData;
        filename = `orchestration_analytics_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      }

      // Create and download file
      const blob = new Blob([exportData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log(`✅ Exported analytics data as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Failed to export analytics data:', error);
    }
  };

  // Delete session functionality
  const handleDeleteSession = (sessionId) => {
    if (window.confirm('Are you sure you want to delete this analytics session? This cannot be undone.')) {
      const success = deleteAnalyticsSession(sessionId);
      if (success) {
        // Refresh the historical sessions list
        window.location.reload(); // Simple refresh - could be optimized
      }
    }
  };

  // Clear all analytics
  const handleClearAllAnalytics = () => {
    if (window.confirm('Are you sure you want to delete ALL analytics data? This cannot be undone.')) {
      const success = clearAnalyticsFromLocalStorage();
      if (success) {
        window.location.reload(); // Simple refresh - could be optimized
      }
    }
  };

  // Load historical analytics sessions
  const historicalSessions = useMemo(() => {
    try {
      const sessions = loadAnalyticsFromLocalStorage();
      return sessions.sort((a, b) => b.timestamp - a.timestamp); // Most recent first
    } catch (error) {
      console.error('Failed to load historical analytics:', error);
      return [];
    }
  }, []);

  // Determine which data to use (current or historical)
  const activeOrchestrationLogs = useMemo(() => {
    if (selectedSession === 'current') {
      return orchestrationLogs;
    }
    
    const session = historicalSessions.find(s => s.sessionId === selectedSession);
    return session?.orchestrationLogs || [];
  }, [selectedSession, orchestrationLogs, historicalSessions]);

  const activePerformanceMetrics = useMemo(() => {
    if (selectedSession === 'current') {
      return performanceMetrics;
    }
    
    const session = historicalSessions.find(s => s.sessionId === selectedSession);
    return session?.performanceMetrics || {};
  }, [selectedSession, performanceMetrics, historicalSessions]);

  // Process orchestration data for insights
  const orchestrationInsights = useMemo(() => {
    if (!activeOrchestrationLogs || activeOrchestrationLogs.length === 0) {
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
    const decisionEvents = activeOrchestrationLogs.filter(log => 
      ['TASK_SELECTION', 'TASK_ADAPTATION', 'TASK_GENERATION', 'STRATEGY_CHANGE'].includes(log.orchestrationEvent)
    );

    const decisionMaking = {
      totalDecisions: decisionEvents.length,
      selectionDecisions: activeOrchestrationLogs.filter(log => log.orchestrationEvent === 'TASK_SELECTION').length,
      adaptationDecisions: activeOrchestrationLogs.filter(log => log.orchestrationEvent === 'TASK_ADAPTATION').length,
      generationDecisions: activeOrchestrationLogs.filter(log => log.orchestrationEvent === 'TASK_GENERATION').length,
      strategyChanges: activeOrchestrationLogs.filter(log => log.orchestrationEvent === 'STRATEGY_CHANGE').length,
      decisionFrequency: decisionEvents.length > 0 ? (Date.now() - Math.min(...decisionEvents.map(e => e.timestamp))) / decisionEvents.length : 0
    };

    // Analyze task selection patterns
    const taskSelectionLogs = activeOrchestrationLogs.filter(log => log.orchestrationEvent === 'TASK_SELECTION');
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
    const adaptationLogs = activeOrchestrationLogs.filter(log => log.orchestrationEvent === 'TASK_ADAPTATION');
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
    const generationLogs = activeOrchestrationLogs.filter(log => log.orchestrationEvent === 'TASK_GENERATION');
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
    const strategyLogs = activeOrchestrationLogs.filter(log => 
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
      performance: activePerformanceMetrics || {}
    };
  }, [activeOrchestrationLogs, activePerformanceMetrics]);

  if (activeOrchestrationLogs.length === 0 && historicalSessions.length === 0) {
    return (
      <div className="kb-p-6 kb-h-full kb-flex kb-items-center kb-justify-center kb-bg-slate-900">
        <div className="kb-text-center">
          <div className="kb-w-16 kb-h-16 kb-bg-slate-800 kb-rounded-full kb-flex kb-items-center kb-justify-center kb-mx-auto kb-mb-4">
            <span className="kb-text-2xl">🧠</span>
          </div>
          <h3 className="kb-text-lg kb-font-medium kb-text-slate-200 kb-mb-2">No Orchestration Data</h3>
          <p className="kb-text-slate-400">
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
      <div className="kb-p-6 kb-border-b kb-border-slate-700">
        <div className="kb-flex kb-items-center kb-justify-between">
          <div>
            <h2 className="kb-text-xl kb-font-semibold kb-text-slate-200">AI Orchestration Insights</h2>
            <p className="kb-text-sm kb-text-slate-400 kb-mt-1">
              Deep analysis of AI decision-making and orchestration patterns
            </p>
          </div>

          {/* Session Selector */}
          <div className="kb-flex kb-items-center kb-space-x-4">
            <div className="kb-flex kb-items-center kb-space-x-2">
              <label className="kb-text-sm kb-font-medium kb-text-slate-300">Session:</label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="kb-bg-slate-700 kb-border kb-border-slate-600 kb-text-slate-200 kb-text-sm kb-rounded kb-px-3 kb-py-1 kb-focus:outline-none kb-focus:border-purple-500"
              >
                <option value="current">Current Session</option>
                {historicalSessions.map((session) => (
                  <option key={session.sessionId} value={session.sessionId}>
                    {session.teamName} - {new Date(session.timestamp).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            
            {historicalSessions.length > 0 && (
              <button
                onClick={() => setShowHistoricalData(!showHistoricalData)}
                className="kb-text-xs kb-text-purple-400 hover:kb-text-purple-300 kb-transition-colors"
              >
                {showHistoricalData ? 'Hide History' : `${historicalSessions.length} Sessions Available`}
              </button>
            )}

            {/* Export and Management Menu */}
            {historicalSessions.length > 0 && (
              <div className="kb-relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="kb-text-xs kb-bg-purple-600 hover:kb-bg-purple-700 kb-text-white kb-px-3 kb-py-1 kb-rounded kb-transition-colors"
                >
                  ⚙️ Manage
                </button>
                
                {showExportMenu && (
                  <div className="kb-absolute kb-right-0 kb-top-8 kb-bg-slate-700 kb-border kb-border-slate-600 kb-rounded kb-shadow-lg kb-z-10 kb-w-48">
                    <div className="kb-p-2">
                      <div className="kb-text-xs kb-font-medium kb-text-slate-300 kb-mb-2">Export Data</div>
                      <button
                        onClick={() => { exportAnalyticsData('json'); setShowExportMenu(false); }}
                        className="kb-w-full kb-text-left kb-text-xs kb-text-slate-200 hover:kb-bg-slate-600 kb-px-2 kb-py-1 kb-rounded kb-transition-colors"
                      >
                        📄 Export as JSON
                      </button>
                      <button
                        onClick={() => { exportAnalyticsData('csv'); setShowExportMenu(false); }}
                        className="kb-w-full kb-text-left kb-text-xs kb-text-slate-200 hover:kb-bg-slate-600 kb-px-2 kb-py-1 kb-rounded kb-transition-colors"
                      >
                        📊 Export as CSV
                      </button>
                      
                      <hr className="kb-border-slate-600 kb-my-2" />
                      
                      <div className="kb-text-xs kb-font-medium kb-text-slate-300 kb-mb-2">Management</div>
                      {selectedSession !== 'current' && (
                        <button
                          onClick={() => { handleDeleteSession(selectedSession); setShowExportMenu(false); }}
                          className="kb-w-full kb-text-left kb-text-xs kb-text-red-400 hover:kb-bg-slate-600 kb-px-2 kb-py-1 kb-rounded kb-transition-colors"
                        >
                          🗑️ Delete Session
                        </button>
                      )}
                      <button
                        onClick={() => { handleClearAllAnalytics(); setShowExportMenu(false); }}
                        className="kb-w-full kb-text-left kb-text-xs kb-text-red-400 hover:kb-bg-slate-600 kb-px-2 kb-py-1 kb-rounded kb-transition-colors"
                      >
                        🗑️ Clear All Data
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Historical Data Summary */}
        {showHistoricalData && historicalSessions.length > 0 && (
          <div className="kb-mt-4 kb-p-4 kb-bg-slate-800 kb-rounded-lg">
            <h4 className="kb-text-sm kb-font-medium kb-text-slate-300 kb-mb-2">Analytics History</h4>
            <div className="kb-text-xs kb-text-slate-400">
              <span>Total Sessions: {historicalSessions.length}</span>
              <span className="kb-mx-2">•</span>
              <span>Latest: {new Date(historicalSessions[0]?.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        )}

        <div className="kb-mt-6">
          {/* Summary Stats */}
          <div className="kb-grid kb-grid-cols-3 kb-gap-4">
            <div className="kb-text-center">
              <div className="kb-text-2xl kb-font-bold kb-text-purple-400">
                {activeOrchestrationLogs.length}
              </div>
              <div className="kb-text-xs kb-text-slate-400">Total Events</div>
            </div>
            <div className="kb-text-center">
              <div className="kb-text-2xl kb-font-bold kb-text-blue-400">
                {orchestrationInsights.decisionMaking.totalDecisions}
              </div>
              <div className="kb-text-xs kb-text-slate-400">Decisions</div>
            </div>
            <div className="kb-text-center">
              <div className="kb-text-2xl kb-font-bold kb-text-green-400">
                {orchestrationInsights.taskSelection.selectedTasks.size}
              </div>
              <div className="kb-text-xs kb-text-slate-400">Tasks Affected</div>
            </div>
          </div>

          {/* Insight Navigation */}
          <div className="kb-flex kb-space-x-1 kb-mt-6 kb-bg-slate-700 kb-rounded-lg kb-p-1">
          {insightTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedInsight(tab.id)}
              className={`kb-flex-1 kb-flex kb-items-center kb-justify-center kb-space-x-2 kb-px-4 kb-py-2 kb-text-sm kb-font-medium kb-rounded-md kb-transition-colors ${
                selectedInsight === tab.id
                  ? 'kb-bg-slate-600 kb-text-slate-200 kb-shadow-sm'
                  : 'kb-text-slate-400 hover:kb-text-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="kb-inline-flex kb-items-center kb-px-2 kb-py-0.5 kb-rounded-full kb-text-xs kb-bg-slate-600 kb-text-slate-300">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="kb-flex-1 kb-overflow-y-auto">
        {selectedInsight === 'decision-making' && (
          <DecisionMakingInsights insights={orchestrationInsights.decisionMaking} logs={activeOrchestrationLogs} />
        )}
        {selectedInsight === 'task-selection' && (
          <TaskSelectionInsights insights={orchestrationInsights.taskSelection} logs={activeOrchestrationLogs} />
        )}
        {selectedInsight === 'adaptation' && (
          <AdaptationInsights insights={orchestrationInsights.adaptation} logs={activeOrchestrationLogs} />
        )}
        {selectedInsight === 'generation' && (
          <GenerationInsights insights={orchestrationInsights.generation} logs={activeOrchestrationLogs} />
        )}
        {selectedInsight === 'strategy' && (
          <StrategyInsights insights={orchestrationInsights.strategy} logs={activeOrchestrationLogs} />
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
        <div className="kb-bg-blue-600/20 kb-border kb-border-blue-500/30 kb-rounded-lg kb-p-4">
          <div className="kb-text-sm kb-font-medium kb-text-slate-400">Task Selections</div>
          <div className="kb-text-2xl kb-font-semibold kb-text-blue-400">{insights.selectionDecisions}</div>
        </div>
        
        <div className="kb-bg-green-600/20 kb-border kb-border-green-500/30 kb-rounded-lg kb-p-4">
          <div className="kb-text-sm kb-font-medium kb-text-slate-400">Adaptations</div>
          <div className="kb-text-2xl kb-font-semibold kb-text-green-400">{insights.adaptationDecisions}</div>
        </div>
        
        <div className="kb-bg-purple-600/20 kb-border kb-border-purple-500/30 kb-rounded-lg kb-p-4">
          <div className="kb-text-sm kb-font-medium kb-text-slate-400">Generations</div>
          <div className="kb-text-2xl kb-font-semibold kb-text-purple-400">{insights.generationDecisions}</div>
        </div>
        
        <div className="kb-bg-orange-600/20 kb-border kb-border-orange-500/30 kb-rounded-lg kb-p-4">
          <div className="kb-text-sm kb-font-medium kb-text-slate-400">Strategy Changes</div>
          <div className="kb-text-2xl kb-font-semibold kb-text-orange-400">{insights.strategyChanges}</div>
        </div>
      </div>

      {/* Decision Timeline */}
      <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
        <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Recent Decisions</h3>
        
        <div className="kb-space-y-4">
          {decisionTimeline.map((decision, index) => (
            <div key={index} className="kb-flex kb-items-start kb-space-x-4 kb-p-4 kb-border kb-border-slate-700 kb-rounded-lg">
              <div className="kb-flex-shrink-0">
                <div className={`kb-w-8 kb-h-8 kb-rounded-full kb-flex kb-items-center kb-justify-center ${
                  decision.orchestrationEvent === 'TASK_SELECTION' ? 'kb-bg-blue-600/20' :
                  decision.orchestrationEvent === 'TASK_ADAPTATION' ? 'kb-bg-green-600/20' :
                  decision.orchestrationEvent === 'TASK_GENERATION' ? 'kb-bg-purple-600/20' :
                  'kb-bg-orange-600/20'
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
                  <h4 className="kb-text-sm kb-font-medium kb-text-slate-200">
                    {decision.orchestrationEvent.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                  </h4>
                  <span className="kb-text-xs kb-text-slate-400">
                    {new Date(decision.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="kb-text-sm kb-text-slate-300">{decision.logDescription}</p>
                {decision.metadata?.reason && (
                  <p className="kb-text-xs kb-text-slate-400 kb-mt-1">
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
        <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
          <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Selection Statistics</h3>
          
          <div className="kb-space-y-4">
            <div className="kb-flex kb-justify-between kb-items-center">
              <span className="kb-text-sm kb-font-medium kb-text-slate-300">Total Selections</span>
              <span className="kb-text-sm kb-text-slate-200 kb-font-semibold">{insights.totalSelections}</span>
            </div>
            
            <div className="kb-flex kb-justify-between kb-items-center">
              <span className="kb-text-sm kb-font-medium kb-text-slate-300">Unique Tasks Selected</span>
              <span className="kb-text-sm kb-text-slate-200 kb-font-semibold">{insights.selectedTasks.size}</span>
            </div>
          </div>
        </div>

        {/* Selection Reasons */}
        {Object.keys(insights.selectionReasons).length > 0 && (
          <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
            <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Selection Reasons</h3>
            
            <div className="kb-space-y-3">
              {Object.entries(insights.selectionReasons)
                .sort(([,a], [,b]) => b - a)
                .map(([reason, count]) => (
                <div key={reason} className="kb-flex kb-items-center kb-justify-between">
                  <span className="kb-text-sm kb-text-slate-300 kb-flex-1 kb-truncate" title={reason}>
                    {reason}
                  </span>
                  <div className="kb-flex kb-items-center kb-space-x-2 kb-ml-4">
                    <div className="kb-w-16 kb-bg-slate-700 kb-rounded-full kb-h-2">
                      <div 
                        className="kb-bg-blue-400 kb-h-2 kb-rounded-full" 
                        style={{ 
                          width: `${(count / Math.max(...Object.values(insights.selectionReasons))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="kb-text-sm kb-font-medium kb-text-slate-200 kb-w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Selections */}
      <div className="kb-mt-8 kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
        <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Recent Task Selections</h3>
        
        <div className="kb-space-y-3">
          {selectionLogs.slice(0, 5).map((log, index) => (
            <div key={index} className="kb-flex kb-items-center kb-space-x-4 kb-p-3 kb-bg-blue-600/20 kb-border kb-border-blue-500/30 kb-rounded-lg">
              <span className="kb-text-blue-400 kb-text-lg">🎯</span>
              <div className="kb-flex-1">
                <p className="kb-text-sm kb-font-medium kb-text-slate-200">{log.logDescription}</p>
                <p className="kb-text-xs kb-text-slate-400">
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
          <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
            <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Adaptation Types</h3>
            
            <div className="kb-space-y-3">
              {Object.entries(insights.adaptationTypes)
                .sort(([,a], [,b]) => b - a)
                .map(([type, count]) => (
                <div key={type} className="kb-flex kb-items-center kb-justify-between">
                  <span className="kb-text-sm kb-text-slate-300 kb-capitalize">
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-bg-green-600/20 kb-text-green-400 kb-border kb-border-green-500/30">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Adaptation Reasons */}
        {Object.keys(insights.adaptationReasons).length > 0 && (
          <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
            <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Adaptation Triggers</h3>
            
            <div className="kb-space-y-3">
              {Object.entries(insights.adaptationReasons)
                .sort(([,a], [,b]) => b - a)
                .map(([reason, count]) => (
                <div key={reason} className="kb-flex kb-items-center kb-justify-between">
                  <span className="kb-text-sm kb-text-slate-300 kb-flex-1 kb-truncate" title={reason}>
                    {reason}
                  </span>
                  <span className="kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-bg-yellow-600/20 kb-text-yellow-400 kb-border kb-border-yellow-500/30">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Adaptations */}
      <div className="kb-mt-8 kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
        <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Recent Adaptations</h3>
        
        <div className="kb-space-y-3">
          {adaptationLogs.slice(0, 5).map((log, index) => (
            <div key={index} className="kb-flex kb-items-center kb-space-x-4 kb-p-3 kb-bg-green-600/20 kb-border kb-border-green-500/30 kb-rounded-lg">
              <span className="kb-text-green-400 kb-text-lg">🔄</span>
              <div className="kb-flex-1">
                <p className="kb-text-sm kb-font-medium kb-text-slate-200">{log.logDescription}</p>
                <p className="kb-text-xs kb-text-slate-400">
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
          <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
            <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Generation Triggers</h3>
            
            <div className="kb-space-y-3">
              {Object.entries(insights.generationTriggers)
                .sort(([,a], [,b]) => b - a)
                .map(([trigger, count]) => (
                <div key={trigger} className="kb-flex kb-items-center kb-justify-between">
                  <span className="kb-text-sm kb-text-slate-300 kb-capitalize">
                    {trigger.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-bg-purple-600/20 kb-text-purple-400 kb-border kb-border-purple-500/30">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Rate */}
        <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
          <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Generation Success</h3>
          
          <div className="kb-space-y-4">
            <div className="kb-flex kb-justify-between kb-items-center">
              <span className="kb-text-sm kb-font-medium kb-text-slate-300">Total Attempts</span>
              <span className="kb-text-sm kb-text-slate-200 kb-font-semibold">{insights.totalGenerations}</span>
            </div>
            
            <div className="kb-flex kb-justify-between kb-items-center">
              <span className="kb-text-sm kb-font-medium kb-text-slate-300">Successful</span>
              <span className="kb-text-sm kb-text-slate-200 kb-font-semibold">{insights.generationSuccess}</span>
            </div>
            
            {insights.totalGenerations > 0 && (
              <div className="kb-flex kb-justify-between kb-items-center">
                <span className="kb-text-sm kb-font-medium kb-text-slate-300">Success Rate</span>
                <span className="kb-text-sm kb-text-green-400 kb-font-semibold">
                  {Math.round((insights.generationSuccess / insights.totalGenerations) * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Generations */}
      <div className="kb-mt-8 kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
        <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Recent Task Generations</h3>
        
        <div className="kb-space-y-3">
          {generationLogs.slice(0, 5).map((log, index) => (
            <div key={index} className="kb-flex kb-items-center kb-space-x-4 kb-p-3 kb-bg-purple-600/20 kb-border kb-border-purple-500/30 kb-rounded-lg">
              <span className="kb-text-purple-400 kb-text-lg">✨</span>
              <div className="kb-flex-1">
                <p className="kb-text-sm kb-font-medium kb-text-slate-200">{log.logDescription}</p>
                <p className="kb-text-xs kb-text-slate-400">
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
        <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
          <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Strategy Overview</h3>
          
          <div className="kb-space-y-4">
            {insights.currentStrategy && (
              <div className="kb-flex kb-justify-between kb-items-center">
                <span className="kb-text-sm kb-font-medium kb-text-slate-300">Current Strategy</span>
                <span className="kb-inline-flex kb-items-center kb-px-3 kb-py-1 kb-rounded-full kb-text-sm kb-font-medium kb-bg-blue-600/20 kb-text-blue-400 kb-border kb-border-blue-500/30">
                  {insights.currentStrategy}
                </span>
              </div>
            )}
            
            <div className="kb-flex kb-justify-between kb-items-center">
              <span className="kb-text-sm kb-font-medium kb-text-slate-300">Strategy Changes</span>
              <span className="kb-text-sm kb-text-slate-200 kb-font-semibold">{insights.strategyChanges}</span>
            </div>
          </div>
        </div>

        {/* Mode Distribution */}
        {Object.keys(insights.modeDistribution).length > 0 && (
          <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
            <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Mode Distribution</h3>
            
            <div className="kb-space-y-3">
              {Object.entries(insights.modeDistribution)
                .sort(([,a], [,b]) => b - a)
                .map(([mode, count]) => (
                <div key={mode} className="kb-flex kb-items-center kb-justify-between">
                  <span className="kb-text-sm kb-text-slate-300 kb-capitalize">
                    {mode}
                  </span>
                  <span className="kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-bg-orange-600/20 kb-text-orange-400 kb-border kb-border-orange-500/30">
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
        <div className="kb-mt-8 kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
          <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Strategy Evolution</h3>
          
          <div className="kb-space-y-4">
            {insights.strategyHistory.slice(0, 5).map((change, index) => (
              <div key={index} className="kb-flex kb-items-start kb-space-x-4 kb-p-3 kb-bg-orange-600/20 kb-border kb-border-orange-500/30 kb-rounded-lg">
                <span className="kb-text-orange-400 kb-text-lg">📊</span>
                <div className="kb-flex-1">
                  <div className="kb-flex kb-items-center kb-space-x-2 kb-mb-1">
                    <span className="kb-text-sm kb-font-medium kb-text-slate-200">
                      Changed to: {change.strategy}
                    </span>
                    <span className="kb-text-xs kb-text-slate-400">
                      {new Date(change.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {change.reason && (
                    <p className="kb-text-xs kb-text-slate-300">
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