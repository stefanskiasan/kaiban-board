import React from 'react';

const DashboardHeader = ({ 
  onClose, 
  summary, 
  selectedTimeRange, 
  onTimeRangeChange, 
  searchFilter, 
  onSearchChange, 
  totalLogs 
}) => {
  const timeRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: '1h', label: 'Last Hour' },
    { value: '6h', label: 'Last 6 Hours' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' }
  ];

  return (
    <div className="kb-bg-white kb-px-6 kb-py-4 kb-border-b kb-border-gray-200">
      <div className="kb-flex kb-items-center kb-justify-between">
        
        {/* Left: Title and Summary */}
        <div className="kb-flex kb-items-center kb-space-x-6">
          <div>
            <h1 className="kb-text-2xl kb-font-bold kb-text-gray-900">
              Orchestration Dashboard
            </h1>
            <p className="kb-text-sm kb-text-gray-500 kb-mt-1">
              Analysis of {totalLogs} workflow events
              {summary.orchestrationEvents > 0 && ` • ${summary.orchestrationEvents} orchestration events`}
              {summary.totalDuration > 0 && ` • ${(summary.totalDuration / 1000).toFixed(1)}s duration`}
            </p>
          </div>

          {/* Quick Status Indicators */}
          <div className="kb-flex kb-items-center kb-space-x-4">
            {/* Error Status */}
            <div className="kb-flex kb-items-center kb-space-x-2">
              <div className={`kb-w-3 kb-h-3 kb-rounded-full ${
                summary.errors > 0 ? 'kb-bg-red-500' : 'kb-bg-green-500'
              }`} />
              <span className="kb-text-xs kb-font-medium kb-text-gray-600">
                {summary.errors > 0 ? `${summary.errors} Errors` : 'No Errors'}
              </span>
            </div>

            {/* Performance Status */}
            {summary.totalCost > 0 && (
              <div className="kb-flex kb-items-center kb-space-x-2">
                <span className="kb-text-xs kb-font-medium kb-text-gray-600">
                  💰 ${summary.totalCost.toFixed(4)}
                </span>
              </div>
            )}

            {/* Active Tasks */}
            {summary.tasks > 0 && (
              <div className="kb-flex kb-items-center kb-space-x-2">
                <span className="kb-text-xs kb-font-medium kb-text-gray-600">
                  🎯 {summary.tasks} Tasks
                </span>
              </div>
            )}

            {/* Active Agents */}
            {summary.agents > 0 && (
              <div className="kb-flex kb-items-center kb-space-x-2">
                <span className="kb-text-xs kb-font-medium kb-text-gray-600">
                  🤖 {summary.agents} Agents
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Controls and Close */}
        <div className="kb-flex kb-items-center kb-space-x-4">
          
          {/* Search Filter */}
          <div className="kb-relative">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchFilter}
              onChange={(e) => onSearchChange(e.target.value)}
              className="kb-w-64 kb-pl-10 kb-pr-4 kb-py-2 kb-border kb-border-gray-300 kb-rounded-md kb-text-sm focus:kb-outline-none focus:kb-ring-2 focus:kb-ring-blue-500 focus:kb-border-transparent"
            />
            <div className="kb-absolute kb-inset-y-0 kb-left-0 kb-pl-3 kb-flex kb-items-center">
              <svg className="kb-h-5 kb-w-5 kb-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchFilter && (
              <button
                onClick={() => onSearchChange('')}
                className="kb-absolute kb-inset-y-0 kb-right-0 kb-pr-3 kb-flex kb-items-center"
              >
                <svg className="kb-h-4 kb-w-4 kb-text-gray-400 hover:kb-text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Time Range Filter */}
          <div className="kb-relative">
            <select
              value={selectedTimeRange}
              onChange={(e) => onTimeRangeChange(e.target.value)}
              className="kb-appearance-none kb-bg-white kb-border kb-border-gray-300 kb-rounded-md kb-px-4 kb-py-2 kb-pr-8 kb-text-sm focus:kb-outline-none focus:kb-ring-2 focus:kb-ring-blue-500 focus:kb-border-transparent"
            >
              {timeRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="kb-absolute kb-inset-y-0 kb-right-0 kb-flex kb-items-center kb-px-2 kb-pointer-events-none">
              <svg className="kb-h-4 kb-w-4 kb-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={() => {
              // TODO: Implement export functionality
              console.log('Export dashboard data');
            }}
            className="kb-inline-flex kb-items-center kb-px-4 kb-py-2 kb-border kb-border-gray-300 kb-rounded-md kb-shadow-sm kb-text-sm kb-font-medium kb-text-gray-700 kb-bg-white hover:kb-bg-gray-50 focus:kb-outline-none focus:kb-ring-2 focus:kb-ring-offset-2 focus:kb-ring-blue-500"
          >
            <svg className="kb-h-4 kb-w-4 kb-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => {
              // TODO: Implement refresh functionality
              console.log('Refresh dashboard');
            }}
            className="kb-inline-flex kb-items-center kb-px-3 kb-py-2 kb-border kb-border-gray-300 kb-rounded-md kb-shadow-sm kb-text-sm kb-font-medium kb-text-gray-700 kb-bg-white hover:kb-bg-gray-50 focus:kb-outline-none focus:kb-ring-2 focus:kb-ring-offset-2 focus:kb-ring-blue-500"
          >
            <svg className="kb-h-4 kb-w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="kb-inline-flex kb-items-center kb-px-3 kb-py-2 kb-border kb-border-transparent kb-rounded-md kb-shadow-sm kb-text-sm kb-font-medium kb-text-white kb-bg-gray-600 hover:kb-bg-gray-700 focus:kb-outline-none focus:kb-ring-2 focus:kb-ring-offset-2 focus:kb-ring-gray-500"
          >
            <svg className="kb-h-4 kb-w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;