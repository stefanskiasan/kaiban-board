import React, { useState, useMemo } from 'react';
import { getLogSeverityLevel, getEventIcon } from '../../utils/orchestrationHelper';

const LogsTimelineTab = ({ workflowLogs = [], categorizedLogs }) => {
  const [selectedLogType, setSelectedLogType] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [expandedLog, setExpandedLog] = useState(null);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'table'

  // Filter logs based on selected type and severity
  const filteredLogs = useMemo(() => {
    let filtered = workflowLogs;

    if (selectedLogType !== 'all') {
      filtered = filtered.filter(log => log.logType === selectedLogType);
    }

    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(log => getLogSeverityLevel(log) === selectedSeverity);
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }, [workflowLogs, selectedLogType, selectedSeverity]);

  // Get log type counts
  const logTypeCounts = useMemo(() => {
    const counts = {
      all: workflowLogs.length,
      OrchestrationStatusUpdate: 0,
      TaskStatusUpdate: 0,
      AgentStatusUpdate: 0,
      WorkflowStatusUpdate: 0
    };

    workflowLogs.forEach(log => {
      if (counts[log.logType] !== undefined) {
        counts[log.logType]++;
      }
    });

    return counts;
  }, [workflowLogs]);

  // Get severity counts
  const severityCounts = useMemo(() => {
    const counts = { all: workflowLogs.length, critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    
    workflowLogs.forEach(log => {
      const severity = getLogSeverityLevel(log);
      if (counts[severity] !== undefined) {
        counts[severity]++;
      }
    });

    return counts;
  }, [workflowLogs]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'kb-bg-red-100 kb-text-red-800 kb-border-red-200';
      case 'high':
        return 'kb-bg-orange-100 kb-text-orange-800 kb-border-orange-200';
      case 'medium':
        return 'kb-bg-yellow-100 kb-text-yellow-800 kb-border-yellow-200';
      case 'low':
        return 'kb-bg-blue-100 kb-text-blue-800 kb-border-blue-200';
      case 'info':
        return 'kb-bg-gray-100 kb-text-gray-800 kb-border-gray-200';
      default:
        return 'kb-bg-gray-100 kb-text-gray-800 kb-border-gray-200';
    }
  };

  const getLogTypeColor = (logType) => {
    switch (logType) {
      case 'OrchestrationStatusUpdate':
        return 'kb-bg-purple-100 kb-text-purple-800 kb-border-purple-200';
      case 'TaskStatusUpdate':
        return 'kb-bg-green-100 kb-text-green-800 kb-border-green-200';
      case 'AgentStatusUpdate':
        return 'kb-bg-blue-100 kb-text-blue-800 kb-border-blue-200';
      case 'WorkflowStatusUpdate':
        return 'kb-bg-gray-100 kb-text-gray-800 kb-border-gray-200';
      default:
        return 'kb-bg-gray-100 kb-text-gray-800 kb-border-gray-200';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      relative: getRelativeTime(timestamp)
    };
  };

  const getRelativeTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 1000) return 'just now';
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  if (workflowLogs.length === 0) {
    return (
      <div className="kb-p-6 kb-h-full kb-flex kb-items-center kb-justify-center">
        <div className="kb-text-center">
          <div className="kb-w-16 kb-h-16 kb-bg-gray-100 kb-rounded-full kb-flex kb-items-center kb-justify-center kb-mx-auto kb-mb-4">
            <span className="kb-text-2xl">📈</span>
          </div>
          <h3 className="kb-text-lg kb-font-medium kb-text-gray-900 kb-mb-2">No Logs Available</h3>
          <p className="kb-text-gray-500">
            No workflow events have been logged yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="kb-h-full kb-flex kb-flex-col">
      
      {/* Header with Filters */}
      <div className="kb-p-6 kb-border-b kb-border-gray-200">
        <div className="kb-flex kb-items-center kb-justify-between kb-mb-4">
          <div>
            <h2 className="kb-text-xl kb-font-semibold kb-text-gray-900">Event Timeline</h2>
            <p className="kb-text-sm kb-text-gray-500 kb-mt-1">
              Chronological view of all workflow events ({filteredLogs.length} of {workflowLogs.length})
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="kb-flex kb-bg-gray-100 kb-rounded-lg kb-p-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={`kb-px-4 kb-py-2 kb-text-sm kb-font-medium kb-rounded-md kb-transition-colors ${
                viewMode === 'timeline'
                  ? 'kb-bg-white kb-text-gray-900 kb-shadow-sm'
                  : 'kb-text-gray-600 hover:kb-text-gray-900'
              }`}
            >
              📈 Timeline
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`kb-px-4 kb-py-2 kb-text-sm kb-font-medium kb-rounded-md kb-transition-colors ${
                viewMode === 'table'
                  ? 'kb-bg-white kb-text-gray-900 kb-shadow-sm'
                  : 'kb-text-gray-600 hover:kb-text-gray-900'
              }`}
            >
              📊 Table
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="kb-flex kb-flex-wrap kb-gap-4">
          
          {/* Log Type Filter */}
          <div className="kb-flex kb-items-center kb-space-x-2">
            <label className="kb-text-sm kb-font-medium kb-text-gray-700">Type:</label>
            <select
              value={selectedLogType}
              onChange={(e) => setSelectedLogType(e.target.value)}
              className="kb-text-sm kb-border kb-border-gray-300 kb-rounded-md kb-px-3 kb-py-1 focus:kb-outline-none focus:kb-ring-2 focus:kb-ring-blue-500"
            >
              <option value="all">All ({logTypeCounts.all})</option>
              <option value="OrchestrationStatusUpdate">🧠 Orchestration ({logTypeCounts.OrchestrationStatusUpdate})</option>
              <option value="TaskStatusUpdate">🎯 Tasks ({logTypeCounts.TaskStatusUpdate})</option>
              <option value="AgentStatusUpdate">🤖 Agents ({logTypeCounts.AgentStatusUpdate})</option>
              <option value="WorkflowStatusUpdate">🔄 Workflow ({logTypeCounts.WorkflowStatusUpdate})</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="kb-flex kb-items-center kb-space-x-2">
            <label className="kb-text-sm kb-font-medium kb-text-gray-700">Severity:</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="kb-text-sm kb-border kb-border-gray-300 kb-rounded-md kb-px-3 kb-py-1 focus:kb-outline-none focus:kb-ring-2 focus:kb-ring-blue-500"
            >
              <option value="all">All ({severityCounts.all})</option>
              <option value="critical">🚨 Critical ({severityCounts.critical})</option>
              <option value="high">⚠️ High ({severityCounts.high})</option>
              <option value="medium">⚡ Medium ({severityCounts.medium})</option>
              <option value="low">ℹ️ Low ({severityCounts.low})</option>
              <option value="info">📝 Info ({severityCounts.info})</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(selectedLogType !== 'all' || selectedSeverity !== 'all') && (
            <button
              onClick={() => {
                setSelectedLogType('all');
                setSelectedSeverity('all');
              }}
              className="kb-text-sm kb-text-blue-600 hover:kb-text-blue-800 kb-underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="kb-flex-1 kb-overflow-y-auto">
        {viewMode === 'timeline' ? (
          <TimelineView 
            logs={filteredLogs}
            expandedLog={expandedLog}
            setExpandedLog={setExpandedLog}
            formatTimestamp={formatTimestamp}
            getSeverityColor={getSeverityColor}
            getLogTypeColor={getLogTypeColor}
          />
        ) : (
          <TableView 
            logs={filteredLogs}
            formatTimestamp={formatTimestamp}
            getSeverityColor={getSeverityColor}
            getLogTypeColor={getLogTypeColor}
          />
        )}
      </div>
    </div>
  );
};

// Timeline View Component
const TimelineView = ({ logs, expandedLog, setExpandedLog, formatTimestamp, getSeverityColor, getLogTypeColor }) => {
  return (
    <div className="kb-p-6">
      <div className="kb-relative">
        {/* Timeline Line */}
        <div className="kb-absolute kb-left-8 kb-top-0 kb-bottom-0 kb-w-0.5 kb-bg-gray-300"></div>
        
        {/* Timeline Events */}
        <div className="kb-space-y-6">
          {logs.map((log, index) => {
            const timestamp = formatTimestamp(log.timestamp);
            const severity = getLogSeverityLevel(log);
            const isExpanded = expandedLog === index;
            
            return (
              <div key={index} className="kb-relative kb-flex kb-items-start kb-space-x-4">
                
                {/* Timeline Dot */}
                <div className={`kb-flex-shrink-0 kb-w-4 kb-h-4 kb-rounded-full kb-border-2 kb-border-white kb-shadow-sm kb-z-10 ${
                  severity === 'critical' ? 'kb-bg-red-500' :
                  severity === 'high' ? 'kb-bg-orange-500' :
                  severity === 'medium' ? 'kb-bg-yellow-500' :
                  severity === 'low' ? 'kb-bg-blue-500' : 'kb-bg-gray-500'
                }`}></div>
                
                {/* Event Content */}
                <div className="kb-flex-1 kb-min-w-0">
                  <div 
                    className={`kb-bg-white kb-border kb-rounded-lg kb-p-4 kb-shadow-sm kb-cursor-pointer kb-transition-all ${
                      isExpanded ? 'kb-border-blue-300 kb-shadow-md' : 'kb-border-gray-200 hover:kb-border-gray-300'
                    }`}
                    onClick={() => setExpandedLog(isExpanded ? null : index)}
                  >
                    
                    {/* Event Header */}
                    <div className="kb-flex kb-items-center kb-justify-between kb-mb-2">
                      <div className="kb-flex kb-items-center kb-space-x-2">
                        <span className="kb-text-lg">{getEventIcon(log)}</span>
                        <span className={`kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-border ${getLogTypeColor(log.logType)}`}>
                          {log.logType.replace('StatusUpdate', '')}
                        </span>
                        <span className={`kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-border ${getSeverityColor(severity)}`}>
                          {severity}
                        </span>
                      </div>
                      
                      <div className="kb-text-right">
                        <div className="kb-text-xs kb-text-gray-500">{timestamp.relative}</div>
                        <div className="kb-text-xs kb-text-gray-400">{timestamp.time}</div>
                      </div>
                    </div>
                    
                    {/* Event Description */}
                    <p className="kb-text-sm kb-text-gray-900 kb-mb-2">
                      {log.logDescription}
                    </p>
                    
                    {/* Context Info */}
                    <div className="kb-flex kb-items-center kb-space-x-4 kb-text-xs kb-text-gray-500">
                      {log.task && (
                        <span>🎯 {log.task.title || log.task.id}</span>
                      )}
                      {log.agent && (
                        <span>🤖 {log.agent.name || log.agent.id}</span>
                      )}
                      {log.orchestrationEvent && (
                        <span>🧠 {log.orchestrationEvent}</span>
                      )}
                    </div>
                    
                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="kb-mt-4 kb-pt-4 kb-border-t kb-border-gray-200">
                        
                        {/* Error Details */}
                        {log.metadata?.error && (
                          <div className="kb-mb-4">
                            <h4 className="kb-text-sm kb-font-medium kb-text-gray-900 kb-mb-2">Error Details</h4>
                            <div className="kb-bg-red-50 kb-border kb-border-red-200 kb-rounded kb-p-3">
                              <p className="kb-text-sm kb-text-red-800 kb-font-mono">
                                {typeof log.metadata.error === 'string' 
                                  ? log.metadata.error 
                                  : log.metadata.error.message || 'Unknown error'
                                }
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Cost Information */}
                        {log.metadata?.costDetails && (
                          <div className="kb-mb-4">
                            <h4 className="kb-text-sm kb-font-medium kb-text-gray-900 kb-mb-2">Cost Information</h4>
                            <div className="kb-bg-yellow-50 kb-border kb-border-yellow-200 kb-rounded kb-p-3">
                              <div className="kb-text-sm kb-text-yellow-800">
                                Total: ${log.metadata.costDetails.totalCost?.toFixed(4) || '0.0000'}
                                {log.metadata.costDetails.costInputTokens && (
                                  <> • Input: ${log.metadata.costDetails.costInputTokens.toFixed(4)}</>
                                )}
                                {log.metadata.costDetails.costOutputTokens && (
                                  <> • Output: ${log.metadata.costDetails.costOutputTokens.toFixed(4)}</>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Full Metadata */}
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <div>
                            <h4 className="kb-text-sm kb-font-medium kb-text-gray-900 kb-mb-2">Full Metadata</h4>
                            <div className="kb-bg-gray-50 kb-rounded kb-p-3 kb-max-h-40 kb-overflow-y-auto">
                              <pre className="kb-text-xs kb-text-gray-700 kb-whitespace-pre-wrap">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Table View Component
const TableView = ({ logs, formatTimestamp, getSeverityColor, getLogTypeColor }) => {
  return (
    <div className="kb-overflow-x-auto">
      <table className="kb-min-w-full kb-divide-y kb-divide-gray-200">
        <thead className="kb-bg-gray-50">
          <tr>
            <th className="kb-px-6 kb-py-3 kb-text-left kb-text-xs kb-font-medium kb-text-gray-500 kb-uppercase kb-tracking-wider">
              Time
            </th>
            <th className="kb-px-6 kb-py-3 kb-text-left kb-text-xs kb-font-medium kb-text-gray-500 kb-uppercase kb-tracking-wider">
              Type
            </th>
            <th className="kb-px-6 kb-py-3 kb-text-left kb-text-xs kb-font-medium kb-text-gray-500 kb-uppercase kb-tracking-wider">
              Severity
            </th>
            <th className="kb-px-6 kb-py-3 kb-text-left kb-text-xs kb-font-medium kb-text-gray-500 kb-uppercase kb-tracking-wider">
              Description
            </th>
            <th className="kb-px-6 kb-py-3 kb-text-left kb-text-xs kb-font-medium kb-text-gray-500 kb-uppercase kb-tracking-wider">
              Context
            </th>
          </tr>
        </thead>
        <tbody className="kb-bg-white kb-divide-y kb-divide-gray-200">
          {logs.map((log, index) => {
            const timestamp = formatTimestamp(log.timestamp);
            const severity = getLogSeverityLevel(log);
            
            return (
              <tr key={index} className="hover:kb-bg-gray-50">
                <td className="kb-px-6 kb-py-4 kb-whitespace-nowrap kb-text-sm kb-text-gray-900">
                  <div>
                    <div className="kb-font-medium">{timestamp.time}</div>
                    <div className="kb-text-xs kb-text-gray-500">{timestamp.relative}</div>
                  </div>
                </td>
                
                <td className="kb-px-6 kb-py-4 kb-whitespace-nowrap">
                  <span className={`kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-border ${getLogTypeColor(log.logType)}`}>
                    {getEventIcon(log)} {log.logType.replace('StatusUpdate', '')}
                  </span>
                </td>
                
                <td className="kb-px-6 kb-py-4 kb-whitespace-nowrap">
                  <span className={`kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-border ${getSeverityColor(severity)}`}>
                    {severity}
                  </span>
                </td>
                
                <td className="kb-px-6 kb-py-4 kb-text-sm kb-text-gray-900">
                  <div className="kb-max-w-xs kb-truncate" title={log.logDescription}>
                    {log.logDescription}
                  </div>
                </td>
                
                <td className="kb-px-6 kb-py-4 kb-text-sm kb-text-gray-500">
                  <div className="kb-space-y-1">
                    {log.task && (
                      <div className="kb-text-xs">🎯 {log.task.title || log.task.id}</div>
                    )}
                    {log.agent && (
                      <div className="kb-text-xs">🤖 {log.agent.name || log.agent.id}</div>
                    )}
                    {log.orchestrationEvent && (
                      <div className="kb-text-xs">🧠 {log.orchestrationEvent}</div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LogsTimelineTab;