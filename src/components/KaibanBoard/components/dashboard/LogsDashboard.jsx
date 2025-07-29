import React, { useState, useMemo } from 'react';
import { 
  analyzeErrorPatterns, 
  analyzePerformanceMetrics, 
  analyzeTaskFlows, 
  categorizeLogs,
  getLogSeverityLevel,
  identifyBottlenecks
} from '../../utils/orchestrationHelper';

// Dashboard Tab Components
import DashboardHeader from './DashboardHeader';
import ErrorAnalysisTab from './ErrorAnalysisTab';
import TaskJourneyTab from './TaskJourneyTab';
import PerformanceTab from './PerformanceTab';
import LogsTimelineTab from './LogsTimelineTab';
import OrchestrationInsightsTab from './OrchestrationInsightsTab';

const LogsDashboard = ({ workflowLogs = [], isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Pre-process all log data for dashboard
  const dashboardData = useMemo(() => {
    if (!Array.isArray(workflowLogs) || workflowLogs.length === 0) {
      return {
        totalLogs: 0,
        errorAnalysis: null,
        performanceMetrics: null,
        taskFlows: null,
        categorizedLogs: { critical: [], high: [], medium: [], low: [], info: [] },
        orchestrationLogs: [],
        summary: { errors: 0, warnings: 0, tasks: 0, agents: 0 }
      };
    }

    // Analyze all aspects of the logs
    const errorAnalysis = analyzeErrorPatterns(workflowLogs);
    const performanceMetrics = analyzePerformanceMetrics(workflowLogs);
    const taskFlows = analyzeTaskFlows(workflowLogs);
    const categorizedLogs = categorizeLogs(workflowLogs);
    
    // Filter orchestration-specific logs
    const orchestrationLogs = workflowLogs.filter(log => 
      log.logType === 'OrchestrationStatusUpdate'
    );

    // Generate summary statistics
    const summary = {
      errors: workflowLogs.filter(log => getLogSeverityLevel(log) === 'critical').length,
      warnings: workflowLogs.filter(log => getLogSeverityLevel(log) === 'high').length,
      tasks: new Set(workflowLogs
        .filter(log => log.task?.id)
        .map(log => log.task.id)
      ).size,
      agents: new Set(workflowLogs
        .filter(log => log.agent?.id || log.agentId)
        .map(log => log.agent?.id || log.agentId)
      ).size,
      orchestrationEvents: orchestrationLogs.length,
      totalDuration: performanceMetrics?.totalWorkflowDuration || 0,
      totalCost: performanceMetrics?.totalCost || 0
    };

    return {
      totalLogs: workflowLogs.length,
      errorAnalysis,
      performanceMetrics,
      taskFlows,
      categorizedLogs,
      orchestrationLogs,
      summary
    };
  }, [workflowLogs]);

  // Filter logs based on time range and search
  const filteredLogs = useMemo(() => {
    let filtered = workflowLogs;

    // Apply time range filter
    if (selectedTimeRange !== 'all' && workflowLogs.length > 0) {
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
  }, [workflowLogs, selectedTimeRange, searchFilter]);

  // Tab configuration
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
      color: dashboardData.summary.errors > 0 ? 'text-red-600' : 'text-gray-500'
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 kb-bg-black kb-bg-opacity-50 kb-flex kb-items-center kb-justify-center kb-z-50">
      <div className="kb-bg-white kb-rounded-lg kb-shadow-xl kb-w-full kb-h-full kb-max-w-7xl kb-max-h-[90vh] kb-flex kb-flex-col">
        
        {/* Dashboard Header */}
        <DashboardHeader 
          onClose={onClose}
          summary={dashboardData.summary}
          selectedTimeRange={selectedTimeRange}
          onTimeRangeChange={setSelectedTimeRange}
          searchFilter={searchFilter}
          onSearchChange={setSearchFilter}
          totalLogs={dashboardData.totalLogs}
        />

        {/* Tab Navigation */}
        <div className="kb-border-b kb-border-gray-200 kb-px-6">
          <nav className="kb-flex kb-space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`kb-py-4 kb-px-1 kb-border-b-2 kb-font-medium kb-text-sm kb-flex kb-items-center kb-space-x-2 kb-transition-colors ${
                  activeTab === tab.id
                    ? 'kb-border-blue-500 kb-text-blue-600'
                    : 'kb-border-transparent kb-text-gray-500 hover:kb-text-gray-700 hover:kb-border-gray-300'
                }`}
              >
                <span className="kb-text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-bg-gray-100 ${
                    tab.color || 'kb-text-gray-800'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="kb-flex-1 kb-overflow-hidden">
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
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ dashboardData, filteredLogs }) => {
  const { summary, errorAnalysis, performanceMetrics, taskFlows } = dashboardData;

  return (
    <div className="kb-p-6 kb-overflow-y-auto kb-h-full">
      
      {/* Summary Cards */}
      <div className="kb-grid kb-grid-cols-1 md:kb-grid-cols-2 lg:kb-grid-cols-4 kb-gap-6 kb-mb-8">
        
        {/* Total Events */}
        <div className="kb-bg-blue-50 kb-rounded-lg kb-p-6">
          <div className="kb-flex kb-items-center">
            <div className="kb-flex-shrink-0">
              <div className="kb-w-8 kb-h-8 kb-bg-blue-100 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                <span className="kb-text-blue-600 kb-text-sm">📊</span>
              </div>
            </div>
            <div className="kb-ml-4">
              <div className="kb-text-sm kb-font-medium kb-text-gray-500">Total Events</div>
              <div className="kb-text-2xl kb-font-semibold kb-text-gray-900">{dashboardData.totalLogs}</div>
            </div>
          </div>
        </div>

        {/* Errors */}
        <div className="kb-bg-red-50 kb-rounded-lg kb-p-6">
          <div className="kb-flex kb-items-center">
            <div className="kb-flex-shrink-0">
              <div className="kb-w-8 kb-h-8 kb-bg-red-100 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                <span className="kb-text-red-600 kb-text-sm">🚨</span>
              </div>
            </div>
            <div className="kb-ml-4">
              <div className="kb-text-sm kb-font-medium kb-text-gray-500">Errors</div>
              <div className="kb-text-2xl kb-font-semibold kb-text-gray-900">{summary.errors}</div>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="kb-bg-green-50 kb-rounded-lg kb-p-6">
          <div className="kb-flex kb-items-center">
            <div className="kb-flex-shrink-0">
              <div className="kb-w-8 kb-h-8 kb-bg-green-100 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                <span className="kb-text-green-600 kb-text-sm">🎯</span>
              </div>
            </div>
            <div className="kb-ml-4">
              <div className="kb-text-sm kb-font-medium kb-text-gray-500">Tasks</div>
              <div className="kb-text-2xl kb-font-semibold kb-text-gray-900">{summary.tasks}</div>
            </div>
          </div>
        </div>

        {/* Cost */}
        <div className="kb-bg-purple-50 kb-rounded-lg kb-p-6">
          <div className="kb-flex kb-items-center">
            <div className="kb-flex-shrink-0">
              <div className="kb-w-8 kb-h-8 kb-bg-purple-100 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                <span className="kb-text-purple-600 kb-text-sm">💰</span>
              </div>
            </div>
            <div className="kb-ml-4">
              <div className="kb-text-sm kb-font-medium kb-text-gray-500">Total Cost</div>
              <div className="kb-text-2xl kb-font-semibold kb-text-gray-900">
                ${summary.totalCost?.toFixed(4) || '0.0000'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="kb-grid kb-grid-cols-1 lg:kb-grid-cols-2 kb-gap-8">
        
        {/* Error Patterns */}
        {errorAnalysis && errorAnalysis.errorsByCategory && Object.keys(errorAnalysis.errorsByCategory).length > 0 && (
          <div className="kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg kb-p-6">
            <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Error Patterns</h3>
            
            <div className="kb-space-y-3">
              {Object.entries(errorAnalysis.errorsByCategory).map(([category, errors]) => (
                <div key={category} className="kb-flex kb-justify-between kb-items-center">
                  <span className="kb-text-sm kb-font-medium kb-text-gray-700 kb-capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-bg-red-100 kb-text-red-800">
                    {errors.length}
                  </span>
                </div>
              ))}
            </div>

            {errorAnalysis.suggestedFixes && errorAnalysis.suggestedFixes.length > 0 && (
              <div className="kb-mt-4 kb-pt-4 kb-border-t kb-border-gray-200">
                <h4 className="kb-text-sm kb-font-medium kb-text-gray-900 kb-mb-2">Suggested Fixes</h4>
                <ul className="kb-text-sm kb-text-gray-600 kb-space-y-1">
                  {errorAnalysis.suggestedFixes.slice(0, 3).map((fix, index) => (
                    <li key={index} className="kb-flex kb-items-start">
                      <span className="kb-text-green-500 kb-mr-2">•</span>
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
          <div className="kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg kb-p-6">
            <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Performance Overview</h3>
            
            <div className="kb-space-y-4">
              {performanceMetrics.averageTaskDuration && (
                <div className="kb-flex kb-justify-between kb-items-center">
                  <span className="kb-text-sm kb-font-medium kb-text-gray-700">Avg Task Duration</span>
                  <span className="kb-text-sm kb-text-gray-900">
                    {(performanceMetrics.averageTaskDuration / 1000).toFixed(1)}s
                  </span>
                </div>
              )}
              
              {performanceMetrics.totalTokensUsed && (
                <div className="kb-flex kb-justify-between kb-items-center">
                  <span className="kb-text-sm kb-font-medium kb-text-gray-700">Total Tokens</span>
                  <span className="kb-text-sm kb-text-gray-900">
                    {performanceMetrics.totalTokensUsed.toLocaleString()}
                  </span>
                </div>
              )}
              
              {performanceMetrics.orchestrationOverhead && (
                <div className="kb-flex kb-justify-between kb-items-center">
                  <span className="kb-text-sm kb-font-medium kb-text-gray-700">Orchestration Overhead</span>
                  <span className="kb-text-sm kb-text-gray-900">
                    {(performanceMetrics.orchestrationOverhead * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>

            {performanceMetrics.bottlenecks && performanceMetrics.bottlenecks.length > 0 && (
              <div className="kb-mt-4 kb-pt-4 kb-border-t kb-border-gray-200">
                <h4 className="kb-text-sm kb-font-medium kb-text-gray-900 kb-mb-2">Performance Bottlenecks</h4>
                <div className="kb-space-y-2">
                  {performanceMetrics.bottlenecks.slice(0, 3).map((bottleneck, index) => (
                    <div key={index} className="kb-text-sm kb-text-amber-700 kb-bg-amber-50 kb-px-3 kb-py-2 kb-rounded">
                      {bottleneck.type}: {bottleneck.description}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="kb-mt-8">
        <h3 className="kb-text-lg kb-font-semibold kb-text-gray-900 kb-mb-4">Recent Activity</h3>
        <div className="kb-bg-white kb-border kb-border-gray-200 kb-rounded-lg">
          <div className="kb-max-h-64 kb-overflow-y-auto">
            {filteredLogs.slice(0, 10).map((log, index) => (
              <div key={index} className="kb-px-6 kb-py-3 kb-border-b kb-border-gray-100 last:kb-border-b-0">
                <div className="kb-flex kb-items-center kb-justify-between">
                  <div className="kb-flex kb-items-center kb-space-x-3">
                    <span className="kb-text-sm">
                      {log.logType === 'OrchestrationStatusUpdate' && '🧠'}
                      {log.logType === 'TaskStatusUpdate' && '🎯'}
                      {log.logType === 'AgentStatusUpdate' && '🤖'}
                      {log.logType === 'WorkflowStatusUpdate' && '🔄'}
                    </span>
                    <span className="kb-text-sm kb-text-gray-900 kb-truncate">
                      {log.logDescription}
                    </span>
                  </div>
                  <span className="kb-text-xs kb-text-gray-500">
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

export default LogsDashboard;