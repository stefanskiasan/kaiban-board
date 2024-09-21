import React, { useEffect, useRef, useState } from 'react';
import { Button, Textarea } from '@headlessui/react';
import MDEditor from '@uiw/react-md-editor';
import { Bars3BottomLeftIcon, ChartBarIcon, CheckCircleIcon, ClipboardIcon, IdentificationIcon, ListBulletIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import AgentAvatar from '../Common/AgentAvatar';
import ModelLogo from '../Common/ModelLogo';
import { copyToClipboard, filterAndFormatAgentLogs, filterAndExtractMetadata, isAwaitingValidation } from '../../utils/helper';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import ActivityDetails from '../Common/ActivityDetails';
import { UserIcon } from '@heroicons/react/24/solid';

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
    }, []);

    const getTaskTitle = (task) => {
        if (!task) return '';

        return task.title || (task.description ? task.description.split(" ").slice(0, 3).join(" ") + '...' : 'Untitled');
    };

    return (
        <div className="absolute w-full h-full inset-0 bg-slate-950/50 overflow-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <div ref={containerRef} className="z-40 w-full max-w-lg rounded-xl bg-white/5 p-6 backdrop-blur-2xl">
                    {/* --- HEADER --- */}
                    <div className="flex items-center gap-4">
                        < IdentificationIcon className="w-5 h-5 text-slate-200" />
                        <div className="relative">
                            <h3 className="text-lg font-medium text-white">
                                {getTaskTitle(task)}
                            </h3>
                            <p className="absolute text-sm/6 text-slate-400">
                                in list {task?.status === 'TODO' ? 'To Do' : task?.status === 'DOING' ? 'Doing' : task?.status === 'BLOCKED' ? 'Blocked' : 'Done'}
                            </p>
                        </div>

                        <Button className="ml-auto text-slate-400 focus:outline-none data-[hover]:text-indigo-500 data-[focus]:outline-1 data-[focus]:outline-white"
                            onClick={() => setTaskDetailsDialogOpenAction(false)}
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </Button>
                    </div>
                    {/* --- HEADER --- */}
                    {/* --- INFO --- */}
                    <div className="mt-8 pl-[36px] flex gap-6">
                        <div>
                            <span className="text-xs font-medium text-slate-200">Members</span>
                            <div className="flex mt-1">
                                <AgentAvatar agent={task?.agent} size="md" />
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-medium text-slate-200">Provider</span>
                            <div className="flex items-center mt-1 h-[32px]">
                                <ModelLogo model={task?.agent?.agentInstance?.llmConfig?.provider || "openai"} size={24} />
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-medium text-slate-200">Model</span>
                            <div className="flex items-center mt-1 h-[32px]">
                                <span className="text-xs font-normal text-slate-400">{task?.agent?.agentInstance?.llmConfig?.model || "gpt-3.5"}</span>
                            </div>
                        </div>
                    </div>
                    {/* --- INFO --- */}
                    {/* --- DESCRIPTION --- */}
                    <div className="flex items-center gap-4 mt-8 text-slate-400">
                        < Bars3BottomLeftIcon className="w-5 h-5" />
                        <h3 className="text-base/7 font-medium">
                            Description
                        </h3>
                    </div>
                    <div className="pl-[36px]">
                        <span className="text-sm text-white">
                            {task?.description}
                        </span>
                    </div>
                    {/* --- DESCRIPTION --- */}
                    {/* --- RESULT --- */}
                    <div className="flex items-center gap-4 mt-8 text-slate-400">
                        <SparklesIcon className="w-5 h-5" />
                        <h3 className="text-base/7 font-medium">
                            Result
                        </h3>

                        {task?.result && (
                            <Button className="ml-auto inline-flex items-center gap-2 rounded-lg bg-slate-900  py-1 px-2.5 text-slate-400 text-sm focus:outline-none data-[hover]:bg-indigo-500/15 data-[hover]:text-indigo-500 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                                onClick={() => { copyToClipboard(typeof task?.result === 'string' ? task?.result : JSON.stringify(task?.result)) }}>
                                <ClipboardIcon className="w-4 h-4" />
                                Copy
                            </Button>
                        )}
                    </div>
                    {task?.result ? (
                        <div className="p-4 mt-2 rounded-lg" style={{ background: "#0C1117" }}>
                            <div data-color-mode="dark">
                                <MDEditor.Markdown source={typeof task?.result === 'string' ? task?.result : JSON.stringify(task?.result)} height={160} overflow={false} />
                            </div>
                        </div>
                    ) : (
                        <div className="pl-[36px] min-w-full">
                            <span className="text-slate-400 text-xs font-normal">{'No result in this task'}</span>
                        </div>
                    )}
                    {/* --- RESULT --- */}
                    {/* --- STATS --- */}
                    <div className="flex items-center gap-4 mt-8 text-slate-400">
                        <ChartBarIcon className="w-5 h-5" />
                        <h3 className="text-base/7 font-medium">
                            Stats
                        </h3>
                    </div>
                    <div className="pl-[36px]">
                        {stats ? (
                            <div className="flex gap-x-6 gap-y-2 flex-wrap">
                                <div className="flex gap-1">
                                    <span className="text-xs font-medium text-slate-200">Total Tokens:</span>
                                    <span className="text-xs font-normal text-slate-400">{stats.llmUsageStats?.inputTokens + stats.llmUsageStats?.outputTokens}</span>
                                </div>
                                <div className="flex gap-1">
                                    <span className="text-xs font-medium text-slate-200">Total Cost:</span>
                                    <span className="text-xs font-normal text-slate-400">${stats.costDetails?.totalCost}</span>
                                </div>
                                <div className="flex gap-1">
                                    <span className="text-xs font-medium text-slate-200">Duration:</span>
                                    <span className="text-xs font-normal text-slate-400">{stats.duration}</span>
                                </div>
                            </div>
                        ) : (
                            <span className="text-slate-400 text-xs font-normal">{`No stats in this task`}</span>
                        )}
                    </div>
                    {/* --- STATS --- */}
                    {/* --- ACTIVITY --- */}
                    <div className="flex items-center gap-4 mt-8 text-slate-400">
                        <ListBulletIcon className="w-5 h-5" />
                        <h3 className="text-base/7 font-medium">
                            Activity
                        </h3>
                    </div>
                    {logs && logs.length !== 0 ? (
                        <>
                            {/* ACTIONS */}
                            {teamWorkflowStatus !== 'RUNNING' && (
                                <div className="mt-2 mb-4 flex flex-col gap-4 min-w-full">
                                    <div className="grid grid-cols-[28px_1fr] gap-2">
                                        <div className="bg-slate-950/50 text-slate-500 rounded-full w-7 h-7 flex justify-center relative">
                                            <UserIcon className="w-5 h-5 absolute bottom-0" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {task.externalValidationRequired && isAwaiting ? (
                                                <div className="flex flex-col gap-2">
                                                    <Textarea
                                                        value={feedback}
                                                        onChange={(event) => setFeedback(event.target.value)}
                                                        placeholder="Write a feedback..."
                                                        className="block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 resize-none"
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button
                                                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-slate-800 py-1.5 px-3 text-sm font-medium text-slate-400 focus:outline-none data-[hover]:bg-indigo-500/15 data-[hover]:text-indigo-500 data-[focus]:outline-1 data-[focus]:outline-white data-[disabled]:text-slate-600 data-[disabled]:bg-slate-800/50"
                                                            onClick={() => {
                                                                provideFeedback(selectedTask.id, feedback);
                                                                setFeedback('');
                                                            }}
                                                            disabled={feedback === ''}
                                                        >
                                                            Submit Feedback
                                                        </Button>
                                                        <Button
                                                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-indigo-500 py-1.5 px-3 text-sm font-medium text-white focus:outline-none data-[hover]:bg-indigo-600 data-[focus]:outline-1 data-[focus]:outline-white"
                                                            onClick={() => {
                                                                validateTask(selectedTask.id);
                                                                setFeedback('');
                                                            }}
                                                        >
                                                            <CheckCircleIcon className="w-5 h-5" />
                                                            Approve
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    <Textarea
                                                        style={{ height: isCommentTouched ? 'auto' : '36px' }}
                                                        onFocus={() => setIsCommentTouched(true)}
                                                        value={comment}
                                                        onChange={(event) => setComment(event.target.value)}
                                                        placeholder="Write a comment..."
                                                        className="block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 resize-none"
                                                    />
                                                    {isCommentTouched && (
                                                        <Button
                                                            className="w-max inline-flex items-center justify-center gap-2 rounded-md bg-indigo-500 py-1.5 px-3 text-sm font-medium text-white focus:outline-none data-[hover]:bg-indigo-600 data-[focus]:outline-1 data-[focus]:outline-white data-[disabled]:text-slate-600 data-[disabled]:bg-indigo-500/10"
                                                            onClick={() => {
                                                                provideFeedback(selectedTask.id, comment);
                                                                setComment('');
                                                                setIsCommentTouched(false);
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
                            <div className="mt-2 flex flex-col gap-4 min-w-full">
                                {logs?.map((log, idx) => (
                                    <div key={idx} className="grid grid-cols-[28px_1fr] gap-2">
                                        {(log.status === "REVISE" || log.status === "VALIDATED") ? (
                                            <div className="bg-slate-950/50 text-slate-500 rounded-full w-7 h-7 flex justify-center relative">
                                                <UserIcon className="w-5 h-5 absolute bottom-0" />
                                            </div>
                                        ) : (
                                            <div>
                                                <AgentAvatar agent={{ name: log.agent }} />
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-1">
                                            <p>
                                                <span className="text-sm font-medium text-slate-200">{(log.status === "REVISE" || log.status === "VALIDATED") ? 'Anonymous' : log.agent}</span>
                                                <span className="text-sm font-normal text-slate-400">{log.description}</span>
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
                        <div className="pl-[36px] min-w-full">
                            <span className="text-slate-400 text-xs font-normal">{'No activities in this task'}</span>
                        </div>
                    )}
                    {/* --- ACTIVITY --- */}
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsDialog;