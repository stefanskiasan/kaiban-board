/* eslint-disable react/prop-types */
import React from 'react';
import { useEffect } from 'react';
import { Button } from '@headlessui/react';
import JSConfetti from 'js-confetti';
import toast from 'react-hot-toast';
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import {
  PauseCircleIcon,
  StopCircleIcon,
  ArrowPathIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  Cog6ToothIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import Spinner from '../Common/Spinner';
import ProjectName from '../ProjectName';
import Tooltip from '../Common/Tooltip';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import {
  checkApiKeys,
  getLastBlockedWorkflowDescription,
  isAwaitingValidation,
} from '../../utils/helper';
import ExampleTeams from '../ExampleTeams';

const Header = ({ examplesMenu }) => {
  const useAgentsPlaygroundStore = usePlaygroundStore();
  const {
    teamStore,
    errorState,
    setTabAction,
    uiSettings,
    setExecutionDialogOpenAction,
    setCelebrationDialogOpenAction,
    setTaskDetailsDialogOpenAction,
    setShareDialogOpenAction,
    setSettingsDialogOpenAction,
    toggleMaximizeAction,
    simpleShareAction,
    setMissingKeysDialogOpenAction,
  } = useAgentsPlaygroundStore(state => ({
    teamStore: state.teamStore,
    errorState: state.errorState,
    setTabAction: state.setTabAction,
    uiSettings: state.uiSettings,
    setExecutionDialogOpenAction: state.setExecutionDialogOpenAction,
    setCelebrationDialogOpenAction: state.setCelebrationDialogOpenAction,
    setTaskDetailsDialogOpenAction: state.setTaskDetailsDialogOpenAction,
    setShareDialogOpenAction: state.setShareDialogOpenAction,
    setSettingsDialogOpenAction: state.setSettingsDialogOpenAction,
    toggleMaximizeAction: state.toggleMaximizeAction,
    simpleShareAction: state.simpleShareAction,
    setMissingKeysDialogOpenAction: state.setMissingKeysDialogOpenAction,
  }));

  const {
    startWorkflow,
    pauseWorkflow,
    resumeWorkflow,
    stopWorkflow,
    teamWorkflowStatus,
    workflowLogs,
  } = teamStore(state => ({
    startWorkflow: state.startWorkflow,
    pauseWorkflow: state.pauseWorkflow,
    resumeWorkflow: state.resumeWorkflow,
    stopWorkflow: state.stopWorkflow,
    teamWorkflowStatus: state.teamWorkflowStatus,
    workflowLogs: state.workflowLogs,
  }));

  useEffect(() => {
    switch (teamWorkflowStatus) {
      case 'RUNNING':
        setTabAction(1);
        break;
      case 'FINISHED':
        setTaskDetailsDialogOpenAction(false);
        setCelebrationDialogOpenAction(true);
        const canvas = document.getElementById('confetti_canvas');
        const jsConfetti = new JSConfetti({ canvas });
        jsConfetti.addConfetti();
        break;
      case 'ERRORED':
        setTabAction(1);
        toast.error('An error occurred while running the workflow.');
        break;
      case 'BLOCKED':
        const isAwaiting = isAwaitingValidation(workflowLogs);
        if (isAwaiting) {
          toast(
            'The workflow is awaiting validation. Please validate the task to continue.',
            { icon: '🚦' }
          );
        } else {
          const message = getLastBlockedWorkflowDescription(workflowLogs);
          toast.error(`${message} Please try running it again.`, {
            duration: 6000,
          });
        }
        break;
      case 'PAUSED':
        toast.success('Workflow paused. You can resume when ready.');
        break;
      case 'RESUMED':
        toast.success('Workflow resumed successfully!');
        break;
      case 'STOPPING':
        toast.success('Stopping workflow...');
        break;
      case 'STOPPED':
        toast.success('Workflow stopped.');
        break;
      default:
        setTabAction(0);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [teamWorkflowStatus]);

  const handleStartWorkflow = () => {
    const missingKeys = checkApiKeys(teamStore);

    if (missingKeys.length > 0) {
      setMissingKeysDialogOpenAction(true);
    } else {
      setExecutionDialogOpenAction(true);
      setTimeout(() => {
        setExecutionDialogOpenAction(false);
        setTabAction(1);
        setTimeout(() => {
          startWorkflow();
        }, 1000);
      }, 3000);
    }
  };

  const handlePauseWorkflow = () => {
    pauseWorkflow();
  };

  const handleResumeWorkflow = () => {
    resumeWorkflow();
  };

  const handleStopWorkflow = () => {
    stopWorkflow();
  };

  const renderWorkflowButton = () => {
    switch (teamWorkflowStatus) {
      case 'RUNNING':
        return (
          <Button
            className="kb-inline-flex kb-items-center kb-gap-2 kb-rounded-lg kb-bg-indigo-500 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-white focus:kb-outline-none data-[hover]:kb-bg-indigo-600 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white data-[disabled]:kb-bg-slate-800"
            onClick={handlePauseWorkflow}
          >
            <PauseCircleIcon className="kb-w-5 kb-h-5" />
            <span className="kb-hidden md:kb-block">Pause Workflow</span>
            <span className="kb-block md:kb-hidden">Pause</span>
          </Button>
        );
      case 'PAUSED':
        return (
          <Button
            className="kb-inline-flex kb-items-center kb-gap-2 kb-rounded-lg kb-bg-indigo-500 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-white focus:kb-outline-none data-[hover]:kb-bg-indigo-600 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white data-[disabled]:kb-bg-slate-800"
            onClick={handleResumeWorkflow}
          >
            <PlayCircleIcon className="kb-w-5 kb-h-5" />
            <span className="kb-hidden md:kb-block">Resume Workflow</span>
            <span className="kb-block md:kb-hidden">Resume</span>
          </Button>
        );
      case 'STOPPING':
        return (
          <Button
            disabled
            className="kb-inline-flex kb-items-center kb-gap-2 kb-rounded-lg kb-bg-gray-500 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-white data-[disabled]:kb-opacity-50"
          >
            <ArrowPathIcon className="kb-w-5 kb-h-5 kb-animate-spin" />
            <span className="kb-hidden md:kb-block">Stopping...</span>
          </Button>
        );
      case 'STOPPED':
      case 'FINISHED':
      case 'ERRORED':
      case 'BLOCKED':
      default:
        return (
          <Button
            className="kb-inline-flex kb-items-center kb-gap-2 kb-rounded-lg kb-bg-indigo-500 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-white focus:kb-outline-none data-[hover]:kb-bg-indigo-600 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white data-[disabled]:kb-bg-slate-800"
            disabled={errorState.hasError}
            onClick={handleStartWorkflow}
          >
            <PlayCircleIcon className="kb-w-5 kb-h-5" />
            <span className="kb-hidden md:kb-block">Start Workflow</span>
            <span className="kb-block md:kb-hidden">Start</span>
          </Button>
        );
    }
  };

  return (
    <div className="kb-flex kb-h-[55px] kb-items-center kb-gap-4 kb-border-b kb-border-slate-700">
      <div className="kb-flex md:kb-gap-4 kb-w-max kb-pl-3">
        <ProjectName />
        {uiSettings.showExampleMenu && <>{examplesMenu}</>}
        {uiSettings.showExampleTeams && <ExampleTeams />}
      </div>
      <div className="kb-flex kb-items-center kb-gap-2 kb-w-max kb-h-max kb-ml-auto kb-pr-3.5">
        <>
          {teamWorkflowStatus !== 'RUNNING' &&
            teamWorkflowStatus !== 'PAUSED' && (
              <>
                {!uiSettings.showFullScreen && (
                  <div className="kb-relative kb-group kb-flex kb-items-center">
                    <Button
                      className="kb-w-min kb-inline-flex kb-items-center kb-p-2 kb-text-slate-400 data-[focus]:kb-outline-none data-[hover]:kb-text-indigo-500"
                      onClick={() => {
                        toggleMaximizeAction();
                      }}
                    >
                      {uiSettings.maximizeConfig?.isActive ? (
                        <ArrowsPointingInIcon className="kb-w-6 kb-h-6" />
                      ) : (
                        <ArrowsPointingOutIcon className="kb-w-6 kb-h-6" />
                      )}
                    </Button>
                    {uiSettings.maximizeConfig?.isActive ? (
                      <Tooltip text="Exit Full Screen" styles="kb-left-2" />
                    ) : (
                      <Tooltip text="Full Screen" styles="kb-left-2" />
                    )}
                  </div>
                )}
                {uiSettings.showSettingsOption && (
                  <div className="kb-hidden md:kb-flex kb-relative kb-group kb-items-center">
                    <Button
                      className="kb-w-min kb-inline-flex kb-items-center kb-p-2 kb-text-slate-400 data-[focus]:kb-outline-none data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
                      onClick={() => {
                        setSettingsDialogOpenAction(true);
                      }}
                    >
                      <Cog6ToothIcon className="kb-w-6 kb-h-6" />
                    </Button>
                    <Tooltip text="Settings" styles="kb-left-2" />
                  </div>
                )}
                {uiSettings.showShareOption && (
                  <Button
                    className="kb-hidden md:kb-inline-flex kb-items-center kb-gap-2 kb-rounded-lg kb-bg-slate-900 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-slate-400 data-[focus]:kb-outline-none data-[hover]:kb-bg-indigo-500/15 data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white data-[disabled]:kb-bg-slate-800"
                    onClick={() => {
                      setShareDialogOpenAction(true);
                    }}
                  >
                    <ShareIcon className="kb-w-5 kb-h-5" />
                    <span>Share</span>
                  </Button>
                )}
                {uiSettings.showSimpleShareOption && (
                  <Button
                    className="kb-inline-flex kb-items-center kb-gap-2 kb-rounded-lg kb-bg-slate-900 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-slate-400 focus:kb-outline-none data-[hover]:kb-bg-indigo-500/15 data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white data-[disabled]:kb-bg-slate-800"
                    onClick={() => {
                      simpleShareAction();
                    }}
                  >
                    <ShareIcon className="kb-w-5 kb-h-5" />
                    <span className="kb-hidden md:kb-block">Share</span>
                  </Button>
                )}
              </>
            )}
        </>
        {teamWorkflowStatus === 'RUNNING' && (
          <div className="kb-flex kb-items-center kb-gap-2 kb-px-2">
            <Spinner />
            <span className="kb-text-xs kb-font-medium kb-text-slate-400 kb-hidden md:kb-block">
              Team is working...
            </span>
          </div>
        )}
        {teamWorkflowStatus === 'PAUSED' && (
          <div className="kb-flex kb-items-center kb-gap-2 kb-px-2">
            <span className="kb-text-xs kb-font-medium kb-text-slate-400 kb-hidden md:kb-block">
              Workflow paused
            </span>
          </div>
        )}
        {teamWorkflowStatus === 'STOPPING' && (
          <div className="kb-flex kb-items-center kb-gap-2 kb-px-2">
            <Spinner />
            <span className="kb-text-xs kb-font-medium kb-text-slate-400 kb-hidden md:kb-block">
              Stopping workflow...
            </span>
          </div>
        )}
        {renderWorkflowButton()}
        {(teamWorkflowStatus === 'RUNNING' ||
          teamWorkflowStatus === 'PAUSED') && (
          <div className="kb-relative kb-group">
            <Button
              className="kb-inline-flex kb-items-center kb-gap-2 kb-rounded-lg kb-bg-red-500/20 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-red-400 focus:kb-outline-none data-[hover]:kb-bg-red-500/30 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white data-[disabled]:kb-bg-slate-800"
              onClick={handleStopWorkflow}
            >
              <StopCircleIcon className="kb-w-5 kb-h-5" />
              <span className="kb-hidden md:kb-block">Stop</span>
            </Button>
            <Tooltip text="Stop Workflow" styles="kb-left-2" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
