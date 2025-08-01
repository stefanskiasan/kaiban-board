import React, { useState, useMemo } from 'react';
import { 
  analyzeErrorPatterns, 
  analyzePerformanceMetrics, 
  analyzeTaskFlows, 
  categorizeLogs,
  getLogSeverityLevel,
  identifyBottlenecks
} from '../../utils/orchestrationHelper';
import { usePerformanceLogging } from '../../utils/performanceIntegration';

// Dashboard Tab Components
import DashboardHeader from './DashboardHeader';
import ErrorAnalysisTab from './ErrorAnalysisTab';
import TaskJourneyTab from './TaskJourneyTab';
import PerformanceTab from './PerformanceTab';
import LogsTimelineTab from './LogsTimelineTab';
import OrchestrationInsightsTab from './OrchestrationInsightsTab';

const OrchestrationDashboard = ({ workflowLogs = [] }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  
  // Access real-time performance data
  const performanceLogging = usePerformanceLogging();
  const livePerformanceStats = performanceLogging.getPerformanceStats();
  const liveLogs = performanceLogging.getLiveLogs();

  // Pre-process all log data for dashboard
  const dashboardData = useMemo(() => {
    // Combine workflow logs with real-time performance logs
    const allLogs = [
      ...(Array.isArray(workflowLogs) ? workflowLogs : []),
      ...(Array.isArray(liveLogs) ? liveLogs : [])
    ];
    
    if (allLogs.length === 0) {
      return {
        totalLogs: 0,
        errorAnalysis: null,
        performanceMetrics: null,
        taskFlows: null,
        categorizedLogs: { critical: [], high: [], medium: [], low: [], info: [] },
        orchestrationLogs: [],
        summary: { 
          errors: 0, 
          warnings: 0, 
          tasks: 0, 
          agents: 0,
          totalCost: livePerformanceStats?.totalCost || 0,
          totalTokens: Object.values(livePerformanceStats?.tokenStats || {})
            .reduce((sum, stats) => sum + (stats.inputTokens || 0) + (stats.outputTokens || 0), 0),
          sessionDuration: livePerformanceStats?.sessionDuration || 0
        }
      };
    }

    // Analyze all aspects of the logs (including real performance data)
    const errorAnalysis = analyzeErrorPatterns(allLogs);
    const performanceMetrics = analyzePerformanceMetrics(allLogs);
    const taskFlows = analyzeTaskFlows(allLogs);
    const categorizedLogs = categorizeLogs(allLogs);
    
    // Filter orchestration-specific logs
    const orchestrationLogs = allLogs.filter(log => 
      log.logType === 'OrchestrationStatusUpdate'
    );

    // Generate summary statistics with real performance data
    const summary = {
      errors: allLogs.filter(log => getLogSeverityLevel(log) === 'critical').length,
      warnings: allLogs.filter(log => getLogSeverityLevel(log) === 'high').length,
      tasks: new Set(allLogs
        .filter(log => log.task?.id)
        .map(log => log.task.id)
      ).size,
      agents: new Set(allLogs
        .filter(log => log.agent?.id || log.agentId)
        .map(log => log.agent?.id || log.agentId)
      ).size,
      orchestrationEvents: orchestrationLogs.length,
      totalDuration: performanceMetrics?.totalWorkflowDuration || livePerformanceStats?.sessionDuration || 0,
      totalCost: performanceMetrics?.totalCost || livePerformanceStats?.totalCost || 0,
      totalTokens: performanceMetrics?.totalTokensUsed || 
        Object.values(livePerformanceStats?.tokenStats || {})
          .reduce((sum, stats) => sum + (stats.inputTokens || 0) + (stats.outputTokens || 0), 0)
    };

    return {
      totalLogs: allLogs.length,
      errorAnalysis,
      performanceMetrics,
      taskFlows,
      categorizedLogs,
      orchestrationLogs,
      summary,
      livePerformanceStats // Include real-time stats
    };
  }, [workflowLogs, liveLogs, livePerformanceStats]);

  // Filter logs based on time range and search
  const filteredLogs = useMemo(() => {
    // Use combined logs for filtering
    let filtered = [
      ...(Array.isArray(workflowLogs) ? workflowLogs : []),
      ...(Array.isArray(liveLogs) ? liveLogs : [])
    ];

    // Apply time range filter
    if (selectedTimeRange !== 'all' && filtered.length > 0) {
      const now = Date.now();
      const timeRanges = {
        '1h': 60 * 60 * 1000,
        '6h': 6 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000
      };
      
      const cutoff = now - timeRanges[selectedTimeRange];
      filtered = filtered.filter(log => log.timestamp >= cutoff);
    }

    // Apply search filter
    if (searchFilter.trim()) {
      const searchTerm = searchFilter.toLowerCase();
      filtered = filtered.filter(log => 
        log.logDescription?.toLowerCase().includes(searchTerm) ||
        log.orchestrationEvent?.toLowerCase().includes(searchTerm) ||
        log.task?.title?.toLowerCase().includes(searchTerm) ||
        log.agent?.name?.toLowerCase().includes(searchTerm) ||
        log.metadata?.message?.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }, [workflowLogs, liveLogs, selectedTimeRange, searchFilter]);

  // Tab configuration with dark theme design
  const tabs = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: '📊',
      count: dashboardData.totalLogs
    },
    { 
      id: 'errors', 
      label: 'Errors', 
      icon: '🚨', 
      count: dashboardData.summary.errors,
      color: dashboardData.summary.errors > 0 ? 'kb-text-red-400' : 'kb-text-slate-500'
    },
    { 
      id: 'tasks', 
      label: 'Task Journey', 
      icon: '🎯', 
      count: dashboardData.summary.tasks
    },
    { 
      id: 'performance', 
      label: 'Performance', 
      icon: '⚡', 
      count: dashboardData.orchestrationLogs.length
    },
    { 
      id: 'timeline', 
      label: 'Timeline', 
      icon: '📈', 
      count: filteredLogs.length
    },
    { 
      id: 'insights', 
      label: 'AI Insights', 
      icon: '🧠', 
      count: dashboardData.orchestrationLogs.length
    }
  ];

  return (
    <div className="kb-flex kb-flex-col kb-h-full kb-bg-slate-900">
      
      {/* Dashboard Header - Integrated Design */}
      <div className="kb-border-b kb-border-slate-700 kb-bg-slate-900">
        <div className="kb-flex kb-items-center kb-justify-between kb-px-6 kb-py-4">
          <div className="kb-flex kb-items-center kb-gap-3">
            <div className="kb-flex kb-items-center kb-justify-center kb-w-8 kb-h-8 kb-bg-blue-600 kb-rounded-lg">
              <span className="kb-text-white kb-text-sm kb-font-semibold">📊</span>
            </div>
            <div>
              <h2 className="kb-text-lg kb-font-semibold kb-text-slate-200">
                Orchestration Analytics
              </h2>
              <p className="kb-text-sm kb-text-slate-400">
                {dashboardData.totalLogs} events • {dashboardData.summary.tasks} tasks • {dashboardData.summary.agents} agents
              </p>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="kb-flex kb-items-center kb-gap-6">
            <div className="kb-text-center">
              <div className="kb-text-2xl kb-font-bold kb-text-green-400">
                {dashboardData.summary.tasks}
              </div>
              <div className="kb-text-xs kb-text-slate-400">Tasks</div>
            </div>
            <div className="kb-text-center">
              <div className="kb-text-2xl kb-font-bold kb-text-blue-400">
                {dashboardData.summary.agents}
              </div>
              <div className="kb-text-xs kb-text-slate-400">Agents</div>
            </div>
            <div className="kb-text-center">
              <div className={`kb-text-2xl kb-font-bold ${
                dashboardData.summary.errors > 0 ? 'kb-text-red-400' : 'kb-text-slate-400'
              }`}>
                {dashboardData.summary.errors}
              </div>
              <div className="kb-text-xs kb-text-slate-400">Errors</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="kb-flex kb-items-center kb-justify-between kb-px-6 kb-pb-4">
          {/* Time Range Filter */}
          <div className="kb-flex kb-items-center kb-gap-2">
            <span className="kb-text-sm kb-text-slate-400">Time Range:</span>
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="kb-bg-slate-800 kb-text-slate-300 kb-border kb-border-slate-600 kb-rounded kb-px-2 kb-py-1 kb-text-sm focus:kb-outline-none focus:kb-border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>

          {/* Search Filter */}
          <div className="kb-flex kb-items-center kb-gap-2">
            <span className="kb-text-sm kb-text-slate-400">Search:</span>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter logs..."
              className="kb-bg-slate-800 kb-text-slate-300 kb-border kb-border-slate-600 kb-rounded kb-px-3 kb-py-1 kb-text-sm kb-w-64 focus:kb-outline-none focus:kb-border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation - Dark Theme */}
      <div className="kb-border-b kb-border-slate-700 kb-bg-slate-900">
        <nav className="kb-flex kb-px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`kb-py-4 kb-px-4 kb-border-b-2 kb-font-medium kb-text-sm kb-flex kb-items-center kb-space-x-2 kb-transition-colors ${
                activeTab === tab.id
                  ? 'kb-border-blue-500 kb-text-blue-400'
                  : 'kb-border-transparent kb-text-slate-400 hover:kb-text-slate-300 hover:kb-border-slate-600'
              }`}
            >
              <span className="kb-text-base">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`kb-inline-flex kb-items-center kb-px-2 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-bg-slate-800 ${
                  tab.color || 'kb-text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content - Full Height */}
      <div className="kb-flex-1 kb-overflow-hidden kb-bg-slate-900">
        {activeTab === 'overview' && (
          <OverviewTab 
            dashboardData={dashboardData}
            filteredLogs={filteredLogs}
          />
        )}
        
        {activeTab === 'errors' && (
          <ErrorAnalysisTab 
            errorAnalysis={dashboardData.errorAnalysis}
            workflowLogs={filteredLogs}
          />
        )}
        
        {activeTab === 'tasks' && (
          <TaskJourneyTab 
            taskFlows={dashboardData.taskFlows}
            workflowLogs={filteredLogs}
          />
        )}
        
        {activeTab === 'performance' && (
          <PerformanceTab 
            performanceMetrics={dashboardData.performanceMetrics}
            workflowLogs={filteredLogs}
          />
        )}
        
        {activeTab === 'timeline' && (
          <LogsTimelineTab 
            workflowLogs={filteredLogs}
            categorizedLogs={dashboardData.categorizedLogs}
          />
        )}
        
        {activeTab === 'insights' && (
          <OrchestrationInsightsTab 
            orchestrationLogs={dashboardData.orchestrationLogs}
            workflowLogs={filteredLogs}
            performanceMetrics={dashboardData.performanceMetrics}
          />
        )}
      </div>
    </div>
  );
};

