import React, { useState } from 'react';

const PerformanceTab = ({ performanceMetrics, workflowLogs = [] }) => {
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // If no performance data, show empty state
  if (!performanceMetrics) {
    return (
      <div className="kb-p-6 kb-h-full kb-flex kb-items-center kb-justify-center kb-bg-slate-950">
        <div className="kb-text-center">
          <div className="kb-w-16 kb-h-16 kb-bg-slate-800 kb-rounded-full kb-flex kb-items-center kb-justify-center kb-mx-auto kb-mb-4">
            <span className="kb-text-2xl">⚡</span>
          </div>
          <h3 className="kb-text-lg kb-font-medium kb-text-slate-200 kb-mb-2">No Performance Data</h3>
          <p className="kb-text-slate-400">
            No performance metrics available for analysis.
          </p>
        </div>
      </div>
    );
  }

  const formatDuration = (ms) => {
    if (!ms || ms < 1000) return '<1s';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatTokens = (tokens) => {
    if (!tokens) return '0';
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`;
    return tokens.toString();
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 0.8) return 'kb-text-green-400';
    if (efficiency >= 0.6) return 'kb-text-yellow-400';
    return 'kb-text-red-400';
  };

  const getEfficiencyBgColor = (efficiency) => {
    if (efficiency >= 0.8) return 'kb-bg-green-600/20 kb-border-green-500/30';
    if (efficiency >= 0.6) return 'kb-bg-yellow-600/20 kb-border-yellow-500/30';
    return 'kb-bg-red-600/20 kb-border-red-500/30';
  };

  return (
    <div className="kb-h-full kb-flex kb-flex-col kb-bg-slate-950">
      
      {/* Header */}
      <div className="kb-p-6 kb-border-b kb-border-slate-700">
        <div className="kb-flex kb-items-center kb-justify-between">
          <div>
            <h2 className="kb-text-xl kb-font-semibold kb-text-slate-200">Performance Analytics</h2>
            <p className="kb-text-sm kb-text-slate-400 kb-mt-1">
              Analyze workflow efficiency and resource utilization
            </p>
          </div>

          {/* Performance Score */}
          {performanceMetrics.orchestrationEfficiency !== undefined && (
            <div className={`kb-px-6 kb-py-4 kb-rounded-lg kb-border ${getEfficiencyBgColor(performanceMetrics.orchestrationEfficiency)}`}>
              <div className="kb-text-center">
                <div className={`kb-text-2xl kb-font-bold ${getEfficiencyColor(performanceMetrics.orchestrationEfficiency)}`}>
                  {Math.round(performanceMetrics.orchestrationEfficiency * 100)}%
                </div>
                <div className="kb-text-xs kb-text-slate-400">Efficiency Score</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="kb-flex-1 kb-overflow-y-auto kb-p-6 kb-bg-slate-950">
        
        {/* Key Metrics Grid */}
        <div className="kb-grid kb-grid-cols-1 md:kb-grid-cols-2 lg:kb-grid-cols-4 kb-gap-6 kb-mb-8">
          
          {/* Total Duration */}
          {performanceMetrics.totalWorkflowDuration && (
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
                    {formatDuration(performanceMetrics.totalWorkflowDuration)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Token Usage */}
          {performanceMetrics.totalTokensUsed && (
            <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
              <div className="kb-flex kb-items-center">
                <div className="kb-flex-shrink-0">
                  <div className="kb-w-8 kb-h-8 kb-bg-green-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                    <span className="kb-text-white kb-text-sm">🎯</span>
                  </div>
                </div>
                <div className="kb-ml-4">
                  <div className="kb-text-sm kb-font-medium kb-text-slate-400">Tokens Used</div>
                  <div className="kb-text-2xl kb-font-semibold kb-text-slate-200">
                    {formatTokens(performanceMetrics.totalTokensUsed)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Total Cost */}
          {performanceMetrics.totalCost && (
            <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
              <div className="kb-flex kb-items-center">
                <div className="kb-flex-shrink-0">
                  <div className="kb-w-8 kb-h-8 kb-bg-purple-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                    <span className="kb-text-white kb-text-sm">💰</span>
                  </div>
                </div>
                <div className="kb-ml-4">
                  <div className="kb-text-sm kb-font-medium kb-text-slate-400">Total Cost</div>
                  <div className="kb-text-2xl kb-font-semibold kb-text-slate-200">
                    ${performanceMetrics.totalCost.toFixed(4)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orchestration Overhead */}
          {performanceMetrics.orchestrationOverhead !== undefined && (
            <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
              <div className="kb-flex kb-items-center">
                <div className="kb-flex-shrink-0">
                  <div className="kb-w-8 kb-h-8 kb-bg-orange-600 kb-rounded-md kb-flex kb-items-center kb-justify-center">
                    <span className="kb-text-white kb-text-sm">🧠</span>
                  </div>
                </div>
                <div className="kb-ml-4">
                  <div className="kb-text-sm kb-font-medium kb-text-slate-400">AI Overhead</div>
                  <div className="kb-text-2xl kb-font-semibold kb-text-slate-200">
                    {(performanceMetrics.orchestrationOverhead * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Analytics */}
        <div className="kb-grid kb-grid-cols-1 lg:kb-grid-cols-2 kb-gap-8">
          
          {/* Task Performance */}
          <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
            <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Task Performance</h3>
            
            <div className="kb-space-y-4">
              {performanceMetrics.averageTaskDuration && (
                <div className="kb-flex kb-justify-between kb-items-center">
                  <span className="kb-text-sm kb-font-medium kb-text-slate-300">Average Task Duration</span>
                  <span className="kb-text-sm kb-text-slate-200 kb-font-semibold">
                    {formatDuration(performanceMetrics.averageTaskDuration)}
                  </span>
                </div>
              )}
              
              {performanceMetrics.taskThroughput && (
                <div className="kb-flex kb-justify-between kb-items-center">
                  <span className="kb-text-sm kb-font-medium kb-text-slate-300">Task Throughput</span>
                  <span className="kb-text-sm kb-text-slate-200 kb-font-semibold">
                    {performanceMetrics.taskThroughput.toFixed(2)} tasks/min
                  </span>
                </div>
              )}
              
              {performanceMetrics.completionRate && (
                <div className="kb-flex kb-justify-between kb-items-center">
                  <span className="kb-text-sm kb-font-medium kb-text-slate-300">Completion Rate</span>
                  <span className="kb-text-sm kb-text-slate-200 kb-font-semibold">
                    {(performanceMetrics.completionRate * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>

            {/* Task Performance Chart */}
            {performanceMetrics.taskPerformanceDistribution && (
              <div className="kb-mt-6">
                <h4 className="kb-text-sm kb-font-medium kb-text-slate-200 kb-mb-3">Performance Distribution</h4>
                <div className="kb-space-y-2">
                  {Object.entries(performanceMetrics.taskPerformanceDistribution).map(([range, count]) => (
                    <div key={range} className="kb-flex kb-items-center kb-space-x-3">
                      <span className="kb-text-xs kb-text-slate-400 kb-w-16">{range}</span>
                      <div className="kb-flex-1 kb-bg-slate-700 kb-rounded-full kb-h-2">
                        <div 
                          className="kb-bg-blue-500 kb-h-2 kb-rounded-full" 
                          style={{ 
                            width: `${Math.min(100, (count / Math.max(...Object.values(performanceMetrics.taskPerformanceDistribution))) * 100)}%` 
                          }}
                        />
                      </div>
                      <span className="kb-text-xs kb-text-slate-400 kb-w-8">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Resource Utilization */}
          <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
            <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Resource Utilization</h3>
            
            <div className="kb-space-y-4">
              {performanceMetrics.averageTokensPerTask && (
                <div className="kb-flex kb-justify-between kb-items-center">
                  <span className="kb-text-sm kb-font-medium kb-text-slate-300">Avg Tokens/Task</span>
                  <span className="kb-text-sm kb-text-slate-200 kb-font-semibold">
                    {formatTokens(performanceMetrics.averageTokensPerTask)}
                  </span>
                </div>
              )}
              
              {performanceMetrics.averageCostPerTask && (
                <div className="kb-flex kb-justify-between kb-items-center">
                  <span className="kb-text-sm kb-font-medium kb-text-slate-300">Avg Cost/Task</span>
                  <span className="kb-text-sm kb-text-slate-200 kb-font-semibold">
                    ${performanceMetrics.averageCostPerTask.toFixed(4)}
                  </span>
                </div>
              )}
              
              {performanceMetrics.tokenEfficiency && (
                <div className="kb-flex kb-justify-between kb-items-center">
                  <span className="kb-text-sm kb-font-medium kb-text-slate-300">Token Efficiency</span>
                  <span className={`kb-text-sm kb-font-semibold ${getEfficiencyColor(performanceMetrics.tokenEfficiency)}`}>
                    {(performanceMetrics.tokenEfficiency * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>

            {/* Cost Breakdown */}
            {performanceMetrics.costBreakdown && (
              <div className="kb-mt-6">
                <h4 className="kb-text-sm kb-font-medium kb-text-slate-200 kb-mb-3">Cost Breakdown</h4>
                <div className="kb-space-y-2">
                  {Object.entries(performanceMetrics.costBreakdown).map(([category, cost]) => (
                    <div key={category} className="kb-flex kb-justify-between kb-items-center">
                      <span className="kb-text-xs kb-text-slate-400 kb-capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="kb-text-xs kb-text-slate-200 kb-font-medium">
                        ${cost.toFixed(4)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottlenecks Analysis */}
        {performanceMetrics.bottlenecks && performanceMetrics.bottlenecks.length > 0 && (
          <div className="kb-mt-8">
            <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Performance Bottlenecks</h3>
            
            <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg">
              {performanceMetrics.bottlenecks.map((bottleneck, index) => (
                <div key={index} className="kb-p-4 kb-border-b kb-border-slate-700 last:kb-border-b-0">
                  <div className="kb-flex kb-items-start kb-space-x-4">
                    <div className="kb-flex-shrink-0">
                      <div className={`kb-w-8 kb-h-8 kb-rounded-full kb-flex kb-items-center kb-justify-center ${
                        bottleneck.severity === 'critical' 
                          ? 'kb-bg-red-600/20' 
                          : bottleneck.severity === 'high'
                          ? 'kb-bg-orange-600/20'
                          : 'kb-bg-yellow-600/20'
                      }`}>
                        <span className={`kb-text-sm ${
                          bottleneck.severity === 'critical' 
                            ? 'kb-text-red-400' 
                            : bottleneck.severity === 'high'
                            ? 'kb-text-orange-400'
                            : 'kb-text-yellow-400'
                        }`}>
                          {bottleneck.severity === 'critical' ? '🚨' : bottleneck.severity === 'high' ? '⚠️' : '⚡'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="kb-flex-1">
                      <div className="kb-flex kb-items-center kb-space-x-2 kb-mb-1">
                        <h4 className="kb-text-sm kb-font-medium kb-text-slate-200">
                          {bottleneck.type || 'Performance Issue'}
                        </h4>
                        <span className={`kb-inline-flex kb-items-center kb-px-2 kb-py-0.5 kb-rounded-md kb-text-xs kb-font-medium ${
                          bottleneck.severity === 'critical' 
                            ? 'kb-bg-red-600/20 kb-text-red-400' 
                            : bottleneck.severity === 'high'
                            ? 'kb-bg-orange-600/20 kb-text-orange-400'
                            : 'kb-bg-yellow-600/20 kb-text-yellow-400'
                        }`}>
                          {bottleneck.severity}
                        </span>
                      </div>
                      
                      <p className="kb-text-sm kb-text-slate-400">
                        {bottleneck.description}
                      </p>
                      
                      {bottleneck.impact && (
                        <div className="kb-mt-2">
                          <div className="kb-flex kb-items-center kb-space-x-4 kb-text-xs kb-text-slate-500">
                            {bottleneck.impact.duration && (
                              <span>Impact: {formatDuration(bottleneck.impact.duration)}</span>
                            )}
                            {bottleneck.impact.cost && (
                              <span>Cost: ${bottleneck.impact.cost.toFixed(4)}</span>
                            )}
                            {bottleneck.impact.efficiency && (
                              <span>Efficiency: -{(bottleneck.impact.efficiency * 100).toFixed(1)}%</span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {bottleneck.suggestion && (
                        <div className="kb-mt-2 kb-bg-green-600/20 kb-border kb-border-green-500/30 kb-rounded kb-p-2">
                          <p className="kb-text-xs kb-text-green-400">
                            💡 {bottleneck.suggestion}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Trends */}
        {performanceMetrics.performanceTrend && (
          <div className="kb-mt-8">
            <h3 className="kb-text-lg kb-font-semibold kb-text-slate-200 kb-mb-4">Performance Trend</h3>
            
            <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-6">
              <div className="kb-flex kb-items-center kb-justify-between kb-mb-4">
                <span className="kb-text-sm kb-font-medium kb-text-slate-300">Overall Trend</span>
                <span className={`kb-inline-flex kb-items-center kb-px-3 kb-py-1 kb-rounded-full kb-text-sm kb-font-medium ${
                  performanceMetrics.performanceTrend === 'improving' 
                    ? 'kb-bg-green-600/20 kb-text-green-400'
                    : performanceMetrics.performanceTrend === 'declining'
                    ? 'kb-bg-red-600/20 kb-text-red-400'
                    : 'kb-bg-slate-600/50 kb-text-slate-400'
                }`}>
                  {performanceMetrics.performanceTrend === 'improving' && '📈 Improving'}
                  {performanceMetrics.performanceTrend === 'declining' && '📉 Declining'}
                  {performanceMetrics.performanceTrend === 'stable' && '📊 Stable'}
                </span>
              </div>
              
              <p className="kb-text-sm kb-text-slate-400">
                {performanceMetrics.performanceTrend === 'improving' && 
                  'Performance is improving over time. Tasks are completing faster and more efficiently.'}
                {performanceMetrics.performanceTrend === 'declining' && 
                  'Performance is declining. Consider investigating bottlenecks and optimizing workflows.'}
                {performanceMetrics.performanceTrend === 'stable' && 
                  'Performance is stable with consistent execution times and resource usage.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceTab;