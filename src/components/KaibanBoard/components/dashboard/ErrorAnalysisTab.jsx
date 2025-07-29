import React, { useState } from 'react';
import { getLogSeverityLevel, getSuggestedErrorSolution } from '../../utils/orchestrationHelper';

const ErrorAnalysisTab = ({ errorAnalysis, workflowLogs = [] }) => {
  const [selectedError, setSelectedError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  // If no error analysis data, show empty state
  if (!errorAnalysis || !errorAnalysis.errorsByCategory || Object.keys(errorAnalysis.errorsByCategory).length === 0) {
    return (
      <div className="kb-p-6 kb-h-full kb-flex kb-items-center kb-justify-center kb-bg-slate-950">
        <div className="kb-text-center">
          <div className="kb-w-16 kb-h-16 kb-bg-green-900/20 kb-border kb-border-green-500/30 kb-rounded-full kb-flex kb-items-center kb-justify-center kb-mx-auto kb-mb-4">
            <span className="kb-text-2xl">✅</span>
          </div>
          <h3 className="kb-text-lg kb-font-medium kb-text-slate-200 kb-mb-2">No Errors Found</h3>
          <p className="kb-text-slate-400">
            Great! Your workflow executed without any errors.
          </p>
        </div>
      </div>
    );
  }

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'kb-bg-red-900/20 kb-text-red-400 kb-border-red-500/30';
      case 'high':
        return 'kb-bg-orange-900/20 kb-text-orange-400 kb-border-orange-500/30';
      case 'medium':
        return 'kb-bg-yellow-900/20 kb-text-yellow-400 kb-border-yellow-500/30';
      case 'low':
        return 'kb-bg-blue-900/20 kb-text-blue-400 kb-border-blue-500/30';
      default:
        return 'kb-bg-slate-800 kb-text-slate-300 kb-border-slate-600';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'medium':
        return '⚡';
      case 'low':
        return 'ℹ️';
      default:
        return '📝';
    }
  };

  return (
    <div className="kb-h-full kb-flex kb-bg-slate-950">
      
      {/* Left Panel: Error Categories and List */}
      <div className="kb-w-1/2 kb-border-r kb-border-slate-700 kb-overflow-y-auto kb-bg-slate-950">
        <div className="kb-p-6">
          
          {/* Error Summary */}
          <div className="kb-mb-6">
            <h2 className="kb-text-xl kb-font-semibold kb-text-slate-200 kb-mb-4">Error Analysis</h2>
            
            {/* Error Timeline */}
            {errorAnalysis.errorTimeline && errorAnalysis.errorTimeline.length > 0 && (
              <div className="kb-bg-red-900/20 kb-border kb-border-red-500/30 kb-rounded-lg kb-p-4 kb-mb-4">
                <h3 className="kb-text-sm kb-font-medium kb-text-red-400 kb-mb-2">Error Timeline</h3>
                <div className="kb-text-xs kb-text-red-300">
                  First error: {(() => {
                    try {
                      const timestamp = errorAnalysis.errorTimeline[0]?.timestamp;
                      if (!timestamp) return 'No timestamp';
                      const date = new Date(timestamp);
                      if (isNaN(date.getTime())) return 'Invalid timestamp';
                      return date.toLocaleString();
                    } catch (e) {
                      return 'Timestamp unavailable';
                    }
                  })()} 
                  {errorAnalysis.errorTimeline.length > 1 && (
                    <> • Last error: {(() => {
                      try {
                        const lastError = errorAnalysis.errorTimeline[errorAnalysis.errorTimeline.length - 1];
                        const timestamp = lastError?.timestamp;
                        if (!timestamp) return 'No timestamp';
                        const date = new Date(timestamp);
                        if (isNaN(date.getTime())) return 'Invalid timestamp';
                        return date.toLocaleString();
                      } catch (e) {
                        return 'Timestamp unavailable';
                      }
                    })()} </>
                  )}
                </div>
              </div>
            )}

            {/* Recurrent Errors Alert */}
            {errorAnalysis.recurrentErrors && errorAnalysis.recurrentErrors.length > 0 && (
              <div className="kb-bg-orange-900/20 kb-border kb-border-orange-500/30 kb-rounded-lg kb-p-4 kb-mb-4">
                <h3 className="kb-text-sm kb-font-medium kb-text-orange-400 kb-mb-2">
                  🔄 Recurrent Errors ({errorAnalysis.recurrentErrors.length})
                </h3>
                <div className="kb-space-y-1">
                  {errorAnalysis.recurrentErrors.slice(0, 3).map((error, index) => (
                    <div key={index} className="kb-text-xs kb-text-orange-300">
                      • {error.pattern} ({error.count} times)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Error Categories */}
          <div className="kb-space-y-4">
            {Object.entries(errorAnalysis.errorsByCategory).map(([category, errors]) => (
              <div key={category} className="kb-border kb-border-slate-700 kb-rounded-lg kb-bg-slate-900/50">
                
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="kb-w-full kb-px-4 kb-py-3 kb-flex kb-items-center kb-justify-between kb-text-left hover:kb-bg-slate-800/50 kb-rounded-lg"
                >
                  <div className="kb-flex kb-items-center kb-space-x-3">
                    <span className="kb-text-lg">
                      {category.includes('orchestration') && '🧠'}
                      {category.includes('task') && '🎯'}
                      {category.includes('agent') && '🤖'}
                      {category.includes('workflow') && '🔄'}
                      {category.includes('llm') && '💬'}
                      {category.includes('tool') && '🔧'}
                      {!category.includes('orchestration') && !category.includes('task') && !category.includes('agent') && !category.includes('workflow') && !category.includes('llm') && !category.includes('tool') && '⚠️'}
                    </span>
                    <div>
                      <h3 className="kb-text-sm kb-font-medium kb-text-slate-200 kb-capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <p className="kb-text-xs kb-text-slate-400">{errors.length} errors</p>
                    </div>
                  </div>
                  <div className="kb-flex kb-items-center kb-space-x-2">
                    <span className="kb-inline-flex kb-items-center kb-px-2.5 kb-py-0.5 kb-rounded-full kb-text-xs kb-font-medium kb-bg-red-900/30 kb-text-red-400 kb-border kb-border-red-500/30">
                      {errors.length}
                    </span>
                    <svg
                      className={`kb-w-5 kb-h-5 kb-text-slate-400 kb-transform kb-transition-transform ${
                        expandedCategories[category] ? 'kb-rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Category Errors */}
                {expandedCategories[category] && (
                  <div className="kb-border-t kb-border-slate-700">
                    {errors.map((error, index) => {
                      const severity = getLogSeverityLevel(error);
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            try {
                              // Validate error object before setting
                              if (error && typeof error === 'object') {
                                setSelectedError(error);
                              } else {
                                console.warn('Invalid error object:', error);
                              }
                            } catch (clickError) {
                              console.error('Error selecting error:', clickError);
                            }
                          }}
                          className={`kb-w-full kb-px-4 kb-py-3 kb-text-left hover:kb-bg-slate-800/30 kb-border-b kb-border-slate-700/50 last:kb-border-b-0 ${
                            selectedError === error ? 'kb-bg-blue-900/30 kb-border-blue-500/30' : ''
                          }`}
                        >
                          <div className="kb-flex kb-items-start kb-space-x-3">
                            <span className="kb-text-sm kb-mt-0.5">{getSeverityIcon(severity)}</span>
                            <div className="kb-flex-1 kb-min-w-0">
                              <div className="kb-flex kb-items-center kb-space-x-2 kb-mb-1">
                                <span className={`kb-inline-flex kb-items-center kb-px-2 kb-py-0.5 kb-rounded-md kb-text-xs kb-font-medium kb-border ${getSeverityColor(severity)}`}>
                                  {severity}
                                </span>
                                <span className="kb-text-xs kb-text-slate-400">
                                  {(() => {
                                    try {
                                      const timestamp = error.timestamp;
                                      if (!timestamp) return 'No time';
                                      const date = new Date(timestamp);
                                      if (isNaN(date.getTime())) return 'Invalid time';
                                      return date.toLocaleTimeString();
                                    } catch (e) {
                                      return 'Time unavailable';
                                    }
                                  })()} 
                                </span>
                              </div>
                              <p className="kb-text-sm kb-text-slate-200 kb-truncate">
                                {error.logDescription}
                              </p>
                              {error.metadata?.error && (
                                <p className="kb-text-xs kb-text-red-400 kb-truncate kb-mt-1">
                                  {error.metadata.error}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Suggested Fixes */}
          {errorAnalysis.suggestedFixes && errorAnalysis.suggestedFixes.length > 0 && (
            <div className="kb-mt-6 kb-bg-green-900/20 kb-border kb-border-green-500/30 kb-rounded-lg kb-p-4">
              <h3 className="kb-text-sm kb-font-medium kb-text-green-400 kb-mb-3">💡 Suggested Fixes</h3>
              <div className="kb-space-y-2">
                {errorAnalysis.suggestedFixes.map((fix, index) => (
                  <div key={index} className="kb-flex kb-items-start kb-space-x-2">
                    <span className="kb-text-green-400 kb-text-sm kb-mt-0.5">•</span>
                    <span className="kb-text-sm kb-text-green-300">{fix}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Error Details */}
      <div className="kb-w-1/2 kb-overflow-y-auto kb-bg-slate-950">
        {selectedError ? (
          <div className="kb-p-6">
            <div className="kb-mb-6">
              <div className="kb-flex kb-items-center kb-space-x-3 kb-mb-4">
                <span className="kb-text-2xl">{getSeverityIcon(getLogSeverityLevel(selectedError))}</span>
                <div>
                  <h2 className="kb-text-xl kb-font-semibold kb-text-slate-200">Error Details</h2>
                  <p className="kb-text-sm kb-text-slate-400">
                    {(() => {
                      try {
                        const timestamp = selectedError.timestamp;
                        if (!timestamp) return 'No timestamp available';
                        const date = new Date(timestamp);
                        if (isNaN(date.getTime())) return 'Invalid timestamp';
                        return date.toLocaleString();
                      } catch (error) {
                        console.warn('Error formatting timestamp:', error);
                        return 'Timestamp unavailable';
                      }
                    })()} 
                  </p>
                </div>
              </div>

              {/* Severity Badge */}
              <div className="kb-mb-4">
                <span className={`kb-inline-flex kb-items-center kb-px-3 kb-py-1 kb-rounded-full kb-text-sm kb-font-medium kb-border ${getSeverityColor(getLogSeverityLevel(selectedError))}`}>
                  {getLogSeverityLevel(selectedError).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Error Information */}
            <div className="kb-space-y-6">
              
              {/* Description */}
              <div>
                <h3 className="kb-text-sm kb-font-medium kb-text-slate-200 kb-mb-2">Description</h3>
                <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-4">
                  <p className="kb-text-sm kb-text-slate-300">{selectedError.logDescription}</p>
                </div>
              </div>

              {/* Error Message */}
              {selectedError.metadata?.error && (
                <div>
                  <h3 className="kb-text-sm kb-font-medium kb-text-slate-200 kb-mb-2">Error Message</h3>
                  <div className="kb-bg-red-900/20 kb-border kb-border-red-500/30 kb-rounded-lg kb-p-4">
                    <p className="kb-text-sm kb-text-red-300 kb-font-mono">
                      {typeof selectedError.metadata.error === 'string' 
                        ? selectedError.metadata.error 
                        : selectedError.metadata.error.message || 'Unknown error'
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Stack Trace */}
              {selectedError.metadata?.errorStack && (
                <div>
                  <h3 className="kb-text-sm kb-font-medium kb-text-slate-200 kb-mb-2">Stack Trace</h3>
                  <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-4 kb-overflow-x-auto">
                    <pre className="kb-text-xs kb-text-slate-300 kb-whitespace-pre-wrap kb-font-mono">
                      {selectedError.metadata.errorStack}
                    </pre>
                  </div>
                </div>
              )}

              {/* Context */}
              <div className="kb-grid kb-grid-cols-1 md:kb-grid-cols-2 kb-gap-4">
                
                {/* Task Context */}
                {selectedError.task && (
                  <div>
                    <h3 className="kb-text-sm kb-font-medium kb-text-slate-200 kb-mb-2">Task Context</h3>
                    <div className="kb-bg-blue-900/20 kb-border kb-border-blue-500/30 kb-rounded-lg kb-p-3">
                      <p className="kb-text-sm kb-font-medium kb-text-blue-300">
                        {(() => {
                          try {
                            const task = selectedError.task;
                            return task?.title || task?.id || 'Unknown task';
                          } catch (e) {
                            return 'Task information unavailable';
                          }
                        })()} 
                      </p>
                      {selectedError.task.description && (
                        <p className="kb-text-xs kb-text-blue-400 kb-mt-1">
                          {(() => {
                            try {
                              const desc = selectedError.task.description;
                              if (typeof desc === 'string' && desc.length > 100) {
                                return desc.substring(0, 100) + '...';
                              }
                              return desc || 'No description available';
                            } catch (e) {
                              return 'Description unavailable';
                            }
                          })()} 
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Agent Context */}
                {selectedError.agent && (
                  <div>
                    <h3 className="kb-text-sm kb-font-medium kb-text-slate-200 kb-mb-2">Agent Context</h3>
                    <div className="kb-bg-purple-900/20 kb-border kb-border-purple-500/30 kb-rounded-lg kb-p-3">
                      <p className="kb-text-sm kb-font-medium kb-text-purple-300">
                        {(() => {
                          try {
                            const agent = selectedError.agent;
                            return agent?.name || agent?.id || 'Unknown agent';
                          } catch (e) {
                            return 'Agent information unavailable';
                          }
                        })()} 
                      </p>
                      {selectedError.agent.role && (
                        <p className="kb-text-xs kb-text-purple-400 kb-mt-1">
                          Role: {(() => {
                            try {
                              return selectedError.agent.role || 'No role specified';
                            } catch (e) {
                              return 'Role unavailable';
                            }
                          })()} 
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cost Impact */}
              {selectedError.metadata?.costDetails && (
                <div>
                  <h3 className="kb-text-sm kb-font-medium kb-text-slate-200 kb-mb-2">Cost Impact</h3>
                  <div className="kb-bg-yellow-900/20 kb-border kb-border-yellow-500/30 kb-rounded-lg kb-p-4">
                    <div className="kb-flex kb-justify-between kb-text-sm">
                      <span className="kb-text-yellow-300">Total Cost:</span>
                      <span className="kb-font-medium kb-text-yellow-200">
                        ${selectedError.metadata.costDetails.totalCost?.toFixed(4) || '0.0000'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested Solution */}
              {getSuggestedErrorSolution && (
                <div>
                  <h3 className="kb-text-sm kb-font-medium kb-text-slate-200 kb-mb-2">💡 Suggested Solution</h3>
                  <div className="kb-bg-green-900/20 kb-border kb-border-green-500/30 kb-rounded-lg kb-p-4">
                    <p className="kb-text-sm kb-text-green-300">
                      {getSuggestedErrorSolution(selectedError)}
                    </p>
                  </div>
                </div>
              )}

              {/* Metadata */}
              {selectedError.metadata && Object.keys(selectedError.metadata).length > 1 && (
                <div>
                  <h3 className="kb-text-sm kb-font-medium kb-text-slate-200 kb-mb-2">Additional Metadata</h3>
                  <div className="kb-bg-slate-800 kb-border kb-border-slate-700 kb-rounded-lg kb-p-4">
                    <pre className="kb-text-xs kb-text-slate-300 kb-whitespace-pre-wrap kb-font-mono">
                      {JSON.stringify(selectedError.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="kb-p-6 kb-h-full kb-flex kb-items-center kb-justify-center">
            <div className="kb-text-center kb-text-slate-400">
              <div className="kb-w-16 kb-h-16 kb-bg-slate-800 kb-border kb-border-slate-600 kb-rounded-full kb-flex kb-items-center kb-justify-center kb-mx-auto kb-mb-4">
                <span className="kb-text-2xl">👈</span>
              </div>
              <p>Select an error from the list to see detailed information</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorAnalysisTab;