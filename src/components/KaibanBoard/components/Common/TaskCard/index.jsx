/* eslint-disable react/prop-types */
import React from 'react';
import { Button } from '@headlessui/react';
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import AgentAvatar from '../AgentAvatar';
import Tooltip from '../Tooltip';
import { usePlaygroundStore } from '../../../store/PlaygroundProvider';
import { useEffect, useState } from 'react';
import { isAwaitingValidation } from '../../../utils/helper';

const TaskCard = ({ task, showOptions = true, animationStyles = '', isNewlyCreated = false, isEdited = false }) => {
  const useAgentsPlaygroundStore = usePlaygroundStore();
  const [isAwaiting, setIsAwaiting] = useState(false);

  const { teamStore, setSelectedTaskAction } = useAgentsPlaygroundStore(
    state => ({
      teamStore: state.teamStore,
      setSelectedTaskAction: state.setSelectedTaskAction,
    })
  );

  const { workflowLogs } = teamStore(state => ({
    workflowLogs: state.workflowLogs,
  }));

  useEffect(() => {
    // console.log('workflowLogs--useEffect', workflowLogs);
    const awaiting = isAwaitingValidation(workflowLogs, task.id);
    if (awaiting !== isAwaiting) {
      setIsAwaiting(awaiting);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [workflowLogs]);

  const getCardStyles = () => {
    let baseStyles = `kb-flex kb-flex-col kb-gap-3 kb-p-4 kb-ring-1 kb-ring-slate-950 kb-rounded-lg kb-bg-slate-800 kb-w-full kb-transition-all kb-duration-300 ${showOptions ? 'hover:kb-ring-indigo-500 kb-cursor-pointer' : ''}`;
    
    // Add special styling for newly created tasks
    if (isNewlyCreated) {
      baseStyles += ' kb-task-newly-created';
    }
    
    // Add special styling for edited tasks
    if (isEdited) {
      baseStyles += ' kb-task-edited';
    }
    
    // Add animation styles if present
    if (animationStyles) {
      return `${baseStyles} ${animationStyles}`;
    }
    
    return baseStyles;
  };

  // Render status badges
  const renderStatusBadges = () => {
    if (!isNewlyCreated && !isEdited) return null;

    return (
      <div className="kb-absolute kb-top-2 kb-right-2 kb-flex kb-gap-1 kb-z-10">
        {isNewlyCreated && (
          <div 
            className="kb-badge-new kb-px-2 kb-py-1 kb-rounded-full kb-text-xs kb-font-medium kb-text-white kb-bg-violet-500 kb-shadow-sm kb-animate-badge-fade-in"
            role="status"
            aria-label="New task created during workflow"
            title="This task appeared after the workflow started"
          >
            NEW
          </div>
        )}
        {isEdited && (
          <div 
            className="kb-badge-edited kb-px-2 kb-py-1 kb-rounded-full kb-text-xs kb-font-medium kb-text-white kb-bg-cyan-500 kb-shadow-sm kb-animate-badge-pulse"
            role="status"
            aria-label="Task adapted during workflow"
            title="This task was modified/adopted during the workflow"
          >
            EDIT
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`${getCardStyles()} kb-relative`}
      onClick={() => {
        if (showOptions) setSelectedTaskAction(task);
      }}
    >
      {renderStatusBadges()}
      <p className="kb-text-sm kb-text-white kb-line-clamp-2">
        {task.description}
      </p>
      <div className="kb-flex kb-gap-2 kb-items-center kb-flex-wrap">
        {showOptions && (
          <div className="kb-relative kb-group kb-flex kb-items-center">
            <Button className="kb-text-slate-400 focus:kb-outline-none data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white">
              <Bars3BottomLeftIcon className="kb-w-5 kb-h-5" />
            </Button>
            <Tooltip text="View details" styles="kb-left-0" />
          </div>
        )}
        {showOptions && isAwaiting && (
          <div className="kb-flex kb-items-center kb-bg-indigo-500/15 kb-py-1 kb-px-2 kb-rounded-full">
            <span className="kb-text-xs kb-text-indigo-500 kb-font-medium">
              Awaiting Validation
            </span>
          </div>
        )}
        <div className="kb-ml-auto">
          <AgentAvatar agent={task.agent} size="lg" />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
