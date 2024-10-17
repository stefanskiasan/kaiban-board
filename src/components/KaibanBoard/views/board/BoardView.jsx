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
        workflowLogs
    } = teamStore(state => ({
        tasks: state.tasks,
        agents: state.agents,
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
            <div className="kb-flex kb-flex-row">
                <div className="kb-px-6 kb-mt-3 kb-pb-3 kb-flex kb-items-center kb-gap-1.5">
                    <ViewColumnsIcon className="kb-w-4 kb-h-4 kb-text-white" />
                    <span className="kb-text-sm kb-font-medium kb-text-white">{'Kaiban Board'}</span>
                </div>
                <div className="kb-flex-grow border kb-border-slate-700 kb-border-r-0 kb-border-t-0 kb-bg-slate-950">
                    <div className="kb-flex kb-items-center kb-gap-4 kb-h-full kb-pr-3.5">
                        <div className="kb-ml-auto kb-hidden md:kb-flex -kb-space-x-2">
                            {agents?.map((agent) => (
                                <AgentAvatar key={agent.id} agent={agent} size="sm" />
                            ))}
                        </div>
                        {logs.length > 0 && (
                            <Button className="kb-ml-auto md:kb-ml-0 kb-inline-flex kb-items-center kb-gap-2 kb-rounded-lg kb-bg-slate-900 kb-py-1.5 kb-px-3 kb-text-slate-400 kb-text-sm focus:kb-outline-none data-[hover]:kb-bg-indigo-500/15 data-[hover]:kb-text-indigo-500 data-[open]:kb-bg-gray-700 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white kb-group"
                                onClick={() => { setActivityOpenAction(true) }}>
                                <ListBulletIcon className="kb-w-5 kb-h-5" />
                                <span className="kb-hidden md:kb-block">Activity</span>
                                <span className="kb-text-xs kb-text-slate-900 kb-bg-slate-400 kb-rounded-full kb-px-1 group-hover:kb-bg-indigo-500 group-hover:kb-text-slate-900">
                                    {logs.length}
                                </span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            {/* --- DESKTOP --- */}
            <div className="kb-relative kb-hidden md:kb-grid kb-grid-cols-4 kb-justify-stretch kb-gap-3 kb-divide-x kb-divide-slate-700 kb-px-6 kb-h-full">
                {/* --- TODO --- */}
                <div className="kb-flex kb-flex-col kb-gap-3 kb-pb-3">
                    <div className="kb-flex kb-gap-2 kb-items-center kb-pt-4">
                        <span className="kb-text-sm kb-font-medium kb-text-slate-400">To Do</span>
                        <span className="kb-text-sm kb-font-semibold kb-text-slate-700">{tasksToDo.length}</span>
                    </div>
                    {tasksToDo.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
                {/* --- TODO --- */}
                {/* --- DOING --- */}
                <div className="kb-flex kb-flex-col kb-gap-3 kb-pl-3 kb-pb-3">
                    <div className="kb-flex kb-gap-2 kb-items-center kb-pt-4">
                        <span className="kb-text-sm kb-font-medium kb-text-slate-400">Doing</span>
                        <span className="kb-text-sm kb-font-semibold kb-text-slate-700">{tasksDoing.length}</span>
                    </div>
                    {tasksDoing.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
                {/* --- DOING --- */}
                {/* --- BLOCKED --- */}
                <div className="kb-flex kb-flex-col kb-gap-3 kb-pl-3 kb-pb-3">
                    <div className="kb-flex kb-gap-2 kb-items-center kb-pt-4">
                        <span className="kb-text-sm kb-font-medium kb-text-slate-400">Blocked</span>
                        <span className="kb-text-sm kb-font-semibold kb-text-slate-700">{tasksBlocked.length}</span>
                    </div>
                    {tasksBlocked.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
                {/* --- BLOCKED --- */}
                {/* --- DONE --- */}
                <div className="kb-flex kb-flex-col kb-gap-3 kb-pl-3 kb-pb-3">
                    <div className="kb-flex kb-gap-2 kb-items-center kb-pt-4">
                        <span className="kb-text-sm kb-font-medium kb-text-slate-400">Done</span>
                        <span className="kb-text-sm kb-font-semibold kb-text-slate-700">{tasksDone.length}</span>
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
            <div className="kb-block md:kb-hidden kb-relative kb-px-6 kb-h-full">
                <Swiper spaceBetween={12} pagination={{ clickable: true }} modules={[Pagination]}>
                    {/* --- TODO --- */}
                    <SwiperSlide>
                        <div className="kb-flex kb-flex-col kb-gap-3 kb-pb-3">
                            <div className="kb-flex kb-gap-2 kb-items-center kb-pt-4">
                                <span className="kb-text-sm kb-font-medium kb-text-slate-400">To Do</span>
                                <span className="kb-text-sm kb-font-semibold kb-text-slate-700">{tasksToDo.length}</span>
                            </div>
                            {tasksToDo.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </SwiperSlide>
                    {/* --- TODO --- */}
                    {/* --- DOING --- */}
                    <SwiperSlide>
                        <div className="kb-flex kb-flex-col kb-gap-3 kb-pb-3">
                            <div className="kb-flex kb-gap-2 kb-items-center kb-pt-4">
                                <span className="kb-text-sm kb-font-medium kb-text-slate-400">Doing</span>
                                <span className="kb-text-sm kb-font-semibold kb-text-slate-700">{tasksDoing.length}</span>
                            </div>
                            {tasksDoing.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </SwiperSlide>
                    {/* --- DOING --- */}
                    {/* --- BLOCKED --- */}
                    <SwiperSlide>
                        <div className="kb-flex kb-flex-col kb-gap-3 kb-pb-3">
                            <div className="kb-flex kb-gap-2 kb-items-center kb-pt-4">
                                <span className="kb-text-sm kb-font-medium kb-text-slate-400">Blocked</span>
                                <span className="kb-text-sm kb-font-semibold kb-text-slate-700">{tasksBlocked.length}</span>
                            </div>
                            {tasksBlocked.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </SwiperSlide>
                    {/* --- BLOCKED --- */}
                    {/* --- DONE --- */}
                    <SwiperSlide>
                        <div className="kb-flex kb-flex-col kb-gap-3 kb-pb-3">
                            <div className="kb-flex kb-gap-2 kb-items-center kb-pt-4">
                                <span className="kb-text-sm kb-font-medium kb-text-slate-400">Done</span>
                                <span className="kb-text-sm kb-font-semibold kb-text-slate-700">{tasksDone.length}</span>
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