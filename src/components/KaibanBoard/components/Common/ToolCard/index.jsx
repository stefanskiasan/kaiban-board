/* eslint-disable react/prop-types */
import React from 'react';
import { WrenchScrewdriverIcon, GlobeAltIcon, MagnifyingGlassIcon, ChatBubbleLeftRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const ToolCard = ({ tool, agents }) => {
  if (!tool) return null;

  const getToolIcon = (toolName) => {
    const name = toolName?.toLowerCase() || '';
    if (name.includes('search') || name.includes('tavily') || name.includes('serper')) {
      return <MagnifyingGlassIcon className="kb-w-4 kb-h-4" />;
    }
    if (name.includes('web') || name.includes('url') || name.includes('crawl')) {
      return <GlobeAltIcon className="kb-w-4 kb-h-4" />;
    }
    if (name.includes('chat') || name.includes('gpt') || name.includes('claude')) {
      return <ChatBubbleLeftRightIcon className="kb-w-4 kb-h-4" />;
    }
    if (name.includes('document') || name.includes('pdf') || name.includes('text')) {
      return <DocumentTextIcon className="kb-w-4 kb-h-4" />;
    }
    return <WrenchScrewdriverIcon className="kb-w-4 kb-h-4" />;
  };

  const getToolCategory = (toolName) => {
    const name = toolName?.toLowerCase() || '';
    if (name.includes('search')) return 'Search';
    if (name.includes('web') || name.includes('crawl')) return 'Web';
    if (name.includes('document') || name.includes('pdf')) return 'Document';
    if (name.includes('webhook')) return 'Integration';
    if (name.includes('wolfram')) return 'Computation';
    return 'Utility';
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'search':
        return 'kb-text-blue-400 kb-bg-blue-400/10 kb-border-blue-400/20';
      case 'web':
        return 'kb-text-green-400 kb-bg-green-400/10 kb-border-green-400/20';
      case 'document':
        return 'kb-text-purple-400 kb-bg-purple-400/10 kb-border-purple-400/20';
      case 'integration':
        return 'kb-text-orange-400 kb-bg-orange-400/10 kb-border-orange-400/20';
      case 'computation':
        return 'kb-text-red-400 kb-bg-red-400/10 kb-border-red-400/20';
      default:
        return 'kb-text-slate-400 kb-bg-slate-400/10 kb-border-slate-400/20';
    }
  };

  const toolName = tool.name || tool.constructor?.name || 'Unknown Tool';
  const category = getToolCategory(toolName);
  const agentCount = agents?.length || 0;

  return (
    <div className="kb-relative kb-flex-1 kb-min-w-0 kb-bg-slate-900 kb-rounded-lg kb-border kb-border-slate-700 kb-p-4 hover:kb-border-slate-600 kb-transition-colors">
      {/* Header */}
      <div className="kb-flex kb-items-start kb-justify-between kb-mb-3">
        <div className="kb-flex kb-items-center kb-gap-2 kb-text-slate-300">
          {getToolIcon(toolName)}
          <span className="kb-text-sm kb-font-medium kb-text-slate-200 kb-truncate">
            {toolName}
          </span>
        </div>
        <span className={`kb-inline-flex kb-items-center kb-px-2 kb-py-1 kb-rounded-full kb-text-xs kb-font-medium kb-border ${getCategoryColor(category)}`}>
          {category}
        </span>
      </div>

      {/* Description */}
      {tool.description && (
        <p className="kb-text-xs kb-text-slate-400 kb-mb-3 kb-line-clamp-2">
          {tool.description}
        </p>
      )}

      {/* Configuration */}
      {tool.config && Object.keys(tool.config).length > 0 && (
        <div className="kb-mb-3">
          <div className="kb-text-xs kb-text-slate-500 kb-mb-1">Configuration:</div>
          <div className="kb-flex kb-flex-wrap kb-gap-1">
            {Object.entries(tool.config).slice(0, 3).map(([key, value]) => (
              <span key={key} className="kb-inline-flex kb-items-center kb-px-2 kb-py-1 kb-rounded kb-text-xs kb-text-slate-400 kb-bg-slate-800 kb-border kb-border-slate-600">
                {key}: {typeof value === 'string' ? (value.length > 10 ? value.substring(0, 10) + '...' : value) : String(value)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Agents using this tool */}
      <div className="kb-flex kb-items-center kb-justify-between kb-pt-3 kb-border-t kb-border-slate-700">
        <span className="kb-text-xs kb-text-slate-500">
          Used by {agentCount} agent{agentCount !== 1 ? 's' : ''}
        </span>
        {agents && agents.length > 0 && (
          <div className="kb-flex -kb-space-x-1">
            {agents.slice(0, 3).map((agent, index) => (
              <div
                key={agent.id || index}
                className="kb-w-5 kb-h-5 kb-rounded-full kb-bg-slate-600 kb-border-2 kb-border-slate-900 kb-flex kb-items-center kb-justify-center"
                title={agent.name}
              >
                <span className="kb-text-xs kb-text-slate-200 kb-font-medium">
                  {agent.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            ))}
            {agents.length > 3 && (
              <div className="kb-w-5 kb-h-5 kb-rounded-full kb-bg-slate-600 kb-border-2 kb-border-slate-900 kb-flex kb-items-center kb-justify-center">
                <span className="kb-text-xs kb-text-slate-200 kb-font-medium">
                  +{agents.length - 3}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolCard;