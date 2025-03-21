import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@headlessui/react';
import MDEditor from '@uiw/react-md-editor';
import { Bars3BottomLeftIcon, ChartBarIcon, CheckCircleIcon, ClipboardIcon, IdentificationIcon, ListBulletIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import AgentAvatar from '../Common/AgentAvatar';
import ModelLogo from '../Common/ModelLogo';
import { copyToClipboard, filterAndFormatAgentLogs, filterAndExtractMetadata, isAwaitingValidation } from '../../utils/helper';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import ActivityDetails from '../Common/ActivityDetails';
import { UserIcon } from '@heroicons/react/24/solid';
import ResizableTextarea from '../Common/ResizableTextarea';

const TaskDetailsDialog = () => {
    const useAgentsPlaygroundStore = usePlaygroundStore();
    const containerRef = useRef();
    const [task, setTask] = useState(null);
    const [logs, setLogs] = useState(null);
    const [stats, setStats] = useState(null);

    const [isAwaiting, setIsAwaiting] = useState(false);
    const [isCommentTouched, setIsCommentTouched] = useState(false);
    const [comment, setComment] = useState('');
    const [feedback, setFeedback] = useState('');

    const {
        teamStore,
        selectedTask,
        setTaskDetailsDialogOpenAction
    } = useAgentsPlaygroundStore(
        (state) => ({
            teamStore: state.teamStore,
            selectedTask: state.selectedTask,
            setTaskDetailsDialogOpenAction: state.setTaskDetailsDialogOpenAction
        })
    );

    const {
        workflowLogs,
        teamWorkflowStatus,
        validateTask,
        provideFeedback
    } = teamStore(state => ({
        workflowLogs: state.workflowLogs,
        teamWorkflowStatus: state.teamWorkflowStatus,
        validateTask: state.validateTask,
        provideFeedback: state.provideFeedback
    }));

    // INFO: Close dialog when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setTaskDetailsDialogOpenAction(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    // INFO: Update task lists
    useEffect(() => {
        setTask(selectedTask);
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    // INFO: Update task lists when tasks change
    useEffect(() => {
        const unsubscribeFromTeamStore = teamStore.subscribe((state, prev) => {
            if (state.tasks !== prev.tasks) {
                const task = state.tasks.find(task => task.id === selectedTask.id);
                setTask(task);
            }
        });

        return unsubscribeFromTeamStore;
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    // INFO: Update task lists when workflow logs change
    useEffect(() => {
        const unsubscribeFromTeamStore = teamStore.subscribe((state, prev) => {
            if (state.workflowLogs !== prev.workflowLogs) {
                const logs = filterAndFormatAgentLogs(state.workflowLogs, selectedTask.id);
                setLogs(logs);

                const stats = filterAndExtractMetadata(state.workflowLogs, selectedTask.id);
                setStats(stats);

                const awaiting = isAwaitingValidation(state.workflowLogs, selectedTask.id);
                if (awaiting !== isAwaiting) {
                    setIsAwaiting(awaiting);
                }
            }
        });

        return unsubscribeFromTeamStore;
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    // INFO: Update logs
    useEffect(() => {
        if (workflowLogs.length > 0) {
            const logs = filterAndFormatAgentLogs(workflowLogs, selectedTask.id);
            setLogs(logs);

            const stats = filterAndExtractMetadata(workflowLogs, selectedTask.id);
            setStats(stats);

            const awaiting = isAwaitingValidation(workflowLogs, selectedTask.id);
            if (awaiting !== isAwaiting) {
                setIsAwaiting(awaiting);
            }
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    const getTaskTitle = (task) => {
        if (!task) return '';

        return task.title || (task.description ? task.description.split(" ").slice(0, 3).join(" ") + '...' : 'Untitled');
    };

    return (
        <div className="kb-absolute kb-w-full kb-h-full kb-inset-0 kb-bg-slate-950/50 kb-overflow-auto">
            <div className="kb-flex kb-min-h-full kb-items-center kb-justify-center kb-p-4">
                <div ref={containerRef} className="kb-z-40 kb-w-full kb-max-w-lg kb-rounded-xl kb-bg-white/5 kb-p-6 kb-backdrop-blur-2xl">
                    {/* --- HEADER --- */}
                    <div className="kb-flex kb-items-center kb-gap-4">
                        < IdentificationIcon className="kb-w-5 kb-h-5 kb-text-slate-200" />
                        <div className="kb-relative">
                            <h3 className="kb-text-lg kb-font-medium kb-text-white">
                                {getTaskTitle(task)}
                            </h3>
                            <p className="kb-absolute kb-text-sm/6 kb-text-slate-400">
                                in list {task?.status === 'TODO' ? 'To Do' : task?.status === 'DOING' ? 'Doing' : task?.status === 'BLOCKED' ? 'Blocked' : 'Done'}
                            </p>
                        </div>

                        <Button className="kb-ml-auto kb-text-slate-400 focus:kb-outline-none data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
                            onClick={() => setTaskDetailsDialogOpenAction(false)}
                        >
                            <XMarkIcon className="kb-w-5 kb-h-5" />
                        </Button>
                    </div>
                    {/* --- HEADER --- */}
                    {/* --- INFO --- */}
                    <div className="kb-mt-8 kb-pl-[36px] kb-flex kb-gap-6">
                        <div>
                            <span className="kb-text-xs kb-font-medium kb-text-slate-200">Members</span>
                            <div className="kb-flex kb-mt-1">
                                <AgentAvatar agent={task?.agent} size="md" showBorder={false} />
                            </div>
                        </div>
                        <div>
                            <span className="kb-text-xs kb-font-medium kb-text-slate-200">Provider</span>
                            <div className="kb-flex kb-items-center kb-mt-1 kb-h-[32px]">
                                <ModelLogo model={task?.agent?.agentInstance?.llmConfig?.provider || "openai"} size={24} />
                            </div>
                        </div>
                        <div>
                            <span className="kb-text-xs kb-font-medium kb-text-slate-200">Model</span>
                            <div className="kb-flex kb-items-center kb-mt-1 kb-h-[32px]">
                                <span className="kb-text-xs kb-font-normal kb-text-slate-400">{task?.agent?.agentInstance?.llmConfig?.model || "gpt-3.5"}</span>
                            </div>
                        </div>
                    </div>
                    {/* --- INFO --- */}
                    {/* --- DESCRIPTION --- */}
                    <div className="kb-flex kb-items-center kb-gap-4 kb-mt-8 kb-text-slate-400">
                        < Bars3BottomLeftIcon className="kb-w-5 kb-h-5" />
                        <h3 className="kb-text-base/7 kb-font-medium">
                            Description
                        </h3>
                    </div>
                    <div className="kb-pl-[36px]">
                        <span className="kb-text-sm kb-text-white">
                            {task?.description}
                        </span>
                    </div>
                    {/* --- DESCRIPTION --- */}
                    {/* --- RESULT --- */}
                    <div className="kb-flex kb-items-center kb-gap-4 kb-mt-8 kb-text-slate-400">
                        <SparklesIcon className="kb-w-5 kb-h-5" />
                        <h3 className="kb-text-base/7 kb-font-medium">
                            Result
                        </h3>

                        {task?.result && (
                            <Button className="kb-ml-auto kb-inline-flex kb-items-center kb-gap-2 kb-rounded-lg kb-bg-slate-900 kb-py-1 kb-px-2.5 kb-text-slate-400 kb-text-sm focus:kb-outline-none data-[hover]:kb-bg-indigo-500/15 data-[hover]:kb-text-indigo-500 data-[open]:kb-bg-gray-700 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
                                onClick={() => { copyToClipboard(typeof task?.result === 'string' ? task?.result : JSON.stringify(task?.result)) }}>
                                <ClipboardIcon className="kb-w-4 kb-h-4" />
                                Copy
                            </Button>
                        )}
                    </div>
                    {task?.result ? (
                        <div className="kb-p-4 kb-mt-2 kb-rounded-lg" style={{ background: "#0C1117" }}>
                            <div data-color-mode="dark">
                                <MDEditor.Markdown source={typeof task?.result === 'string' ? task?.result : JSON.stringify(task?.result)} height={160} overflow={false} />
                            </div>
                        </div>
                    ) : (
                        <div className="kb-pl-[36px] kb-min-w-full">
                            <span className="kb-text-slate-400 kb-text-xs kb-font-normal">{'No result in this task'}</span>
                        </div>
                    )}
                    {/* --- RESULT --- */}
                    {/* --- STATS --- */}
                    <div className="kb-flex kb-items-center kb-gap-4 kb-mt-8 kb-text-slate-400">
                        <ChartBarIcon className="kb-w-5 kb-h-5" />
                        <h3 className="kb-text-base/7 kb-font-medium">
                            Stats
                        </h3>
                    </div>
                    <div className="kb-pl-[36px]">
                        {stats ? (
                            <div className="kb-flex kb-gap-x-6 kb-gap-y-2 kb-flex-wrap">
                                <div className="kb-flex kb-gap-1">
                                    <span className="kb-text-xs kb-font-medium kb-text-slate-200">Total Tokens:</span>
                                    <span className="kb-text-xs kb-font-normal kb-text-slate-400">{stats.llmUsageStats?.inputTokens + stats.llmUsageStats?.outputTokens}</span>
                                </div>
                                <div className="kb-flex kb-gap-1">
                                    <span className="kb-text-xs kb-font-medium kb-text-slate-200">Total Cost:</span>
                                    <span className="kb-text-xs kb-font-normal kb-text-slate-400">${stats.costDetails?.totalCost}</span>
                                </div>
                                <div className="kb-flex kb-gap-1">
                                    <span className="kb-text-xs kb-font-medium kb-text-slate-200">Duration:</span>
                                    <span className="kb-text-xs kb-font-normal kb-text-slate-400">{stats.duration}</span>
                                </div>
                            </div>
                        ) : (
                            <span className="kb-text-slate-400 kb-text-xs kb-font-normal">{`No stats in this task`}</span>
                        )}
                    </div>
                    {/* --- STATS --- */}
                    {/* --- ACTIVITY --- */}
                    <div className="kb-flex kb-items-center kb-gap-4 kb-mt-8 kb-text-slate-400">
                        <ListBulletIcon className="kb-w-5 kb-h-5" />
                        <h3 className="kb-text-base/7 kb-font-medium">
                            Activity
                        </h3>
                    </div>
                    {logs && logs.length !== 0 ? (
                        <>
                            {/* ACTIONS */}
                            {teamWorkflowStatus !== 'RUNNING' && (
                                <div className="kb-mt-2 kb-mb-4 kb-flex kb-flex-col kb-gap-4 kb-min-w-full">
                                    <div className="kb-grid kb-grid-cols-[28px_1fr] kb-gap-2">
                                        <div className="kb-bg-slate-950/50 kb-text-slate-500 kb-rounded-full kb-w-7 kb-h-7 kb-flex kb-justify-center kb-relative">
                                            <UserIcon className="kb-w-5 kb-h-5 kb-absolute kb-bottom-0" />
                                        </div>
                                        <div className="kb-flex kb-flex-col kb-gap-2">
                                            {task.externalValidationRequired && isAwaiting ? (
                                                <div className="kb-flex kb-flex-col kb-gap-2">
                                                    <ResizableTextarea
                                                        value={feedback}
                                                        onChange={(event) => setFeedback(event.target.value)}
                                                        placeholder="Write a feedback..."
                                                        keepExpandedOnBlur={true}
                                                    />
                                                    <div className="kb-flex kb-gap-2">
                                                        <Button
                                                            className="kb-flex-1 kb-inline-flex kb-items-center kb-justify-center kb-gap-2 kb-rounded-md kb-bg-slate-800 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-slate-400 focus:kb-outline-none data-[hover]:kb-bg-indigo-500/15 data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white data-[disabled]:kb-text-slate-600 data-[disabled]:kb-bg-slate-800/50"
                                                            onClick={() => {
                                                                provideFeedback(selectedTask.id, feedback);
                                                                setFeedback('');
                                                                setTaskDetailsDialogOpenAction(false);
                                                            }}
                                                            disabled={feedback === ''}
                                                        >
                                                            <span className="kb-hidden md:kb-block">Submit Feedback</span>
                                                            <span className="kb-block md:kb-hidden">Submit</span>
                                                        </Button>
                                                        <Button
                                                            className="kb-flex-1 kb-inline-flex kb-items-center kb-justify-center kb-gap-2 kb-rounded-md kb-bg-indigo-500 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-white focus:kb-outline-none data-[hover]:kb-bg-indigo-600 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
                                                            onClick={() => {
                                                                validateTask(selectedTask.id);
                                                                setFeedback('');
                                                                setTaskDetailsDialogOpenAction(false);
                                                            }}
                                                        >
                                                            <CheckCircleIcon className="kb-w-5 kb-h-5" />
                                                            Approve
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="kb-flex kb-flex-col kb-gap-2">
                                                    <ResizableTextarea
                                                        value={comment}
                                                        onChange={(event) => setComment(event.target.value)}
                                                        onFocus={() => setIsCommentTouched(true)}
                                                        placeholder="Write a comment..."
                                                        keepExpandedOnBlur={true}
                                                    />
                                                    {isCommentTouched && (
                                                        <Button
                                                            className="kb-w-max kb-inline-flex kb-items-center kb-justify-center kb-gap-2 kb-rounded-md kb-bg-indigo-500 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-white focus:kb-outline-none data-[hover]:kb-bg-indigo-600 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white data-[disabled]:kb-text-slate-600 data-[disabled]:kb-bg-indigo-500/10"
                                                            onClick={() => {
                                                                provideFeedback(selectedTask.id, comment);
                                                                setComment('');
                                                                setIsCommentTouched(false);
                                                                setTaskDetailsDialogOpenAction(false);
                                                            }}
                                                            disabled={comment === ''}
                                                        >
                                                            Submit Comment
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* ACTIONS */}
                            {/* LOGS */}
                            <div className="kb-mt-2 kb-flex kb-flex-col kb-gap-4 kb-min-w-full">
                                {logs?.map((log, idx) => (
                                    <div key={idx} className="kb-grid kb-grid-cols-[28px_1fr] kb-gap-2">
                                        {(log.status === "REVISE" || log.status === "VALIDATED") ? (
                                            <div className="kb-bg-slate-950/50 kb-text-slate-500 kb-rounded-full kb-w-7 kb-h-7 kb-flex kb-justify-center kb-relative">
                                                <UserIcon className="kb-w-5 kb-h-5 kb-absolute kb-bottom-0" />
                                            </div>
                                        ) : (
                                            <div>
                                                <AgentAvatar agent={{ name: log.agent }} showBorder={false} />
                                            </div>
                                        )}
                                        <div className="kb-flex kb-flex-col kb-gap-1">
                                            <p>
                                                <span className="kb-text-sm kb-font-medium kb-text-slate-200">{(log.status === "REVISE" || log.status === "VALIDATED") ? 'Anonymous' : log.agent}</span>
                                                <span className="kb-text-sm kb-font-normal kb-text-slate-400">{log.description}</span>
                                            </p>
                                            {log.details !== "" && (
                                                <ActivityDetails details={log.details} />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* LOGS */}
                        </>
                    ) : (
                        <div className="kb-pl-[36px] kb-min-w-full">
                            <span className="kb-text-slate-400 kb-text-xs kb-font-normal">{'No activities in this task'}</span>
                        </div>
                    )}
                    {/* --- ACTIVITY --- */}
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsDialog;