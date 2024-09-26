import React from 'react';
import { useEffect } from 'react';
import { Button } from '@headlessui/react';
import JSConfetti from 'js-confetti';
import toast from 'react-hot-toast';
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import { ArrowsPointingInIcon, ArrowsPointingOutIcon, Cog6ToothIcon, ShareIcon } from '@heroicons/react/24/outline';
import Spinner from '../Common/Spinner';
import ProjectName from '../ProjectName';
import Tooltip from '../Common/Tooltip';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import { getLastBlockedWorkflowDescription, isAwaitingValidation } from '../../utils/helper';

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
        toggleMaximizeAction
    } = useAgentsPlaygroundStore(
        (state) => ({
            teamStore: state.teamStore,
            errorState: state.errorState,
            setTabAction: state.setTabAction,
            uiSettings: state.uiSettings,
            setExecutionDialogOpenAction: state.setExecutionDialogOpenAction,
            setCelebrationDialogOpenAction: state.setCelebrationDialogOpenAction,
            setTaskDetailsDialogOpenAction: state.setTaskDetailsDialogOpenAction,
            setShareDialogOpenAction: state.setShareDialogOpenAction,
            setSettingsDialogOpenAction: state.setSettingsDialogOpenAction,
            toggleMaximizeAction: state.toggleMaximizeAction
        })
    );

    const {
        startWorkflow,
        teamWorkflowStatus,
        workflowLogs
    } = teamStore(state => ({
        startWorkflow: state.startWorkflow,
        teamWorkflowStatus: state.teamWorkflowStatus,
        workflowLogs: state.workflowLogs
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
                    toast('The workflow is awaiting validation. Please validate the task to continue.', { icon: '🚦' });
                } else {
                    const message = getLastBlockedWorkflowDescription(workflowLogs);
                    toast.error(`${message} Please try running it again.`, {
                        duration: 6000,
                    });
                }
                break;
            default:
                setTabAction(0);
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [teamWorkflowStatus]);

    const handleStartWorkflow = () => {
        setExecutionDialogOpenAction(true);
        setTimeout(() => {
            setExecutionDialogOpenAction(false);
            setTabAction(1);
            setTimeout(() => {
                startWorkflow();
            }, 1000);
        }, 3000);
    };

    return (
        <div className="flex h-[55px] items-center gap-4 border-b border-slate-700">
            <div className="flex md:gap-4 w-max pl-3">
                <ProjectName />
                {uiSettings.showExampleMenu && (
                    <>{examplesMenu}</>
                )}
            </div>
            <div className="flex items-center gap-2 w-max h-max ml-auto pr-3.5">
                <>
                    {teamWorkflowStatus !== 'RUNNING' && (
                        <>
                            {!uiSettings.showFullScreen && (
                                <div className="relative group flex items-center">
                                    <button className="w-min inline-flex items-center p-2 text-slate-400 focus:outline-none hover:text-indigo-500"
                                        onClick={() => { toggleMaximizeAction() }}
                                    >
                                        {uiSettings.maximizeConfig?.isActive ? <ArrowsPointingInIcon className="w-6 h-6" /> : <ArrowsPointingOutIcon className="w-6 h-6" />}
                                    </button>
                                    {uiSettings.maximizeConfig?.isActive ? <Tooltip text="Exit Full Screen" styles="left-2" /> : <Tooltip text="Full Screen" styles="left-2" />}
                                </div>
                            )}
                            {uiSettings.showSettingsOption && (
                                <div className="relative group flex items-center">
                                    <button className="w-min inline-flex items-center p-2 text-slate-400 focus:outline-none hover]:text-indigo-500 data-[focus]:outline-1 data-[focus]:outline-white"
                                        onClick={() => { setSettingsDialogOpenAction(true) }}
                                    >
                                        <Cog6ToothIcon className="w-6 h-6" />
                                    </button>
                                    <Tooltip text="Settings" styles="left-2" />
                                </div>
                            )}
                            {uiSettings.showShareOption && (
                                <Button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 py-1.5 px-3 text-sm font-medium text-slate-400 focus:outline-none data-[hover]:bg-indigo-500/15 data-[hover]:text-indigo-500 data-[focus]:outline-1 data-[focus]:outline-white data-[disabled]:bg-slate-800"
                                    onClick={() => { setShareDialogOpenAction(true) }}>
                                    <ShareIcon className="w-5 h-5" />
                                    Share
                                </Button>
                            )}
                        </>
                    )}
                </>
                {teamWorkflowStatus === 'RUNNING' && (
                    <div className="flex items-center gap-2 px-2">
                        <Spinner />
                        <span className="text-xs font-medium text-slate-400">Team is working...</span>
                    </div>
                )}
                <Button className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 py-1.5 px-3 text-sm font-medium text-white focus:outline-none data-[hover]:bg-indigo-600 data-[focus]:outline-1 data-[focus]:outline-white data-[disabled]:bg-slate-800"
                    disabled={teamWorkflowStatus === 'RUNNING' || errorState.hasError}
                    onClick={() => { handleStartWorkflow() }}>
                    <PlayCircleIcon className="w-5 h-5" />
                    Start Workflow
                </Button>
            </div>
        </div>
    );
};

export default Header;