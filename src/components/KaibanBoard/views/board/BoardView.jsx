import React, { useEffect, useState } from 'react';
import { ListBulletIcon, ViewColumnsIcon, CogIcon } from '@heroicons/react/24/outline';
import { Button } from '@headlessui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import '../../animations.css';

import TaskCard from '../../components/Common/TaskCard';
import BacklogTaskCard from '../../components/Common/BacklogTaskCard';
import AgentAvatar from '../../components/Common/AgentAvatar';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import { filterAndFormatAgentLogs } from '../../utils/helper';
import { 
  getOrchestrationEvents,
  getAISelectedTasks,
  getTaskAdaptations,
  getGeneratedTasks,
  getOrchestrationStatus,
  isOrchestrationActive
} from '../../utils/orchestrationHelper';
import OrchestrationProgressDialog from '../../components/dialog/OrchestrationProgressDialog';

const BoardView = () => {
  const useAgentsPlaygroundStore = usePlaygroundStore();
  const { 
    teamStore, 
    setActivityOpenAction, 
    selectedTask,
    isOrchestrationProgressOpen,
    setOrchestrationProgressOpenAction,
    persistedWorkflowLogs,
    updatePersistedLogsAction,
    clearPersistedLogsAction
  } = useAgentsPlaygroundStore(
    state => ({
      teamStore: state.teamStore,
      setActivityOpenAction: state.setActivityOpenAction,
      selectedTask: state.selectedTask,
      isOrchestrationProgressOpen: state.isOrchestrationProgressOpen,
      setOrchestrationProgressOpenAction: state.setOrchestrationProgressOpenAction,
      persistedWorkflowLogs: state.persistedWorkflowLogs,
      updatePersistedLogsAction: state.updatePersistedLogsAction,
      clearPersistedLogsAction: state.clearPersistedLogsAction,
    })
  );

  const { tasks, agents, workflowLogs, backlogTasks } = teamStore(state => ({
    tasks: state.tasks,
    agents: state.agents,
    workflowLogs: state.workflowLogs,
    backlogTasks: state.backlogTasks || [],
  }));

  const [tasksBacklog, setTasksBacklog] = useState([]);
  const [tasksToDo, setTasksToDo] = useState([]);
  const [tasksDoing, setTasksDoing] = useState([]);
  const [tasksBlocked, setTasksBlocked] = useState([]);
  const [tasksDone, setTasksDone] = useState([]);
  const [logs, setLogs] = useState([]);
  const [orchestrationData, setOrchestrationData] = useState({
    events: [],
    aiSelectedTasks: new Set(),
    taskAdaptations: new Map(),
    generatedTasks: new Set()
  });
  const [previousOrchestrationStatus, setPreviousOrchestrationStatus] = useState('IDLE');
  const [newlyCreatedTasks, setNewlyCreatedTasks] = useState(new Set());
  const [previousTaskIds, setPreviousTaskIds] = useState(new Set());
  
  // Real-time animations state
  const [taskTransitions, setTaskTransitions] = useState(new Map());
  const [previousTaskStatuses, setPreviousTaskStatuses] = useState(new Map());

  // Track newly created tasks and highlight them for 5 seconds
  useEffect(() => {
    const allCurrentTasks = [...tasks, ...backlogTasks];
    const currentTaskIds = new Set(allCurrentTasks.map(task => task.id));
    
    // Find newly added tasks
    const newTaskIds = new Set();
    currentTaskIds.forEach(taskId => {
      if (!previousTaskIds.has(taskId)) {
        newTaskIds.add(taskId);
      }
    });

    if (newTaskIds.size > 0) {
      setNewlyCreatedTasks(prev => new Set([...prev, ...newTaskIds]));
      
      // Remove highlighting after 5 seconds
      setTimeout(() => {
        setNewlyCreatedTasks(prev => {
          const updated = new Set(prev);
          newTaskIds.forEach(taskId => updated.delete(taskId));
          return updated;
        });
      }, 5000);
    }

    setPreviousTaskIds(currentTaskIds);
  }, [tasks, backlogTasks]); // Removed previousTaskIds from dependencies

  // Track task status changes for animations
  useEffect(() => {
    const allTasks = [...tasks, ...backlogTasks];
    const currentStatuses = new Map();
    
    allTasks.forEach(task => {
      currentStatuses.set(task.id, task.status);
    });

    // Detect status changes
    const statusChanges = new Map();
    currentStatuses.forEach((status, taskId) => {
      const previousStatus = previousTaskStatuses.get(taskId);
      if (previousStatus && previousStatus !== status) {
        statusChanges.set(taskId, {
          from: previousStatus,
          to: status,
          timestamp: Date.now()
        });
      }
    });

    // Apply transition animations
    if (statusChanges.size > 0) {
      setTaskTransitions(prev => {
        const updated = new Map(prev);
        statusChanges.forEach((change, taskId) => {
          updated.set(taskId, change);
        });
        return updated;
      });

      // Clear transitions after animation duration (1 second)
      setTimeout(() => {
        setTaskTransitions(prev => {
          const updated = new Map(prev);
          statusChanges.forEach((_, taskId) => {
            updated.delete(taskId);
          });
          return updated;
        });
      }, 1000);
    }

    setPreviousTaskStatuses(currentStatuses);
  }, [tasks, backlogTasks]);

  // Helper function to get animation styles for task transitions
  const getTaskAnimationStyles = (taskId) => {
    const transition = taskTransitions.get(taskId);
    if (!transition) return '';

    const { from, to } = transition;
    
    // Check if this is an AI-driven change from orchestration data
    const isAIDriven = orchestrationData.aiSelectedTasks.has(taskId) || 
                      orchestrationData.generatedTasks.has(taskId) || 
                      orchestrationData.taskAdaptations.has(taskId);
    
    // Define transition animations based on status changes
    const animations = {
      'BACKLOG->TODO': `kb-animate-backlog-to-todo kb-task-transition ${isAIDriven ? 'kb-animate-ai-highlight' : ''}`,
      'TODO->DOING': `kb-animate-todo-to-doing kb-task-transition ${isAIDriven ? 'kb-animate-ai-highlight' : ''}`,
      'DOING->DONE': `kb-animate-doing-to-done kb-task-transition ${isAIDriven ? 'kb-animate-ai-highlight' : ''}`,
      'DOING->BLOCKED': `kb-animate-doing-to-blocked kb-task-transition ${isAIDriven ? 'kb-animate-ai-highlight' : ''}`,
      'BLOCKED->DOING': `kb-animate-todo-to-doing kb-task-transition ${isAIDriven ? 'kb-animate-ai-highlight' : ''}`,
      'TODO->BLOCKED': `kb-animate-doing-to-blocked kb-task-transition ${isAIDriven ? 'kb-animate-ai-highlight' : ''}`,
      'DONE->TODO': `kb-animate-backlog-to-todo kb-task-transition ${isAIDriven ? 'kb-animate-ai-highlight' : ''}`,
      'BACKLOG->DOING': `kb-animate-todo-to-doing kb-task-transition ${isAIDriven ? 'kb-animate-ai-highlight' : ''}`,
      'BACKLOG->DONE': `kb-animate-doing-to-done kb-task-transition ${isAIDriven ? 'kb-animate-ai-highlight' : ''}`,
      'BLOCKED->TODO': `kb-animate-backlog-to-todo kb-task-transition ${isAIDriven ? 'kb-animate-ai-highlight' : ''}`,
      'BLOCKED->DONE': `kb-animate-doing-to-done kb-task-transition ${isAIDriven ? 'kb-animate-ai-highlight' : ''}`,
      'DONE->DOING': `kb-animate-todo-to-doing kb-task-transition ${isAIDriven ? 'kb-animate-ai-highlight' : ''}`,
      'DONE->BLOCKED': `kb-animate-doing-to-blocked kb-task-transition ${isAIDriven ? 'kb-animate-ai-highlight' : ''}`
    };

    const transitionKey = `${from}->${to}`;
    return animations[transitionKey] || `kb-animate-task-transition kb-task-transition ${isAIDriven ? 'kb-animate-ai-highlight' : ''}`;
  };

  const updateTaskLists = tasks => {
    // Filter regular tasks by status
    const tasksWithBacklogStatus = tasks.filter(task => task.status === 'BACKLOG');
    
    // Combine regular backlog tasks with orchestration backlog tasks
    // Filter out backlogTasks that are already in the active tasks list
    const activeTaskIds = new Set(tasks.map(task => task.id));
    const orchestrationBacklogTasks = (backlogTasks || []).filter(
      backlogTask => !activeTaskIds.has(backlogTask.id)
    );
    
    const newTasksBacklog = [...tasksWithBacklogStatus, ...orchestrationBacklogTasks];
    const newTasksToDo = tasks.filter(task => task.status === 'TODO');
    const newTasksDoing = tasks.filter(
      task => task.status === 'DOING' || task.status === 'PAUSED'
    );
    const newTasksBlocked = tasks.filter(
      task => task.status === 'BLOCKED' || task.status === 'AWAITING_VALIDATION'
    );
    const newTasksDone = tasks.filter(task => task.status === 'DONE');

    setTasksBacklog(newTasksBacklog);
    setTasksToDo(newTasksToDo);
    setTasksDoing(newTasksDoing);
    setTasksBlocked(newTasksBlocked);
    setTasksDone(newTasksDone);
  };

  useEffect(() => {
    if (tasks.length > 0 || backlogTasks.length > 0) {
      updateTaskLists(tasks);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [backlogTasks]);

  useEffect(() => {
    const unsubscribeFromTeamStore = teamStore.subscribe((state, prev) => {
      if (state.tasks !== prev.tasks || state.backlogTasks !== prev.backlogTasks) {
        updateTaskLists(state.tasks);
      }
    });

    return unsubscribeFromTeamStore;
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  useEffect(() => {
    const logs = filterAndFormatAgentLogs(workflowLogs);
    setLogs(logs);
    
    // Process orchestration data
    const orchestrationEvents = getOrchestrationEvents(workflowLogs);
    const allTasks = [...tasks, ...backlogTasks];
    const aiSelectedTasks = getAISelectedTasks(orchestrationEvents, allTasks);
    const taskAdaptations = getTaskAdaptations(orchestrationEvents);
    const generatedTasks = getGeneratedTasks(orchestrationEvents, allTasks);
    
    setOrchestrationData({
      events: orchestrationEvents,
      aiSelectedTasks: new Set(aiSelectedTasks.filter(t => t.isAISelected).map(t => t.id)),
      taskAdaptations,
      generatedTasks: new Set(generatedTasks.filter(t => t.isGenerated).map(t => t.id))
    });

    // Auto-open orchestration progress dialog when orchestration starts
    const currentStatus = getOrchestrationStatus(orchestrationEvents);
    const isCurrentlyActive = isOrchestrationActive(orchestrationEvents);
    
    // Open dialog when orchestration becomes active (transitions from IDLE to active state)
    if (isCurrentlyActive && previousOrchestrationStatus === 'IDLE' && !isOrchestrationProgressOpen) {
      setOrchestrationProgressOpenAction(true);
    }
    
    setPreviousOrchestrationStatus(currentStatus);
  }, [workflowLogs, tasks, backlogTasks, previousOrchestrationStatus, isOrchestrationProgressOpen, setOrchestrationProgressOpenAction]);

  // Separate useEffect for auto-close logic to prevent infinite loops
  useEffect(() => {
    if (!isOrchestrationProgressOpen) return; // Early return if dialog is not open
    
    const orchestrationEvents = getOrchestrationEvents(workflowLogs);
    const isCurrentlyActive = isOrchestrationActive(orchestrationEvents);

    // Auto-close dialog when classical workflow starts (non-orchestrated execution)
    // Detect classical workflow by checking for workflow logs without orchestration events
    const hasWorkflowLogs = workflowLogs && workflowLogs.length > 0;
    const hasOnlyNonOrchestrationLogs = hasWorkflowLogs && 
      workflowLogs.some(log => log.logType === 'WorkflowStatusUpdate' || log.logType === 'AgentStatusUpdate' || log.logType === 'TaskStatusUpdate') &&
      orchestrationEvents.length === 0;

    // Also check if there are task status changes without orchestration
    const hasTaskStatusChanges = [...tasks, ...backlogTasks].some(task => 
      task.status === 'IN_PROGRESS' || task.status === 'DONE'
    );

    // Check if workflow is no longer running
    const hasActiveTasks = [...tasks, ...backlogTasks].some(task => 
      task.status === 'IN_PROGRESS' || task.status === 'DOING' || task.status === 'DONE'
    );
    const hasRunningWorkflowStatus = workflowLogs.some(log => 
      log.logType === 'WorkflowStatusUpdate' && 
      ['RUNNING', 'EXECUTING', 'IN_PROGRESS'].includes(log.workflowStatus)
    );
    const isWorkflowRunning = hasActiveTasks || hasRunningWorkflowStatus;

    // Close orchestration dialog if:
    // 1. Classical workflow is detected (non-orchestrated execution)
    // 2. Orchestration is no longer active (completed/error)
    // 3. Workflow is no longer running (no active tasks or running status)
    if (hasOnlyNonOrchestrationLogs || 
        (hasTaskStatusChanges && !isCurrentlyActive) || 
        !isCurrentlyActive ||
        !isWorkflowRunning) {
      setOrchestrationProgressOpenAction(false);
    }
  }, [workflowLogs, tasks, backlogTasks, isOrchestrationProgressOpen, setOrchestrationProgressOpenAction]);

  // Handle log persistence - update persisted logs when new logs are available
  useEffect(() => {
    if (workflowLogs && workflowLogs.length > 0) {
      updatePersistedLogsAction(workflowLogs);
    }
  }, [workflowLogs, updatePersistedLogsAction]);

  // Clear persisted logs when a completely new workflow starts (all tasks reset to TODO)
  const [hasWorkflowStarted, setHasWorkflowStarted] = useState(false);
  useEffect(() => {
    const allTasks = [...tasks, ...backlogTasks];
    const hasActiveTasks = allTasks.some(task => task.status === 'IN_PROGRESS' || task.status === 'DONE');
    
    // If we had an active workflow but now all tasks are back to TODO/BACKLOG, clear persisted logs
    if (hasWorkflowStarted && !hasActiveTasks && allTasks.length > 0 && allTasks.every(task => task.status === 'TODO' || task.status === 'BACKLOG')) {
      clearPersistedLogsAction();
      setHasWorkflowStarted(false);
    }
    
    // Mark that a workflow has started
    if (hasActiveTasks && !hasWorkflowStarted) {
      setHasWorkflowStarted(true);
    }
  }, [tasks, backlogTasks, hasWorkflowStarted, clearPersistedLogsAction]);

  return (
    <>
      <div className="kb-flex kb-flex-row">
        <div className="kb-px-6 kb-mt-3 kb-pb-3 kb-flex kb-items-center kb-gap-1.5">
          <ViewColumnsIcon className="kb-w-4 kb-h-4 kb-text-white" />
          <span className="kb-text-sm kb-font-medium kb-text-white">
            {'Kaiban Board'}
          </span>
        </div>
        <div className="kb-flex-grow border kb-border-slate-700 kb-border-r-0 kb-border-t-0 kb-bg-slate-950">
          <div className="kb-flex kb-items-center kb-gap-4 kb-h-full kb-pr-3.5">
            <div className="kb-ml-auto kb-hidden md:kb-flex -kb-space-x-2">
              {agents?.map(agent => (
                <AgentAvatar key={agent.id} agent={agent} size="sm" />
              ))}
            </div>
            {/* Orchestration Progress Button - Only show when orchestration is active AND workflow is running */}
            {(() => {
              // Check if workflow is actually running (has active tasks or running status)
              const hasActiveTasks = [...tasks, ...backlogTasks].some(task => 
                task.status === 'IN_PROGRESS' || task.status === 'DOING' || task.status === 'DONE'
              );
              const hasRunningWorkflowStatus = workflowLogs.some(log => 
                log.logType === 'WorkflowStatusUpdate' && 
                ['RUNNING', 'EXECUTING', 'IN_PROGRESS'].includes(log.workflowStatus)
              );
              const isWorkflowRunning = hasActiveTasks || hasRunningWorkflowStatus;
              
              // Only show button when both orchestration is active AND workflow is running
              return isOrchestrationActive(orchestrationData.events) && isWorkflowRunning;
            })() && (
              <Button
                className="kb-inline-flex kb-items-center kb-gap-2 kb-rounded-lg kb-py-1.5 kb-px-3 kb-text-white kb-text-sm focus:kb-outline-none data-[focus]:kb-outline-1 data-[focus]:kb-outline-white kb-group transition-colors kb-bg-blue-600 data-[hover]:kb-bg-blue-700"
                onClick={() => {
                  // Double-check both conditions before opening dialog
                  const hasActiveTasks = [...tasks, ...backlogTasks].some(task => 
                    task.status === 'IN_PROGRESS' || task.status === 'DOING' || task.status === 'DONE'
                  );
                  const hasRunningWorkflowStatus = workflowLogs.some(log => 
                    log.logType === 'WorkflowStatusUpdate' && 
                    ['RUNNING', 'EXECUTING', 'IN_PROGRESS'].includes(log.workflowStatus)
                  );
                  const isWorkflowRunning = hasActiveTasks || hasRunningWorkflowStatus;
                  
                  // Only open dialog if both orchestration is active AND workflow is running
                  if (isOrchestrationActive(orchestrationData.events) && isWorkflowRunning) {
                    setOrchestrationProgressOpenAction(true);
                  }
                }}
              >
                <CogIcon className="kb-w-5 kb-h-5 kb-animate-spin" />
                <span className="kb-hidden md:kb-block">Orchestration</span>
                <span className="kb-text-xs kb-rounded-full kb-px-1 kb-bg-blue-500 kb-text-white">
                  {orchestrationData.events.length}
                </span>
              </Button>
            )}

            {logs.length > 0 && (
              <Button
                className="kb-ml-auto md:kb-ml-0 kb-inline-flex kb-items-center kb-gap-2 kb-rounded-lg kb-bg-slate-900 kb-py-1.5 kb-px-3 kb-text-slate-400 kb-text-sm focus:kb-outline-none data-[hover]:kb-bg-indigo-500/15 data-[hover]:kb-text-indigo-500 data-[open]:kb-bg-gray-700 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white kb-group"
                onClick={() => {
                  setActivityOpenAction(true);
                }}
              >
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
      <div className={`kb-relative kb-hidden md:kb-grid kb-grid-cols-5 kb-justify-stretch kb-gap-3 kb-divide-x kb-divide-slate-700 kb-px-6 kb-h-full ${orchestrationData.events.length > 0 && orchestrationData.events[0]?.orchestrationEvent !== 'COMPLETED' ? 'kb-animate-column-flow' : ''}`}>
        {/* --- BACKLOG --- */}
        <div className="kb-flex kb-flex-col kb-gap-3 kb-pb-3">
          <div className="kb-flex kb-gap-2 kb-items-center kb-pt-4">
            <span className="kb-text-sm kb-font-medium kb-text-slate-400">
              Backlog
            </span>
            <span className="kb-text-sm kb-font-semibold kb-text-slate-700">
              {tasksBacklog.length}
            </span>
            {orchestrationData.events.length > 0 && orchestrationData.events[0]?.orchestrationEvent !== 'COMPLETED' && (
              <div className="kb-w-2 kb-h-2 kb-bg-purple-500 kb-rounded-full kb-animate-pulse" title="Orchestration Active"></div>
            )}
          </div>
          {tasksBacklog.map(task => (
            <BacklogTaskCard 
              key={task.id} 
              backlogTask={task}
              isAISelected={orchestrationData.aiSelectedTasks.has(task.id)}
              isGenerated={orchestrationData.generatedTasks.has(task.id)}
              adaptationLevel={orchestrationData.taskAdaptations.get(task.id)?.level || 'none'}
              isSelected={selectedTask && selectedTask.id === task.id}
              isNewlyCreated={newlyCreatedTasks.has(task.id)}
              animationStyles={getTaskAnimationStyles(task.id)}
            />
          ))}
        </div>
        {/* --- BACKLOG --- */}
        {/* --- TODO --- */}
        <div className="kb-flex kb-flex-col kb-gap-3 kb-pl-3 kb-pb-3">
          <div className="kb-flex kb-gap-2 kb-items-center kb-pt-4">
            <span className="kb-text-sm kb-font-medium kb-text-slate-400">
              To Do
            </span>
            <span className="kb-text-sm kb-font-semibold kb-text-slate-700">
              {tasksToDo.length}
            </span>
            {orchestrationData.events.length > 0 && orchestrationData.events[0]?.orchestrationEvent !== 'COMPLETED' && (
              <div className="kb-w-2 kb-h-2 kb-bg-purple-500 kb-rounded-full kb-animate-pulse" title="Orchestration Active"></div>
            )}
          </div>
          {tasksToDo.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              animationStyles={getTaskAnimationStyles(task.id)}
            />
          ))}
        </div>
        {/* --- TODO --- */}
        {/* --- DOING --- */}
        <div className="kb-flex kb-flex-col kb-gap-3 kb-pl-3 kb-pb-3">
          <div className="kb-flex kb-gap-2 kb-items-center kb-pt-4">
            <span className="kb-text-sm kb-font-medium kb-text-slate-400">
              Doing
            </span>
            <span className="kb-text-sm kb-font-semibold kb-text-slate-700">
              {tasksDoing.length}
            </span>
            {orchestrationData.events.length > 0 && orchestrationData.events[0]?.orchestrationEvent !== 'COMPLETED' && (
              <div className="kb-w-2 kb-h-2 kb-bg-purple-500 kb-rounded-full kb-animate-pulse" title="Orchestration Active"></div>
            )}
          </div>
          {tasksDoing.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              animationStyles={getTaskAnimationStyles(task.id)}
            />
          ))}
        </div>
        {/* --- DOING --- */}
        {/* --- BLOCKED --- */}
        <div className="kb-flex kb-flex-col kb-gap-3 kb-pl-3 kb-pb-3">
          <div className="kb-flex kb-gap-2 kb-items-center kb-pt-4">
            <span className="kb-text-sm kb-font-medium kb-text-slate-400">
              Blocked
            </span>
            <span className="kb-text-sm kb-font-semibold kb-text-slate-700">
              {tasksBlocked.length}
            </span>
            {orchestrationData.events.length > 0 && orchestrationData.events[0]?.orchestrationEvent !== 'COMPLETED' && (
              <div className="kb-w-2 kb-h-2 kb-bg-purple-500 kb-rounded-full kb-animate-pulse" title="Orchestration Active"></div>
            )}
          </div>
          {tasksBlocked.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              animationStyles={getTaskAnimationStyles(task.id)}
            />
          ))}
        </div>
        {/* --- BLOCKED --- */}
        {/* --- DONE --- */}
        <div className="kb-flex kb-flex-col kb-gap-3 kb-pl-3 kb-pb-3">
          <div className="kb-flex kb-gap-2 kb-items-center kb-pt-4">
            <span className="kb-text-sm kb-font-medium kb-text-slate-400">
              Done
            </span>
            <span className="kb-text-sm kb-font-semibold kb-text-slate-700">
              {tasksDone.length}
            </span>
            {orchestrationData.events.length > 0 && orchestrationData.events[0]?.orchestrationEvent !== 'COMPLETED' && (
              <div className="kb-w-2 kb-h-2 kb-bg-purple-500 kb-rounded-full kb-animate-pulse" title="Orchestration Active"></div>
            )}
          </div>
          {tasksDone.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              animationStyles={getTaskAnimationStyles(task.id)}
            />
          ))}
        </div>
        {/* --- DONE --- */}
      </div>
      {/* --- DESKTOP --- */}
      {/* --- MOBILE --- */}
      {/* --- MOBILE --- */}
      <div className="kb-block md:kb-hidden kb-relative kb-px-6 kb-h-full">
        <Swiper
          spaceBetween={12}
          pagination={{ clickable: true }}
          modules={[Pagination]}
        >
          {/* --- BACKLOG --- */}
          <SwiperSlide>
            <div className="kb-flex kb-flex-col kb-gap-3 kb-pb-3">
              <div className="kb-flex kb-gap-2 kb-items-center kb-pt-4">
                <span className="kb-text-sm kb-font-medium kb-text-slate-400">
                  Backlog
                </span>
                <span className="kb-text-sm kb-font-semibold kb-text-slate-700">
                  {tasksBacklog.length}
                </span>
              </div>
              {tasksBacklog.map(task => (
                <BacklogTaskCard 
                  key={task.id} 
                  backlogTask={task}
                  isAISelected={orchestrationData.aiSelectedTasks.has(task.id)}
                  isGenerated={orchestrationData.generatedTasks.has(task.id)}
                  adaptationLevel={orchestrationData.taskAdaptations.get(task.id)?.level || 'none'}
                  isSelected={selectedTask && selectedTask.id === task.id}
                  isNewlyCreated={newlyCreatedTasks.has(task.id)}
                  animationStyles={getTaskAnimationStyles(task.id)}
                />
              ))}
            </div>
          </SwiperSlide>
          {/* --- BACKLOG --- */}
          {/* --- TODO --- */}
          <SwiperSlide>
            <div className="kb-flex kb-flex-col kb-gap-3 kb-pb-3">
              <div className="kb-flex kb-gap-2 kb-items-center kb-pt-4">
                <span className="kb-text-sm kb-font-medium kb-text-slate-400">
                  To Do
                </span>
                <span className="kb-text-sm kb-font-semibold kb-text-slate-700">
                  {tasksToDo.length}
                </span>
              </div>
              {tasksToDo.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  animationStyles={getTaskAnimationStyles(task.id)}
                />
              ))}
            </div>
          </SwiperSlide>
          {/* --- TODO --- */}
          {/* --- DOING --- */}
          <SwiperSlide>
            <div className="kb-flex kb-flex-col kb-gap-3 kb-pb-3">
              <div className="kb-flex kb-gap-2 kb-items-center kb-pt-4">
                <span className="kb-text-sm kb-font-medium kb-text-slate-400">
                  Doing
                </span>
                <span className="kb-text-sm kb-font-semibold kb-text-slate-700">
                  {tasksDoing.length}
                </span>
              </div>
              {tasksDoing.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  animationStyles={getTaskAnimationStyles(task.id)}
                />
              ))}
            </div>
          </SwiperSlide>
          {/* --- DOING --- */}
          {/* --- BLOCKED --- */}
          <SwiperSlide>
            <div className="kb-flex kb-flex-col kb-gap-3 kb-pb-3">
              <div className="kb-flex kb-gap-2 kb-items-center kb-pt-4">
                <span className="kb-text-sm kb-font-medium kb-text-slate-400">
                  Blocked
                </span>
                <span className="kb-text-sm kb-font-semibold kb-text-slate-700">
                  {tasksBlocked.length}
                </span>
              </div>
              {tasksBlocked.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  animationStyles={getTaskAnimationStyles(task.id)}
                />
              ))}
            </div>
          </SwiperSlide>
          {/* --- BLOCKED --- */}
          {/* --- DONE --- */}
          <SwiperSlide>
            <div className="kb-flex kb-flex-col kb-gap-3 kb-pb-3">
              <div className="kb-flex kb-gap-2 kb-items-center kb-pt-4">
                <span className="kb-text-sm kb-font-medium kb-text-slate-400">
                  Done
                </span>
                <span className="kb-text-sm kb-font-semibold kb-text-slate-700">
                  {tasksDone.length}
                </span>
              </div>
              {tasksDone.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  animationStyles={getTaskAnimationStyles(task.id)}
                />
              ))}
            </div>
          </SwiperSlide>
          {/* --- DONE --- */}
        </Swiper>
      </div>
      {/* --- MOBILE --- */}
      
      {/* Orchestration Progress Dialog */}
      <OrchestrationProgressDialog
        isOpen={isOrchestrationProgressOpen}
        onClose={() => setOrchestrationProgressOpenAction(false)}
        workflowLogs={workflowLogs && workflowLogs.length > 0 ? workflowLogs : persistedWorkflowLogs}
        isOrchestrationRunning={isOrchestrationActive(orchestrationData.events)}
        onStopOrchestration={() => {
          // TODO: Implement orchestration stop functionality
          console.log('Stop orchestration requested');
        }}
      />
    </>
  );
};

export default BoardView;
