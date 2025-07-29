/* eslint-disable react/prop-types */
import React from 'react';
import { DocumentDuplicateIcon, LockClosedIcon, PencilIcon } from '@heroicons/react/24/outline';
import AgentAvatar from '../AgentAvatar';
import AITaskBadge from '../AITaskBadge';
import { usePlaygroundStore } from '../../../store/PlaygroundProvider';

const BacklogTaskCard = ({ 
  backlogTask, 
  isAISelected = false, 
  isGenerated = false, 
  adaptationLevel = 'none',
  isSelected = false,
  isNewlyCreated = false,
  animationStyles = ''
}) => {
  if (!backlogTask) return null;

  const useAgentsPlaygroundStore = usePlaygroundStore();
  const { setSelectedTaskAction } = useAgentsPlaygroundStore(state => ({
    setSelectedTaskAction: state.setSelectedTaskAction,
  }));

  const getComplexityColor = (complexity) => {
    switch (complexity?.toLowerCase()) {
      case 'low':
        return 'kb-text-green-400 kb-bg-green-400/10 kb-border-green-400/20';
      case 'medium':
        return 'kb-text-yellow-400 kb-bg-yellow-400/10 kb-border-yellow-400/20';
      case 'high':
        return 'kb-text-red-400 kb-bg-red-400/10 kb-border-red-400/20';
      default:
        return 'kb-text-slate-400 kb-bg-slate-400/10 kb-border-slate-400/20';
    }
  };

  const getCardStyles = () => {
    let baseStyles = "kb-relative kb-flex-1 kb-min-w-0 kb-rounded-lg kb-border kb-p-4 kb-cursor-pointer kb-transition-all kb-duration-300";
    
    // Add animation styles if present (takes priority)
    if (animationStyles) {
      return `${baseStyles} ${animationStyles}`;
    }
    
    if (isSelected) {
      // Selected state: Green highlighting
      return `${baseStyles} kb-bg-green-500/10 kb-border-green-500 kb-ring-2 kb-ring-green-500/50 hover:kb-ring-green-500`;
    } else if (isNewlyCreated) {
      // Newly created state: Amber/Orange highlighting
      return `${baseStyles} kb-bg-amber-500/10 kb-border-amber-500 kb-ring-2 kb-ring-amber-500/50 hover:kb-ring-amber-500`;
    } else {
      // Default state: Original styling
      return `${baseStyles} kb-bg-slate-900 kb-border-slate-700 hover:kb-ring-indigo-500 hover:kb-border-indigo-500`;
    }
  };

  return (
    <div 
      className={getCardStyles()}
      onClick={() => setSelectedTaskAction(backlogTask)}
    >
      {/* Header */}
      <div className="kb-flex kb-items-start kb-justify-between kb-mb-3">
        <div className="kb-flex kb-items-center kb-gap-2">
          <DocumentDuplicateIcon className="kb-w-4 kb-h-4 kb-text-indigo-400" />
          <span className="kb-text-xs kb-font-medium kb-text-indigo-400">Backlog</span>
        </div>
        <div className="kb-flex kb-items-center kb-gap-1">
          {backlogTask.adaptable ? (
            <PencilIcon className="kb-w-3 kb-h-3 kb-text-green-400" title="Adaptable" />
          ) : (
            <LockClosedIcon className="kb-w-3 kb-h-3 kb-text-red-400" title="Fixed" />
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="kb-text-sm kb-font-medium kb-text-slate-200 kb-mb-2 kb-leading-tight">
        {backlogTask.description || backlogTask.name || 'Untitled Backlog Task'}
      </h3>

      {/* Agent */}
      {backlogTask.agent && (
        <div className="kb-flex kb-items-center kb-gap-2 kb-mb-3">
          <AgentAvatar agent={backlogTask.agent} size="xs" />
          <span className="kb-text-xs kb-text-slate-400">
            {backlogTask.agent.name}
          </span>
        </div>
      )}

      {/* AI Indicators */}
      <AITaskBadge 
        isAISelected={isAISelected}
        isGenerated={isGenerated}
        adaptationLevel={adaptationLevel}
        size="xs"
      />

      {/* Metadata */}
      <div className="kb-flex kb-flex-wrap kb-gap-2 kb-mb-3">
        {backlogTask.complexity && (
          <span className={`kb-inline-flex kb-items-center kb-px-2 kb-py-1 kb-rounded-full kb-text-xs kb-font-medium kb-border ${getComplexityColor(backlogTask.complexity)}`}>
            {backlogTask.complexity}
          </span>
        )}
        {backlogTask.category && (
          <span className="kb-inline-flex kb-items-center kb-px-2 kb-py-1 kb-rounded-full kb-text-xs kb-font-medium kb-text-slate-300 kb-bg-slate-800 kb-border kb-border-slate-600">
            {backlogTask.category}
          </span>
        )}
      </div>

      {/* Resource Requirements */}
      {backlogTask.resourceRequirements && (
        <div className="kb-text-xs kb-text-slate-400 kb-space-y-1">
          {backlogTask.resourceRequirements.estimatedTime && (
            <div>⏱️ {backlogTask.resourceRequirements.estimatedTime}</div>
          )}
          {backlogTask.resourceRequirements.skillsRequired && backlogTask.resourceRequirements.skillsRequired.length > 0 && (
            <div>🎯 {backlogTask.resourceRequirements.skillsRequired.slice(0, 2).join(', ')}
              {backlogTask.resourceRequirements.skillsRequired.length > 2 && ` +${backlogTask.resourceRequirements.skillsRequired.length - 2}`}
            </div>
          )}
        </div>
      )}

      {/* Expected Output */}
      {backlogTask.expectedOutput && (
        <div className="kb-mt-3 kb-pt-3 kb-border-t kb-border-slate-700">
          <span className="kb-text-xs kb-text-slate-500 kb-line-clamp-2">
            {backlogTask.expectedOutput}
          </span>
        </div>
      )}
    </div>
  );
};

export default BacklogTaskCard;