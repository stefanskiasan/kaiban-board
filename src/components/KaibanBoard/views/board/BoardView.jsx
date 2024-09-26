import React, { useEffect, useState } from 'react';
import { ListBulletIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';
import { Button } from '@headlessui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

import TaskCard from '../../components/Common/TaskCard';
import AgentAvatar from '../../components/Common/AgentAvatar';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import { filterAndFormatAgentLogs } from '../../utils/helper';

const BoardView = () => {
    const useAgentsPlaygroundStore = usePlaygroundStore();
    const {
        teamStore,
        setActivityOpenAction,
    } = useAgentsPlaygroundStore(
        (state) => ({
            teamStore: state.teamStore,
            setActivityOpenAction: state.setActivityOpenAction
        })
    );

    const {
        tasks,
        agents,
        name,
        workflowLogs
    } = teamStore(state => ({
        tasks: state.tasks,
        agents: state.agents,
        name: state.name,
        workflowLogs: state.workflowLogs
    }));

    const [tasksToDo, setTasksToDo] = useState([]);
    const [tasksDoing, setTasksDoing] = useState([]);
    const [tasksBlocked, setTasksBlocked] = useState([]);
    const [tasksDone, setTasksDone] = useState([]);
    const [logs, setLogs] = useState([]);

    const updateTaskLists = (tasks) => {
        const newTasksToDo = tasks.filter(task => task.status === 'TODO');
        const newTasksDoing = tasks.filter(task => task.status === 'DOING');
        const newTasksBlocked = tasks.filter(task => task.status === 'BLOCKED' || task.status === 'AWAITING_VALIDATION');
        const newTasksDone = tasks.filter(task => task.status === 'DONE');

        setTasksToDo(newTasksToDo);
        setTasksDoing(newTasksDoing);
        setTasksBlocked(newTasksBlocked);
        setTasksDone(newTasksDone);
    };

    useEffect(() => {
        if (tasks.length > 0) {
            updateTaskLists(tasks);
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    useEffect(() => {
        const unsubscribeFromTeamStore = teamStore.subscribe((state, prev) => {
            if (state.tasks !== prev.tasks) {
                updateTaskLists(state.tasks);
            }
        });

        return unsubscribeFromTeamStore;
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    useEffect(() => {
        const logs = filterAndFormatAgentLogs(workflowLogs);
        setLogs(logs);
    }, [workflowLogs]);

    return (
        <>
            <div className="flex flex-row">
                <div className="px-6 mt-3 pb-3 flex items-center gap-1.5">
                    <ViewColumnsIcon className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">{name}</span>
                    <span className="text-sm font-medium text-white">{'  Board'}</span>
                </div>
                <div className="flex-grow border border-slate-700 border-r-0 border-t-0 bg-slate-950">
                    <div className="flex items-center gap-4 h-full pr-3.5">
                        <div className="ml-auto flex -space-x-2">
                            {agents?.map((agent) => (
                                <AgentAvatar key={agent.id} agent={agent} size="sm" />
                            ))}
                        </div>
                        {logs.length > 0 && (
                            <Button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 py-1.5 px-3 text-slate-400 text-sm focus:outline-none data-[hover]:bg-indigo-500/15 data-[hover]:text-indigo-500 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white group"
                                onClick={() => { setActivityOpenAction(true) }}>
                                <ListBulletIcon className="w-5 h-5" />
                                Activity
                                <span className="text-xs text-slate-900 bg-slate-400 rounded-full px-1 group-hover:bg-indigo-500 group-hover:text-slate-900">
                                    {logs.length}
                                </span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            {/* --- DESKTOP --- */}
            <div className="relative hidden md:grid grid-cols-4 justify-stretch gap-3 divide-x divide-slate-700 px-6 h-full">
                {/* --- TODO --- */}
                <div className="flex flex-col gap-3 pb-3">
                    <div className="flex gap-2 items-center pt-4">
                        <span className="text-sm font-medium text-slate-400">To Do</span>
                        <span className="text-sm font-semibold text-slate-700">{tasksToDo.length}</span>
                    </div>
                    {tasksToDo.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
                {/* --- TODO --- */}
                {/* --- DOING --- */}
                <div className="flex flex-col gap-3 pl-3 pb-3">
                    <div className="flex gap-2 items-center pt-4">
                        <span className="text-sm font-medium text-slate-400">Doing</span>
                        <span className="text-sm font-semibold text-slate-700">{tasksDoing.length}</span>
                    </div>
                    {tasksDoing.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
                {/* --- DOING --- */}
                {/* --- BLOCKED --- */}
                <div className="flex flex-col gap-3 pl-3 pb-3">
                    <div className="flex gap-2 items-center pt-4">
                        <span className="text-sm font-medium text-slate-400">Blocked</span>
                        <span className="text-sm font-semibold text-slate-700">{tasksBlocked.length}</span>
                    </div>
                    {tasksBlocked.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
                {/* --- BLOCKED --- */}
                {/* --- DONE --- */}
                <div className="flex flex-col gap-3 pl-3 pb-3">
                    <div className="flex gap-2 items-center pt-4">
                        <span className="text-sm font-medium text-slate-400">Done</span>
                        <span className="text-sm font-semibold text-slate-700">{tasksDone.length}</span>
                    </div>
                    {tasksDone.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
                {/* --- DONE --- */}
            </div>
            {/* --- DESKTOP --- */}
            {/* --- MOBILE --- */}
            {/* --- MOBILE --- */}
            <div className="block md:hidden relative px-6 h-full">
                <Swiper spaceBetween={12} pagination={{ clickable: true }} modules={[Pagination]}>
                    {/* --- TODO --- */}
                    <SwiperSlide>
                        <div className="flex flex-col gap-3 pb-3">
                            <div className="flex gap-2 items-center pt-4">
                                <span className="text-sm font-medium text-slate-400">To Do</span>
                                <span className="text-sm font-semibold text-slate-700">{tasksToDo.length}</span>
                            </div>
                            {tasksToDo.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </SwiperSlide>
                    {/* --- TODO --- */}
                    {/* --- DOING --- */}
                    <SwiperSlide>
                        <div className="flex flex-col gap-3 pl-3 pb-3">
                            <div className="flex gap-2 items-center pt-4">
                                <span className="text-sm font-medium text-slate-400">Doing</span>
                                <span className="text-sm font-semibold text-slate-700">{tasksDoing.length}</span>
                            </div>
                            {tasksDoing.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </SwiperSlide>
                    {/* --- DOING --- */}
                    {/* --- BLOCKED --- */}
                    <SwiperSlide>
                        <div className="flex flex-col gap-3 pl-3 pb-3">
                            <div className="flex gap-2 items-center pt-4">
                                <span className="text-sm font-medium text-slate-400">Blocked</span>
                                <span className="text-sm font-semibold text-slate-700">{tasksBlocked.length}</span>
                            </div>
                            {tasksBlocked.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </SwiperSlide>
                    {/* --- BLOCKED --- */}
                    {/* --- DONE --- */}
                    <SwiperSlide>
                        <div className="flex flex-col gap-3 pl-3 pb-3">
                            <div className="flex gap-2 items-center pt-4">
                                <span className="text-sm font-medium text-slate-400">Done</span>
                                <span className="text-sm font-semibold text-slate-700">{tasksDone.length}</span>
                            </div>
                            {tasksDone.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </SwiperSlide>
                    {/* --- DONE --- */}
                </Swiper>
            </div>
            {/* --- MOBILE --- */}
        </>
    );
};

export default BoardView;