// Overview Tab Component - Dark Theme
const OverviewTab = ({ dashboardData, filteredLogs }) => {
  const { summary, errorAnalysis, performanceMetrics, taskFlows } = dashboardData;

  return (
    <div className="kb-p-6 kb-overflow-y-auto kb-h-full kb-bg-slate-900">
      
      {/* Summary Cards - Dark Theme */}
      <div className="kb-grid kb-grid-cols-1 md:kb-grid-cols-2 lg:kb-grid-cols-4 kb-gap-6 kb-mb-8">
        
        {/* Total Events */}
        <div className="kb-bg-slate-900 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
          <div className="kb-flex kb-items-center">
            <div className="kb-flex-shrink-0">
              <div className="kb-w-8 kb-h-8 kb-bg-blue-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                <span className="kb-text-white kb-text-sm">📊</span>
              </div>
            </div>
            <div className="kb-ml-4">
              <div className="kb-text-sm kb-font-medium kb-text-slate-400">Total Events</div>
              <div className="kb-text-2xl kb-font-semibold kb-text-slate-200">{dashboardData.totalLogs}</div>
            </div>
          </div>
        </div>

        {/* Errors */}
        <div className="kb-bg-slate-900 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
          <div className="kb-flex kb-items-center">
            <div className="kb-flex-shrink-0">
              <div className="kb-w-8 kb-h-8 kb-bg-red-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                <span className="kb-text-white kb-text-sm">🚨</span>
              </div>
            </div>
            <div className="kb-ml-4">
              <div className="kb-text-sm kb-font-medium kb-text-slate-400">Errors</div>
              <div className="kb-text-2xl kb-font-semibold kb-text-red-400">{summary.errors}</div>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="kb-bg-slate-900 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
          <div className="kb-flex kb-items-center">
            <div className="kb-flex-shrink-0">
              <div className="kb-w-8 kb-h-8 kb-bg-green-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                <span className="kb-text-white kb-text-sm">🎯</span>
              </div>
            </div>
            <div className="kb-ml-4">
              <div className="kb-text-sm kb-font-medium kb-text-slate-400">Tasks</div>
              <div className="kb-text-2xl kb-font-semibold kb-text-green-400">{summary.tasks}</div>
            </div>
          </div>
        </div>

        {/* Cost */}
        <div className="kb-bg-slate-900 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
          <div className="kb-flex kb-items-center">
            <div className="kb-flex-shrink-0">
              <div className="kb-w-8 kb-h-8 kb-bg-purple-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                <span className="kb-text-white kb-text-sm">💰</span>
              </div>
            </div>
            <div className="kb-ml-4">
              <div className="kb-text-sm kb-font-medium kb-text-slate-400">Total Cost</div>
              <div className="kb-text-2xl kb-font-semibold kb-text-purple-400">
                ${summary.totalCost?.toFixed(4) || '0.0000'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Insights - Dark Theme */}
      <div className="kb-grid kb-grid-cols-1 lg:kb-grid-cols-2 kb-gap-8">
        
        {/* Error Patterns */}
        {errorAnalysis && errorAnalysis.errorsByCategory && Object.keys(errorAnalysis.errorsByCategory).length > 0 && (
          <div className="kb-bg-slate-900 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
            <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Error Patterns</h3>
            
            <div className="kb-space-y-3">
              {Object.entries(errorAnalysis.errorsByCategory).map(([category, errors]) => (
                <div key={category} className="kb-flex kb-justify-between kb-items-center">
                  <span className="kb-text-sm kb-font-medium kb-text-slate-300 kb-capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-bg-red-600 kb-text-red-100">
                    {errors.length}
                  </span>
                </div>
              ))}
            </div>

            {errorAnalysis.suggestedFixes && errorAnalysis.suggestedFixes.length > 0 && (
              <div className="kb-mt-4 kb-pt-4 kb-border-t kb-border-slate-700">
                <h4 className="kb-text-sm kb-font-medium kb-text-slate-200 kb-mb-2">Suggested Fixes</h4>
                <ul className="kb-text-sm kb-text-slate-400 kb-space-y-1">
                  {errorAnalysis.suggestedFixes.slice(0, 3).map((fix, index) => (
                    <li key={index} className="kb-flex kb-items-start">
                      <span className="kb-text-green-400 kb-mr-2">•</span>
                      {fix}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Performance Overview */}
        {performanceMetrics && (
          <div className="kb-bg-slate-900 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
            <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Performance Overview</h3>
            
            <div className="kb-space-y-4">
              {performanceMetrics.averageTaskDuration && (
                <div className="kb-flex kb-justify-between kb-items-center">
                  <span className="kb-text-sm kb-font-medium kb-text-slate-300">Avg Task Duration</span>
                  <span className="kb-text-sm kb-text-slate-200">
                    {(performanceMetrics.averageTaskDuration / 1000).toFixed(1)}s
                  </span>
                </div>
              )}
              
              {performanceMetrics.totalTokensUsed && (
                <div className="kb-flex kb-justify-between kb-items-center">
                  <span className="kb-text-sm kb-font-medium kb-text-slate-300">Total Tokens</span>
                  <span className="kb-text-sm kb-text-slate-200">
                    {performanceMetrics.totalTokensUsed.toLocaleString()}
                  </span>
                </div>
              )}
              
              {performanceMetrics.orchestrationOverhead && (
                <div className="kb-flex kb-justify-between kb-items-center">
                  <span className="kb-text-sm kb-font-medium kb-text-slate-300">Orchestration Overhead</span>
                  <span className="kb-text-sm kb-text-slate-200">
                    {(performanceMetrics.orchestrationOverhead * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>

            {performanceMetrics.bottlenecks && performanceMetrics.bottlenecks.length > 0 && (
              <div className="kb-mt-4 kb-pt-4 kb-border-t kb-border-slate-700">
                <h4 className="kb-text-sm kb-font-medium kb-text-slate-200 kb-mb-2">Performance Bottlenecks</h4>
                <div className="kb-space-y-2">
                  {performanceMetrics.bottlenecks.slice(0, 3).map((bottleneck, index) => (
                    <div key={index} className="kb-text-sm kb-text-amber-300 kb-bg-amber-600/20 kb-px-3 kb-py-2 kb-rounded">
                      {bottleneck.type}: {bottleneck.description}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Activity - Dark Theme */}
      <div className="kb-mt-8">
        <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Recent Activity</h3>
        <div className="kb-bg-slate-900 kb-border kb-border-slate-700 kb-rounded-lg">
          <div className="kb-max-h-64 kb-overflow-y-auto">
            {filteredLogs.slice(0, 10).map((log, index) => (
              <div key={index} className="kb-px-6 kb-py-3 kb-border-b kb-border-slate-700 last:kb-border-b-0">
                <div className="kb-flex kb-items-center kb-justify-between">
                  <div className="kb-flex kb-items-center kb-space-x-3">
                    <span className="kb-text-sm">
                      {log.logType === 'OrchestrationStatusUpdate' && '🧠'}
                      {log.logType === 'TaskStatusUpdate' && '🎯'}
                      {log.logType === 'AgentStatusUpdate' && '🤖'}
                      {log.logType === 'WorkflowStatusUpdate' && '🔄'}
                    </span>
                    <span className="kb-text-sm kb-text-slate-200 kb-truncate">
                      {log.logDescription}
                    </span>
                  </div>
                  <span className="kb-text-xs kb-text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrchestrationDashboard;