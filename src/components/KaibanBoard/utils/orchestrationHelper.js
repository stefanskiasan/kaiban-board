/**
 * Orchestration Helper Functions
 * 
 * Utility functions for parsing and processing orchestration events,
 * extracting AI decision data, and managing orchestration state visualization.
 */

/**
 * Orchestration event types categorization
 */
export const ORCHESTRATION_EVENT_CATEGORIES = {
  LIFECYCLE: ['ACTIVATED', 'DEACTIVATED', 'COMPLETED'],
  TASK_MANAGEMENT: ['TASK_SELECTION', 'TASK_ADAPTATION', 'TASK_GENERATION', 'TASK_REPOSITORY_UPDATE'],
  PERFORMANCE: ['PERFORMANCE_MONITORING', 'OPTIMIZATION_STARTED', 'RESOURCE_OPTIMIZATION'],
  ANALYSIS: ['ANALYSIS_STARTED', 'GAP_ANALYSIS_COMPLETED', 'ORCHESTRATION_DECISIONS'],
  ERROR_RECOVERY: ['ERROR', 'FALLBACK_TASK_SELECTION', 'RECOVERY_SUCCESS', 'LLM_RECOVERY_SUCCESS'],
  CONTINUOUS: ['CONTINUOUS_ORCHESTRATION_STARTED', 'CONTINUOUS_TASK_SELECTION', 'TASK_COMPLETION_ANALYSIS']
};

/**
 * Extract orchestration events from workflow logs
 */
export const getOrchestrationEvents = (workflowLogs) => {
  try {
    if (!Array.isArray(workflowLogs)) return [];
    
    return workflowLogs
      .filter(log => {
        // Validate log structure
        if (!log || typeof log !== 'object') return false;
        return log.logType === 'OrchestrationStatusUpdate';
      })
      .sort((a, b) => {
        // Safe timestamp comparison
        const timestampA = typeof a.timestamp === 'number' ? a.timestamp : 0;
        const timestampB = typeof b.timestamp === 'number' ? b.timestamp : 0;
        return timestampB - timestampA; // Most recent first
      });
  } catch (error) {
    console.error('Error extracting orchestration events:', error);
    return [];
  }
};

/**
 * Get current orchestration status from events
 */
export const getOrchestrationStatus = (orchestrationEvents) => {
  try {
    if (!Array.isArray(orchestrationEvents) || !orchestrationEvents.length) {
      return {
        isActive: false,
        mode: null,
        status: 'IDLE',
        lastActivity: null,
        continuousMode: false
      };
    }

    const latestEvent = orchestrationEvents[0];
    if (!latestEvent || !latestEvent.orchestrationEvent) {
      return {
        isActive: false,
        mode: null,
        status: 'IDLE',
        lastActivity: null,
        continuousMode: false
      };
    }

    const activatedEvent = orchestrationEvents.find(e => e?.orchestrationEvent === 'ACTIVATED');
    const isActive = latestEvent.orchestrationEvent !== 'DEACTIVATED' && 
                     latestEvent.orchestrationEvent !== 'COMPLETED' &&
                     latestEvent.orchestrationEvent !== 'ERROR';

    return {
      isActive,
      mode: activatedEvent?.metadata?.mode || null,
      status: getStatusFromEvent(latestEvent),
      lastActivity: latestEvent.timestamp || null,
      continuousMode: activatedEvent?.metadata?.continuousOrchestration || false
    };
  } catch (error) {
    console.error('Error getting orchestration status:', error);
    return {
      isActive: false,
      mode: null,
      status: 'ERROR',
      lastActivity: null,
      continuousMode: false
    };
  }
};

/**
 * Get orchestration metrics from events
 */
export const getOrchestrationMetrics = (orchestrationEvents) => {
  const metrics = {
    tasksSelected: 0,
    tasksAdapted: 0,
    tasksGenerated: 0,
    llmCalls: 0,
    errors: 0,
    optimizations: 0
  };

  orchestrationEvents.forEach(event => {
    switch (event.orchestrationEvent) {
      case 'TASK_SELECTION':
        metrics.tasksSelected += event.metadata?.selectedTasksCount || 0;
        metrics.llmCalls += 1;
        break;
      case 'TASK_ADAPTATION':
        metrics.tasksAdapted += 1;
        metrics.llmCalls += 1;
        break;
      case 'TASK_GENERATION':
        metrics.tasksGenerated += event.metadata?.tasksGenerated || 0;
        metrics.llmCalls += 1;
        break;
      case 'ERROR':
      case 'ORCHESTRATION_ERROR':
        metrics.errors += 1;
        break;
      case 'OPTIMIZATION_STARTED':
      case 'RESOURCE_OPTIMIZATION':
        metrics.optimizations += 1;
        break;
    }
  });

  return metrics;
};

/**
 * Identify AI-selected tasks from orchestration events
 */
export const getAISelectedTasks = (orchestrationEvents, currentTasks) => {
  const aiSelectedTaskIds = new Set();
  
  orchestrationEvents.forEach(event => {
    if (event.orchestrationEvent === 'TASK_SELECTION' && event.metadata?.selectedTasks) {
      event.metadata.selectedTasks.forEach(taskId => {
        aiSelectedTaskIds.add(taskId);
      });
    }
  });

  return currentTasks.map(task => ({
    ...task,
    isAISelected: aiSelectedTaskIds.has(task.id)
  }));
};

/**
 * Get task adaptation information
 */
export const getTaskAdaptations = (orchestrationEvents) => {
  const adaptations = new Map();
  
  orchestrationEvents.forEach(event => {
    if (event.orchestrationEvent === 'TASK_ADAPTATION') {
      const { taskId, adaptationLevel, adaptationChanges } = event.metadata || {};
      if (taskId) {
        adaptations.set(taskId, {
          level: adaptationLevel || 'none',
          changes: adaptationChanges || [],
          timestamp: event.timestamp
        });
      }
    }
  });

  return adaptations;
};

/**
 * Identify AI-generated tasks
 */
export const getGeneratedTasks = (orchestrationEvents, currentTasks) => {
  const generatedTaskIds = new Set();
  
  orchestrationEvents.forEach(event => {
    if (event.orchestrationEvent === 'TASK_GENERATION' && event.metadata?.generatedTaskIds) {
      event.metadata.generatedTaskIds.forEach(taskId => {
        generatedTaskIds.add(taskId);
      });
    }
  });

  return currentTasks.map(task => ({
    ...task,
    isGenerated: generatedTaskIds.has(task.id)
  }));
};

/**
 * Get orchestration performance data
 */
export const getPerformanceData = (orchestrationEvents) => {
  const performanceEvents = orchestrationEvents.filter(e => 
    e.orchestrationEvent === 'PERFORMANCE_MONITORING'
  );

  if (!performanceEvents.length) return null;

  const latestPerformance = performanceEvents[0].metadata?.metrics || {};
  
  return {
    taskCompletionRate: latestPerformance.taskCompletionRate || 0,
    averageTaskDuration: latestPerformance.averageTaskDuration || 0,
    agentUtilization: latestPerformance.agentUtilization || 0,
    qualityScore: latestPerformance.qualityScore || 0,
    bottlenecks: latestPerformance.bottlenecksDetected || [],
    recommendations: performanceEvents[0].metadata?.recommendations || []
  };
};

/**
 * Get recent orchestration activity for display
 */
export const getRecentActivity = (orchestrationEvents, limit = 5) => {
  return orchestrationEvents
    .slice(0, limit)
    .map(event => ({
      id: `${event.timestamp}-${event.orchestrationEvent}`,
      type: event.orchestrationEvent,
      category: getEventCategory(event.orchestrationEvent),
      message: getEventDisplayMessage(event),
      timestamp: event.timestamp,
      metadata: event.metadata,
      icon: getEventIcon(event.orchestrationEvent),
      severity: getEventSeverity(event.orchestrationEvent)
    }));
};

/**
 * Helper function to determine status from event
 */
const getStatusFromEvent = (event) => {
  const { orchestrationEvent, metadata } = event;
  
  // Handle specific orchestration events with better mapping
  switch (orchestrationEvent) {
    case 'ACTIVATED':
      return 'active';
    case 'ANALYSIS_STARTED':
    case 'ANALYZING':
      return 'analyzing';
    case 'TASK_SELECTION':
    case 'SELECTING_TASKS':
      return 'selecting';
    case 'TASK_ADAPTATION':
    case 'ADAPTING_TASKS':
      return 'adapting';
    case 'TASK_GENERATION':
    case 'GENERATING_TASKS':
      return 'generating';
    case 'OPTIMIZATION_STARTED':
    case 'OPTIMIZING':
      return 'optimizing';
    case 'COMPLETED':
    case 'FINISHED':
      return 'completed';
    case 'ERROR':
    case 'FAILED':
      return 'error';
    case 'DEACTIVATED':
    case 'STOPPED':
      return 'inactive';
    case 'LLM_CALL':
      // Determine status based on LLM call purpose
      if (metadata?.purpose?.includes('selection')) return 'selecting';
      if (metadata?.purpose?.includes('adaptation')) return 'adapting';
      if (metadata?.purpose?.includes('generation')) return 'generating';
      return 'active';
    case 'STRATEGY_CHANGE':
      return 'active'; // Still active, just changing strategy
    case 'PERFORMANCE_ANALYSIS':
      return 'analyzing';
    default:
      // For unknown events, return 'active' if the event suggests activity
      return 'active';
  }
};

/**
 * Get event category for styling and filtering
 */
const getEventCategory = (eventType) => {
  for (const [category, events] of Object.entries(ORCHESTRATION_EVENT_CATEGORIES)) {
    if (events.includes(eventType)) return category.toLowerCase();
  }
  return 'other';
};

/**
 * Generate display message for events
 */
const getEventDisplayMessage = (event) => {
  const { orchestrationEvent, metadata } = event;
  
  switch (orchestrationEvent) {
    case 'ACTIVATED':
      return `Orchestration activated in ${metadata?.mode} mode`;
    case 'TASK_SELECTION':
      return `Selected ${metadata?.selectedTasksCount || 0} tasks for execution`;
    case 'TASK_ADAPTATION':
      return `Adapted task with ${metadata?.adaptationLevel} changes`;
    case 'TASK_GENERATION':
      return `Generated ${metadata?.tasksGenerated || 0} new tasks`;
    case 'PERFORMANCE_MONITORING':
      return `Performance analysis completed`;
    case 'OPTIMIZATION_STARTED':
      return `Workflow optimization initiated`;
    case 'ERROR':
      return `Error: ${metadata?.error || 'Unknown orchestration error'}`;
    case 'COMPLETED':
      return `Orchestration completed successfully`;
    default:
      return metadata?.message || `${orchestrationEvent.replace(/_/g, ' ').toLowerCase()}`;
  }
};

/**
 * Get icon for event types
 */
export const getEventIcon = (eventType) => {
  const iconMap = {
    'ACTIVATED': '🚀',
    'DEACTIVATED': '⏹️',
    'COMPLETED': '✅',
    'PAUSED': '⏸️',
    'RESUMED': '▶️',
    'ERROR': '❌',
    'TASK_SELECTION': '🎯',
    'TASK_ADAPTATION': '🔄',
    'TASK_GENERATION': '🤖',
    'TASK_REPOSITORY_UPDATE': '📝',
    'AGENT_ASSIGNMENT': '👤',
    'WORKLOAD_DISTRIBUTION': '⚖️',
    'PERFORMANCE_ANALYSIS': '📊',
    'OPTIMIZATION': '⚡',
    'LEARNING_UPDATE': '🧠',
    'MODE_SWITCH': '🔀',
    'STRATEGY_UPDATE': '📋',
    'RESOURCE_ALLOCATION': '🏗️',
    'BOTTLENECK_DETECTION': '🚧',
    'CAPACITY_ANALYSIS': '📈',
    'QUALITY_CHECK': '🔍',
    'RISK_ASSESSMENT': '⚠️',
    'COORDINATION': '🤝',
    'COMMUNICATION': '💬',
    'FEEDBACK_PROCESSING': '🔄',
    'ADAPTATION_TRIGGER': '🎛️',
    'RECOVERY': '🔧',
    'FALLBACK': '↩️',
    'ANALYSIS_STARTED': '🔍',
    'OPTIMIZATION_STARTED': '⚡',
    'PERFORMANCE_MONITORING': '📊',
    'RECOVERY_SUCCESS': '🔧'
  };
  
  return iconMap[eventType] || '📌';
};

/**
 * Get severity level for styling
 */
const getEventSeverity = (eventType) => {
  if (eventType.includes('ERROR')) return 'error';
  if (eventType.includes('FALLBACK') || eventType.includes('RECOVERY')) return 'warning';
  if (['ACTIVATED', 'COMPLETED', 'TASK_GENERATION'].includes(eventType)) return 'success';
  return 'info';
};

/**
 * Format orchestration mode for display
 */
export const formatOrchestrationMode = (mode) => {
  if (!mode) return 'Unknown';
  
  const modeMap = {
    'conservative': 'Conservative',
    'adaptive': 'Adaptive',
    'innovative': 'Innovative', 
    'learning': 'Learning'
  };
  
  return modeMap[mode] || mode.charAt(0).toUpperCase() + mode.slice(1);
};

/**
 * Get orchestration configuration from team
 */
export const getOrchestrationConfig = (teamStore) => {
  if (!teamStore) return null;
  
  const state = teamStore.getState();
  return {
    enableOrchestration: state.enableOrchestration || false,
    continuousOrchestration: state.continuousOrchestration || false,
    mode: state.mode || 'adaptive',
    allowTaskGeneration: state.allowTaskGeneration || false,
    maxActiveTasks: state.maxActiveTasks || 5,
    orchestrationStrategy: state.orchestrationStrategy || ''
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// ADVANCED LOG ANALYSIS FUNCTIONS FOR DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Analyze error patterns and provide intelligent categorization
 */
export const analyzeErrorPatterns = (workflowLogs) => {
  if (!Array.isArray(workflowLogs)) return null;

  const errorLogs = workflowLogs.filter(log => 
    log.logType === 'OrchestrationStatusUpdate' && log.orchestrationEvent === 'ERROR' ||
    log.logType === 'AgentStatusUpdate' && (log.agentStatus?.includes('ERROR') || log.agentStatus?.includes('ISSUES')) ||
    log.logType === 'TaskStatusUpdate' && log.taskStatus === 'ERROR' ||
    log.logType === 'WorkflowStatusUpdate' && log.workflowStatus === 'ERRORED'
  );

  // Categorize errors by type - return arrays of error objects instead of counts
  const errorsByCategory = {
    orchestration: errorLogs.filter(log => log.logType === 'OrchestrationStatusUpdate'),
    agent: errorLogs.filter(log => log.logType === 'AgentStatusUpdate'),
    task: errorLogs.filter(log => log.logType === 'TaskStatusUpdate'),
    workflow: errorLogs.filter(log => log.logType === 'WorkflowStatusUpdate'),
    llm: errorLogs.filter(log => 
      log.agentStatus === 'THINKING_ERROR' || 
      log.agentStatus === 'ISSUES_PARSING_LLM_OUTPUT' ||
      log.orchestrationEvent?.includes('LLM_RECOVERY_FAILED')
    ),
    tool: errorLogs.filter(log => log.agentStatus?.includes('TOOL_ERROR'))
  };

  // Build error timeline
  const errorTimeline = errorLogs.map(log => ({
    timestamp: log.timestamp,
    type: log.logType,
    event: log.orchestrationEvent || log.agentStatus || log.taskStatus || log.workflowStatus,
    message: log.metadata?.error || log.metadata?.message || log.logDescription,
    severity: getSeverityLevel(log),
    context: getErrorContext(log)
  })).sort((a, b) => a.timestamp - b.timestamp);

  // Find recurrent errors
  const errorFrequency = {};
  errorLogs.forEach(log => {
    const errorKey = log.orchestrationEvent || log.agentStatus || log.taskStatus || log.workflowStatus;
    errorFrequency[errorKey] = (errorFrequency[errorKey] || 0) + 1;
  });

  const recurrentErrors = Object.entries(errorFrequency)
    .filter(([, count]) => count > 1)
    .map(([error, count]) => ({ error, count, percentage: (count / errorLogs.length) * 100 }))
    .sort((a, b) => b.count - a.count);

  // Calculate error impact
  const errorImpact = {
    totalErrors: errorLogs.length,
    errorRate: errorLogs.length / workflowLogs.length,
    criticalErrors: errorLogs.filter(log => getSeverityLevel(log) === 'critical').length,
    highErrors: errorLogs.filter(log => getSeverityLevel(log) === 'high').length,
    mediumErrors: errorLogs.filter(log => getSeverityLevel(log) === 'medium').length,
    lowErrors: errorLogs.filter(log => getSeverityLevel(log) === 'low').length
  };

  // Generate suggested fixes
  const suggestedFixes = generateErrorSolutions(recurrentErrors, errorsByCategory);

  return {
    errorsByCategory,
    errorTimeline,
    recurrentErrors,
    errorImpact,
    suggestedFixes,
    totalErrorCount: errorLogs.length
  };
};

/**
 * Analyze performance metrics from logs
 */
export const analyzePerformanceMetrics = (workflowLogs) => {
  if (!Array.isArray(workflowLogs)) return null;

  const orchestrationEvents = getOrchestrationEvents(workflowLogs);
  const agentLogs = workflowLogs.filter(log => log.logType === 'AgentStatusUpdate');
  const taskLogs = workflowLogs.filter(log => log.logType === 'TaskStatusUpdate');

  // Token usage analysis
  const tokenUsageByAgent = {};
  agentLogs.forEach(log => {
    if (log.metadata?.output?.llmUsageStats) {
      const agentName = log.agent?.name || 'Unknown Agent';
      if (!tokenUsageByAgent[agentName]) {
        tokenUsageByAgent[agentName] = { inputTokens: 0, outputTokens: 0, calls: 0, cost: 0 };
      }
      const stats = log.metadata.output.llmUsageStats;
      tokenUsageByAgent[agentName].inputTokens += stats.inputTokens || 0;
      tokenUsageByAgent[agentName].outputTokens += stats.outputTokens || 0;
      tokenUsageByAgent[agentName].calls += 1;
    }
  });

  // Task duration analysis
  const taskDurations = {};
  const taskStartTimes = {};
  taskLogs.forEach(log => {
    const taskId = log.task?.id;
    if (!taskId) return;

    if (log.taskStatus === 'DOING') {
      taskStartTimes[taskId] = log.timestamp;
    } else if (log.taskStatus === 'DONE' && taskStartTimes[taskId]) {
      taskDurations[taskId] = log.timestamp - taskStartTimes[taskId];
    }
  });

  const avgTaskDuration = Object.values(taskDurations).reduce((sum, duration) => sum + duration, 0) / Object.keys(taskDurations).length || 0;

  // Orchestration efficiency
  const orchestrationMetrics = getOrchestrationMetrics(orchestrationEvents);
  const orchestrationEfficiency = {
    decisionAccuracy: calculateDecisionAccuracy(orchestrationEvents),
    adaptationSuccessRate: calculateAdaptationSuccessRate(orchestrationEvents),
    generationEfficiency: calculateGenerationEfficiency(orchestrationEvents),
    averageDecisionTime: calculateAverageDecisionTime(orchestrationEvents)
  };

  // Bottleneck identification
  const bottlenecks = identifyBottlenecks(workflowLogs);

  // Cost analysis
  const costAnalysis = calculateDetailedCosts(workflowLogs);

  return {
    tokenUsageByAgent,
    avgTaskDuration,
    taskDurations,
    orchestrationEfficiency,
    orchestrationMetrics,
    bottlenecks,
    costAnalysis,
    // Add totalCost for dashboard display
    totalCost: costAnalysis?.estimatedCost || 0,
    totalTokensUsed: costAnalysis?.totalInputTokens + costAnalysis?.totalOutputTokens || 0,
    totalLogs: workflowLogs.length
  };
};

/**
 * Analyze task flows and journeys
 */
export const analyzeTaskFlows = (workflowLogs) => {
  if (!Array.isArray(workflowLogs)) return null;

  const taskLogs = workflowLogs.filter(log => log.logType === 'TaskStatusUpdate');
  const orchestrationEvents = getOrchestrationEvents(workflowLogs);

  // Build task journeys
  const taskJourneys = {};
  taskLogs.forEach(log => {
    const taskId = log.task?.id;
    if (!taskId) return;

    if (!taskJourneys[taskId]) {
      taskJourneys[taskId] = {
        taskId,
        taskDescription: log.task.description || log.task.title,
        agent: log.agent?.name || 'Unknown',
        statusHistory: [],
        totalDuration: 0,
        startTime: null,
        endTime: null
      };
    }

    taskJourneys[taskId].statusHistory.push({
      status: log.taskStatus,
      timestamp: log.timestamp,
      message: log.logDescription,
      metadata: log.metadata
    });

    if (log.taskStatus === 'DOING' && !taskJourneys[taskId].startTime) {
      taskJourneys[taskId].startTime = log.timestamp;
    }
    if (log.taskStatus === 'DONE') {
      taskJourneys[taskId].endTime = log.timestamp;
      if (taskJourneys[taskId].startTime) {
        taskJourneys[taskId].totalDuration = log.timestamp - taskJourneys[taskId].startTime;
      }
    }
  });

  // Analyze status transitions
  const statusTransitions = {};
  Object.values(taskJourneys).forEach(journey => {
    const history = journey.statusHistory;
    for (let i = 1; i < history.length; i++) {
      const from = history[i - 1].status;
      const to = history[i].status;
      const transitionKey = `${from}->${to}`;
      
      if (!statusTransitions[transitionKey]) {
        statusTransitions[transitionKey] = { count: 0, avgDuration: 0, durations: [] };
      }
      
      statusTransitions[transitionKey].count++;
      const duration = history[i].timestamp - history[i - 1].timestamp;
      statusTransitions[transitionKey].durations.push(duration);
    }
  });

  // Calculate average durations for transitions
  Object.keys(statusTransitions).forEach(key => {
    const durations = statusTransitions[key].durations;
    statusTransitions[key].avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
  });

  // Analyze task blockages
  const blockageAnalysis = analyzeTaskBlockages(taskLogs);

  // Analyze task adaptations
  const adaptationPatterns = analyzeTaskAdaptations(orchestrationEvents, taskJourneys);

  // Analyze AI decision impact
  const aiDecisionImpact = analyzeAIDecisionOutcomes(orchestrationEvents, taskJourneys);

  return {
    taskJourneys: Object.values(taskJourneys),
    statusTransitions,
    blockageAnalysis,
    adaptationPatterns,
    aiDecisionImpact,
    totalTasks: Object.keys(taskJourneys).length
  };
};

/**
 * Categorize logs by priority and type
 */
export const categorizeLogs = (workflowLogs) => {
  if (!Array.isArray(workflowLogs)) return null;

  return {
    critical: workflowLogs.filter(log => isCriticalLog(log)),
    errors: workflowLogs.filter(log => isErrorLog(log)),
    warnings: workflowLogs.filter(log => isWarningLog(log)),
    orchestrationEvents: workflowLogs.filter(log => log.logType === 'OrchestrationStatusUpdate'),
    agentEvents: workflowLogs.filter(log => log.logType === 'AgentStatusUpdate'),
    taskEvents: workflowLogs.filter(log => log.logType === 'TaskStatusUpdate'),
    workflowEvents: workflowLogs.filter(log => log.logType === 'WorkflowStatusUpdate'),
    performanceEvents: workflowLogs.filter(log => isPerformanceLog(log)),
    userActions: workflowLogs.filter(log => isUserActionLog(log)),
    aiDecisions: workflowLogs.filter(log => isAIDecisionLog(log))
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS FOR LOG ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

const getSeverityLevel = (log) => {
  if (log.orchestrationEvent === 'ERROR' || log.workflowStatus === 'ERRORED') return 'critical';
  if (log.agentStatus === 'THINKING_ERROR' || log.taskStatus === 'ERROR') return 'high';
  if (log.agentStatus === 'ISSUES_PARSING_LLM_OUTPUT' || log.taskStatus === 'BLOCKED') return 'medium';
  if (log.orchestrationEvent?.includes('FALLBACK') || log.agentStatus?.includes('RETRY')) return 'low';
  return 'info';
};

const getErrorContext = (log) => {
  return {
    agent: log.agent?.name || null,
    task: log.task?.description || log.task?.title || null,
    timestamp: log.timestamp,
    logType: log.logType,
    metadata: log.metadata
  };
};

const generateErrorSolutions = (recurrentErrors, errorsByCategory) => {
  const solutions = [];

  recurrentErrors.forEach(({ error, count }) => {
    if (error.includes('THINKING_ERROR')) {
      solutions.push({
        error,
        count,
        priority: 'high',
        solution: 'Check LLM configuration and API keys. Consider increasing timeout or reducing complexity.',
        preventiveMeasures: ['Validate LLM config', 'Monitor API quotas', 'Implement retry logic']
      });
    } else if (error.includes('PARSING')) {
      solutions.push({
        error,
        count,
        priority: 'medium',
        solution: 'Review output schema validation. Update prompt templates for clearer output format.',
        preventiveMeasures: ['Update output schemas', 'Improve prompt clarity', 'Add output validation']
      });
    } else if (error.includes('TOOL_ERROR')) {
      solutions.push({
        error,
        count,
        priority: 'medium',
        solution: 'Verify tool availability and permissions. Check tool input parameters.',
        preventiveMeasures: ['Validate tool configs', 'Check permissions', 'Add input validation']
      });
    }
  });

  return solutions;
};

const calculateDecisionAccuracy = (orchestrationEvents) => {
  const decisions = orchestrationEvents.filter(e => e.orchestrationEvent === 'ORCHESTRATION_DECISIONS');
  const successful = decisions.filter(d => !d.metadata?.error);
  return successful.length / Math.max(decisions.length, 1);
};

const calculateAdaptationSuccessRate = (orchestrationEvents) => {
  const adaptations = orchestrationEvents.filter(e => e.orchestrationEvent === 'TASK_ADAPTATION');
  const successful = adaptations.filter(a => a.metadata?.adaptationPermissions?.canModify);
  return successful.length / Math.max(adaptations.length, 1);
};

const calculateGenerationEfficiency = (orchestrationEvents) => {
  const generations = orchestrationEvents.filter(e => e.orchestrationEvent === 'TASK_GENERATION');
  const totalGenerated = generations.reduce((sum, g) => sum + (g.metadata?.tasksGenerated || 0), 0);
  return totalGenerated / Math.max(generations.length, 1);
};

const calculateAverageDecisionTime = (orchestrationEvents) => {
  const decisions = orchestrationEvents.filter(e => e.orchestrationEvent === 'ORCHESTRATION_DECISIONS');
  const totalTime = decisions.reduce((sum, d) => sum + (d.metadata?.processingTime || 0), 0);
  return totalTime / Math.max(decisions.length, 1);
};

// Check if orchestration is currently active
export const isOrchestrationActive = (orchestrationEvents) => {
  if (!Array.isArray(orchestrationEvents) || orchestrationEvents.length === 0) return false;
  
  const statusObject = getOrchestrationStatus(orchestrationEvents);
  if (!statusObject) return false;
  
  // Use the isActive property from the status object
  return statusObject.isActive;
};

export const identifyBottlenecks = (workflowLogs) => {
  if (!Array.isArray(workflowLogs) || workflowLogs.length === 0) {
    return [];
  }

  const bottlenecks = [];
  
  // Identify slow agents
  const agentPerformance = {};
  workflowLogs.filter(log => log.logType === 'AgentStatusUpdate').forEach(log => {
    const agentName = log.agent?.name || 'Unknown';
    if (!agentPerformance[agentName]) {
      agentPerformance[agentName] = { thinkingTime: 0, toolTime: 0, iterations: 0 };
    }
    
    if (log.agentStatus === 'THINKING_END' && log.metadata?.output?.llmUsageStats) {
      agentPerformance[agentName].thinkingTime += log.metadata.output.llmUsageStats.responseTime || 0;
    }
    if (log.agentStatus === 'ITERATION_END') {
      agentPerformance[agentName].iterations++;
    }
  });

  Object.entries(agentPerformance).forEach(([agent, perf]) => {
    if (perf.iterations > 5) {
      bottlenecks.push({
        type: 'High Agent Iterations',
        description: `Agent "${agent}" required ${perf.iterations} iterations, indicating complexity issues`,
        severity: perf.iterations > 10 ? 'high' : 'medium',
        impact: {
          duration: null,
          efficiency: -(perf.iterations - 3) / 10,
          cost: null
        },
        suggestion: 'Review agent prompts and reduce complexity to minimize iterations'
      });
    }
  });

  // Analyze task completion times for additional bottlenecks
  const taskLogs = workflowLogs.filter(log => log.logType === 'TaskStatusUpdate');
  const taskDurations = new Map();
  
  taskLogs.forEach(log => {
    if (log.task?.id && log.metadata?.duration) {
      const taskId = log.task.id;
      if (!taskDurations.has(taskId) || taskDurations.get(taskId) < log.metadata.duration) {
        taskDurations.set(taskId, log.metadata.duration);
      }
    }
  });

  // Identify slow tasks (tasks taking longer than 2x the average)
  if (taskDurations.size > 0) {
    const durations = Array.from(taskDurations.values());
    const averageDuration = durations.reduce((sum, dur) => sum + dur, 0) / durations.length;
    const slowThreshold = averageDuration * 2;

    taskDurations.forEach((duration, taskId) => {
      if (duration > slowThreshold) {
        bottlenecks.push({
          type: 'Slow Task Execution',
          description: `Task "${taskId}" is taking ${Math.round(duration / 1000)}s, which is ${Math.round(duration / averageDuration)}x slower than average`,
          severity: duration > averageDuration * 3 ? 'critical' : 'high',
          impact: {
            duration: duration,
            efficiency: -((duration - averageDuration) / averageDuration),
            cost: null
          },
          suggestion: 'Consider breaking this task into smaller subtasks or optimizing its implementation'
        });
      }
    });
  }

  // Analyze error patterns
  const errorLogs = workflowLogs.filter(log => 
    getLogSeverityLevel(log) === 'critical' || getLogSeverityLevel(log) === 'high'
  );
  
  if (errorLogs.length > 0) {
    const errorRate = errorLogs.length / workflowLogs.length;
    
    if (errorRate > 0.1) { // More than 10% error rate
      bottlenecks.push({
        type: 'High Error Rate',
        description: `${Math.round(errorRate * 100)}% of workflow events are errors or warnings`,
        severity: errorRate > 0.2 ? 'critical' : 'high',
        impact: {
          duration: null,
          efficiency: -errorRate,
          cost: null
        },
        suggestion: 'Review error patterns and improve error handling to reduce recovery overhead'
      });
    }
  }

  return bottlenecks.sort((a, b) => {
    const severityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
    return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
  });
};

const calculateDetailedCosts = (workflowLogs) => {
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalCalls = 0;

  workflowLogs.forEach(log => {
    // Check multiple possible metadata structures for cost/token data
    if (log.metadata?.costDetails) {
      totalInputTokens += log.metadata.costDetails.inputTokens || 0;
      totalOutputTokens += log.metadata.costDetails.outputTokens || 0;
      totalCalls++;
    } else if (log.metadata?.output?.llmUsageStats) {
      totalInputTokens += log.metadata.output.llmUsageStats.inputTokens || 0;
      totalOutputTokens += log.metadata.output.llmUsageStats.outputTokens || 0;
      totalCalls++;
    } else if (log.metadata?.llmUsageStats) {
      // Direct llmUsageStats in metadata
      totalInputTokens += log.metadata.llmUsageStats.inputTokens || 0;
      totalOutputTokens += log.metadata.llmUsageStats.outputTokens || 0;
      totalCalls++;
    } else if (log.logType === 'AgentStatusUpdate' && log.agentStatus === 'THINKING_END' && log.metadata?.output) {
      // Agent thinking end logs often contain token usage
      const output = log.metadata.output;
      if (output.llmUsageStats) {
        totalInputTokens += output.llmUsageStats.inputTokens || 0;
        totalOutputTokens += output.llmUsageStats.outputTokens || 0;
        totalCalls++;
      }
    } else if (log.logType === 'OrchestrationStatusUpdate' && log.metadata?.tokenUsage) {
      // Orchestration logs with token usage
      totalInputTokens += log.metadata.tokenUsage.inputTokens || 0;
      totalOutputTokens += log.metadata.tokenUsage.outputTokens || 0;
      totalCalls++;
    }
  });

  // Rough cost calculation (varies by model) - more realistic pricing
  const avgInputCostPer1k = 0.0015; // $0.0015 per 1k input tokens (GPT-4 pricing)
  const avgOutputCostPer1k = 0.002; // $0.002 per 1k output tokens (GPT-4 pricing)

  const estimatedCost = (totalInputTokens / 1000) * avgInputCostPer1k + (totalOutputTokens / 1000) * avgOutputCostPer1k;

  return {
    totalInputTokens,
    totalOutputTokens,
    totalCalls,
    estimatedCost,
    breakdown: {
      inputCost: (totalInputTokens / 1000) * avgInputCostPer1k,
      outputCost: (totalOutputTokens / 1000) * avgOutputCostPer1k
    }
  };
};

const analyzeTaskBlockages = (taskLogs) => {
  const blockages = taskLogs.filter(log => log.taskStatus === 'BLOCKED');
  const blockageReasons = {};
  
  blockages.forEach(log => {
    const reason = log.metadata?.error || 'Unknown reason';
    blockageReasons[reason] = (blockageReasons[reason] || 0) + 1;
  });

  return {
    totalBlockages: blockages.length,
    reasonBreakdown: blockageReasons,
    avgBlockageDuration: calculateAverageBlockageDuration(taskLogs)
  };
};

const calculateAverageBlockageDuration = (taskLogs) => {
  const taskBlockages = {};
  let totalDuration = 0;
  let count = 0;

  taskLogs.forEach(log => {
    const taskId = log.task?.id;
    if (!taskId) return;

    if (log.taskStatus === 'BLOCKED') {
      taskBlockages[taskId] = log.timestamp;
    } else if (log.taskStatus === 'DOING' && taskBlockages[taskId]) {
      totalDuration += log.timestamp - taskBlockages[taskId];
      count++;
      delete taskBlockages[taskId];
    }
  });

  return count > 0 ? totalDuration / count : 0;
};

const analyzeTaskAdaptations = (orchestrationEvents, taskJourneys) => {
  const adaptations = orchestrationEvents.filter(e => e.orchestrationEvent === 'TASK_ADAPTATION');
  
  const adaptationsByLevel = {
    none: 0,
    minor: 0,
    moderate: 0,
    major: 0
  };

  const adaptationReasons = {};
  
  adaptations.forEach(adaptation => {
    const level = adaptation.metadata?.adaptationLevel || 'none';
    adaptationsByLevel[level]++;
    
    const reason = adaptation.metadata?.adaptationPermissions?.reason || 'Unknown';
    adaptationReasons[reason] = (adaptationReasons[reason] || 0) + 1;
  });

  return {
    totalAdaptations: adaptations.length,
    adaptationsByLevel,
    adaptationReasons,
    successRate: adaptations.filter(a => a.metadata?.adaptationPermissions?.canModify).length / Math.max(adaptations.length, 1)
  };
};

const analyzeAIDecisionOutcomes = (orchestrationEvents, taskJourneys) => {
  const decisions = orchestrationEvents.filter(e => e.orchestrationEvent === 'ORCHESTRATION_DECISIONS');
  
  let totalDecisions = 0;
  let successfulDecisions = 0;
  
  decisions.forEach(decision => {
    totalDecisions += decision.metadata?.decisionsGenerated || 0;
    // Consider a decision successful if it didn't lead to immediate errors
    // This is a simplified metric - in practice, you'd track more complex outcomes
    if (!decision.metadata?.error) {
      successfulDecisions += decision.metadata?.decisionsGenerated || 0;
    }
  });

  return {
    totalDecisions,
    successfulDecisions,
    successRate: successfulDecisions / Math.max(totalDecisions, 1),
    decisionTypes: {
      taskModifications: decisions.reduce((sum, d) => sum + (d.metadata?.modifyTasks || 0), 0),
      taskAdditions: decisions.reduce((sum, d) => sum + (d.metadata?.addTasks || 0), 0),
      taskRemovals: decisions.reduce((sum, d) => sum + (d.metadata?.removeTasks || 0), 0),
      priorityChanges: decisions.reduce((sum, d) => sum + (d.metadata?.changePriorities || 0), 0)
    }
  };
};

// Log classification helpers
const isCriticalLog = (log) => {
  return log.orchestrationEvent === 'ERROR' || 
         log.workflowStatus === 'ERRORED' || 
         log.agentStatus === 'THINKING_ERROR' ||
         log.taskStatus === 'ERROR';
};

const isErrorLog = (log) => {
  return log.orchestrationEvent?.includes('ERROR') ||
         log.agentStatus?.includes('ERROR') ||
         log.taskStatus === 'ERROR' ||
         log.workflowStatus === 'ERRORED' ||
         log.agentStatus === 'ISSUES_PARSING_LLM_OUTPUT';
};

const isWarningLog = (log) => {
  return log.orchestrationEvent?.includes('FALLBACK') ||
         log.taskStatus === 'BLOCKED' ||
         log.agentStatus?.includes('RETRY') ||
         log.orchestrationEvent?.includes('RECOVERY');
};

const isPerformanceLog = (log) => {
  return log.orchestrationEvent === 'PERFORMANCE_MONITORING' ||
         log.orchestrationEvent === 'OPTIMIZATION_STARTED' ||
         log.agentStatus === 'THINKING_END' ||
         log.taskStatus === 'DONE';
};

const isUserActionLog = (log) => {
  return log.taskStatus === 'REVISE' ||
         log.taskStatus === 'VALIDATED' ||
         log.metadata?.feedback;
};

const isAIDecisionLog = (log) => {
  return log.orchestrationEvent === 'ORCHESTRATION_DECISIONS' ||
         log.orchestrationEvent === 'TASK_SELECTION' ||
         log.orchestrationEvent === 'TASK_ADAPTATION' ||
         log.orchestrationEvent === 'TASK_GENERATION';
};


/**
 * Get event description based on orchestration event type and metadata
 */
export const getEventDescription = (eventType, metadata = {}) => {
  const eventDescriptions = {
    'ACTIVATED': 'Orchestrator activated and ready',
    'DEACTIVATED': 'Orchestrator deactivated',
    'COMPLETED': 'Orchestration completed successfully',
    'PAUSED': 'Orchestration paused',
    'RESUMED': 'Orchestration resumed',
    'ERROR': 'Orchestration error occurred',
    'TASK_SELECTION': () => `Selected ${metadata?.selectedTasksCount || 0} tasks for execution`,
    'TASK_ADAPTATION': () => `Adapted ${metadata?.adaptedTasksCount || 0} tasks`,
    'TASK_GENERATION': () => `Generated ${metadata?.tasksGenerated || 0} new tasks`,
    'TASK_REPOSITORY_UPDATE': 'Updated task repository',
    'AGENT_ASSIGNMENT': () => `Assigned ${metadata?.assignedAgentsCount || 0} agents to tasks`,
    'WORKLOAD_DISTRIBUTION': 'Distributed workload across agents',
    'PERFORMANCE_ANALYSIS': 'Analyzed team performance',
    'OPTIMIZATION': 'Applied optimization strategies',
    'LEARNING_UPDATE': 'Updated learning models',
    'MODE_SWITCH': () => `Switched to ${metadata?.newMode || 'unknown'} mode`,
    'STRATEGY_UPDATE': 'Updated orchestration strategy',
    'RESOURCE_ALLOCATION': 'Allocated resources',
    'BOTTLENECK_DETECTION': () => `Detected ${metadata?.bottleneckCount || 0} bottlenecks`,
    'CAPACITY_ANALYSIS': 'Analyzed team capacity',
    'QUALITY_CHECK': 'Performed quality assessment',
    'RISK_ASSESSMENT': 'Assessed project risks',
    'COORDINATION': 'Coordinated team activities',
    'COMMUNICATION': 'Facilitated team communication',
    'FEEDBACK_PROCESSING': 'Processed feedback',
    'ADAPTATION_TRIGGER': 'Triggered adaptation process',
    'RECOVERY': 'Initiated recovery procedures',
    'FALLBACK': 'Activated fallback strategy'
  };
  
  const description = eventDescriptions[eventType];
  
  if (typeof description === 'function') {
    return description();
  }
  
  return description || `Orchestration event: ${eventType}`;
};

/**
 * Get event status/severity for styling
 */
export const getEventStatus = (eventType) => {
  if (eventType.includes('ERROR')) return 'error';
  if (eventType.includes('FALLBACK') || eventType.includes('RECOVERY')) return 'warning';
  if (['ACTIVATED', 'COMPLETED', 'TASK_GENERATION', 'OPTIMIZATION'].includes(eventType)) return 'success';
  if (['PAUSED', 'DEACTIVATED'].includes(eventType)) return 'paused';
  return 'info';
};

/**
 * Get log severity level for a workflow log entry
 */
export const getLogSeverityLevel = (log) => {
  if (!log) return 'info';
  
  // Check for critical errors
  if (log.logType === 'WorkflowStatusUpdate' && log.workflowStatus === 'ERRORED') {
    return 'critical';
  }
  
  if (log.logType === 'TaskStatusUpdate' && log.taskStatus === 'ERROR') {
    return 'critical';
  }
  
  if (log.logType === 'OrchestrationStatusUpdate' && log.orchestrationEvent === 'ERROR') {
    return 'critical';
  }
  
  // Check for high priority issues
  if (log.logType === 'AgentStatusUpdate' && (
    log.agentStatus?.includes('ERROR') || 
    log.agentStatus?.includes('ISSUES') ||
    log.agentStatus === 'AGENT_THINKING_ERROR' ||
    log.agentStatus === 'AGENT_LOOP_ERROR'
  )) {
    return 'high';
  }
  
  if (log.logType === 'TaskStatusUpdate' && (
    log.taskStatus === 'BLOCKED' || 
    log.taskStatus === 'ABORTED'
  )) {
    return 'high';
  }
  
  if (log.logType === 'OrchestrationStatusUpdate' && (
    log.orchestrationEvent === 'FALLBACK_TASK_SELECTION' ||
    log.orchestrationEvent === 'LLM_RECOVERY_SUCCESS'
  )) {
    return 'high';
  }
  
  // Check for medium priority issues
  if (log.logType === 'TaskStatusUpdate' && log.taskStatus === 'AWAITING_VALIDATION') {
    return 'medium';
  }
  
  if (log.logType === 'WorkflowStatusUpdate' && (
    log.workflowStatus === 'PAUSED' || 
    log.workflowStatus === 'BLOCKED'
  )) {
    return 'medium';
  }
  
  if (log.logType === 'OrchestrationStatusUpdate' && (
    log.orchestrationEvent === 'PERFORMANCE_MONITORING' ||
    log.orchestrationEvent === 'GAP_ANALYSIS_COMPLETED'
  )) {
    return 'medium';
  }
  
  // Check for low priority informational items
  if (log.logType === 'TaskStatusUpdate' && (
    log.taskStatus === 'STARTED' || 
    log.taskStatus === 'COMPLETED'
  )) {
    return 'low';
  }
  
  if (log.logType === 'OrchestrationStatusUpdate' && (
    log.orchestrationEvent === 'ACTIVATED' ||
    log.orchestrationEvent === 'TASK_SELECTION' ||
    log.orchestrationEvent === 'COMPLETED'
  )) {
    return 'low';
  }
  
  // Default to info level
  return 'info';
};

/**
 * Get suggested solution for an error log
 */
export const getSuggestedErrorSolution = (errorLog) => {
  if (!errorLog || !errorLog.metadata?.error) {
    return 'No specific solution available. Check the logs for more details.';
  }
  
  const errorMessage = typeof errorLog.metadata.error === 'string' 
    ? errorLog.metadata.error 
    : errorLog.metadata.error.message || '';
  
  const errorType = errorLog.logType;
  const orchestrationEvent = errorLog.orchestrationEvent;
  
  // LLM and API related errors
  if (errorMessage.includes('API key') || errorMessage.includes('authentication')) {
    return 'Check your API keys in the settings. Ensure they are valid and have the necessary permissions.';
  }
  
  if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
    return 'You have hit the API rate limit. Wait a few minutes before retrying or upgrade your API plan.';
  }
  
  if (errorMessage.includes('network') || errorMessage.includes('connection')) {
    return 'Check your internet connection and firewall settings. The API service may be temporarily unavailable.';
  }
  
  // Task-specific errors
  if (errorType === 'TaskStatusUpdate') {
    if (errorMessage.includes('timeout')) {
      return 'The task took too long to complete. Consider breaking it into smaller tasks or increasing the timeout limit.';
    }
    
    if (errorMessage.includes('validation')) {
      return 'Task output failed validation. Review the task requirements and expected output format.';
    }
    
    return 'Review the task configuration and ensure all required inputs are provided correctly.';
  }
  
  // Agent-specific errors
  if (errorType === 'AgentStatusUpdate') {
    if (errorMessage.includes('tool')) {
      return 'There was an issue with a tool the agent tried to use. Check tool availability and configuration.';
    }
    
    if (errorMessage.includes('thinking') || errorMessage.includes('reasoning')) {
      return 'The agent encountered an error during the reasoning process. Try rephrasing the task or providing more context.';
    }
    
    return 'Check the agent configuration and ensure it has the necessary permissions and tools.';
  }
  
  // Orchestration-specific errors
  if (errorType === 'OrchestrationStatusUpdate') {
    if (orchestrationEvent === 'ERROR') {
      return 'The orchestration system encountered an error. Check your orchestration settings and try restarting the workflow.';
    }
    
    if (orchestrationEvent === 'FALLBACK_TASK_SELECTION') {
      return 'The primary task selection failed. The system used a fallback method. Consider reviewing task priorities.';
    }
    
    return 'Check the orchestration configuration and ensure all required parameters are set correctly.';
  }
  
  // Workflow-specific errors
  if (errorType === 'WorkflowStatusUpdate') {
    if (errorMessage.includes('dependency')) {
      return 'There was a dependency issue in the workflow. Check task dependencies and execution order.';
    }
    
    return 'Review the workflow configuration and ensure all steps are properly defined.';
  }
  
  // Generic solutions based on common error patterns
  if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
    return 'Check permissions and authentication settings. Ensure you have the necessary access rights.';
  }
  
  if (errorMessage.includes('format') || errorMessage.includes('parsing')) {
    return 'There was a data format issue. Check input formats and ensure they match expected schemas.';
  }
  
  if (errorMessage.includes('memory') || errorMessage.includes('resource')) {
    return 'System resources are low. Try reducing the complexity of the task or running fewer concurrent operations.';
  }
  
  // Default solution
  return 'Review the error details and check the documentation. If the issue persists, try restarting the workflow or contact support.';
};

/**
 * Get error type classification for error categorization
 */
export const getErrorType = (errorLog) => {
  if (!errorLog) return 'unknown';
  
  const errorMessage = errorLog.metadata?.error || errorLog.logDescription || '';
  const logType = errorLog.logType;
  const orchestrationEvent = errorLog.orchestrationEvent;
  const agentStatus = errorLog.agentStatus;
  const taskStatus = errorLog.taskStatus;
  const workflowStatus = errorLog.workflowStatus;
  
  // Orchestration errors
  if (logType === 'OrchestrationStatusUpdate') {
    if (orchestrationEvent === 'ERROR') return 'orchestrationError';
    if (orchestrationEvent === 'FALLBACK_TASK_SELECTION') return 'orchestrationFallback';
    if (orchestrationEvent === 'LLM_RECOVERY_SUCCESS') return 'orchestrationRecovery';
    return 'orchestrationEvent';
  }
  
  // Agent errors
  if (logType === 'AgentStatusUpdate') {
    if (agentStatus?.includes('THINKING_ERROR')) return 'agentThinkingError';
    if (agentStatus?.includes('ISSUES_PARSING_LLM_OUTPUT')) return 'agentParsingError';
    if (agentStatus?.includes('TOOL_ERROR')) return 'agentToolError';
    if (agentStatus?.includes('ERROR')) return 'agentError';
    if (agentStatus?.includes('RETRY')) return 'agentRetry';
    return 'agentStatus';
  }
  
  // Task errors
  if (logType === 'TaskStatusUpdate') {
    if (taskStatus === 'ERROR') return 'taskError';
    if (taskStatus === 'BLOCKED') return 'taskBlocked';
    if (taskStatus === 'ABORTED') return 'taskAborted';
    if (taskStatus === 'AWAITING_VALIDATION') return 'taskValidation';
    return 'taskStatus';
  }
  
  // Workflow errors
  if (logType === 'WorkflowStatusUpdate') {
    if (workflowStatus === 'ERRORED') return 'workflowError';
    if (workflowStatus === 'PAUSED') return 'workflowPaused';
    if (workflowStatus === 'BLOCKED') return 'workflowBlocked';
    return 'workflowStatus';
  }
  
  // Categorize by error message content
  if (typeof errorMessage === 'string') {
    if (errorMessage.includes('API key') || errorMessage.includes('authentication')) return 'apiAuthError';
    if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) return 'apiRateLimit';
    if (errorMessage.includes('network') || errorMessage.includes('connection')) return 'networkError';
    if (errorMessage.includes('timeout')) return 'timeoutError';
    if (errorMessage.includes('validation')) return 'validationError';
    if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) return 'permissionError';
    if (errorMessage.includes('format') || errorMessage.includes('parsing')) return 'formatError';
    if (errorMessage.includes('memory') || errorMessage.includes('resource')) return 'resourceError';
    if (errorMessage.includes('dependency')) return 'dependencyError';
  }
  
  return 'genericError';
};

/**
 * Get affected component identification for error context
 */
export const getAffectedComponent = (errorLog) => {
  if (!errorLog) return 'Unknown';
  
  const logType = errorLog.logType;
  const agent = errorLog.agent;
  const task = errorLog.task;
  const orchestrationEvent = errorLog.orchestrationEvent;
  const errorMessage = errorLog.metadata?.error || errorLog.logDescription || '';
  
  // Try to identify component from log structure
  if (logType === 'OrchestrationStatusUpdate') {
    if (orchestrationEvent) {
      return `Orchestration (${orchestrationEvent})`;
    }
    return 'Orchestration System';
  }
  
  if (logType === 'AgentStatusUpdate' && agent?.name) {
    return `Agent: ${agent.name}`;
  }
  
  if (logType === 'TaskStatusUpdate' && task?.id) {
    const taskTitle = task.title || task.description || task.id;
    return `Task: ${taskTitle}`;
  }
  
  if (logType === 'WorkflowStatusUpdate') {
    return 'Workflow Engine';
  }
  
  // Try to extract component from error message
  if (typeof errorMessage === 'string') {
    // Look for component mentions in error messages
    if (errorMessage.includes('LLM') || errorMessage.includes('language model')) {
      return 'Language Model';
    }
    if (errorMessage.includes('database') || errorMessage.includes('DB')) {
      return 'Database';
    }
    if (errorMessage.includes('API') || errorMessage.includes('endpoint')) {
      return 'API Service';
    }
    if (errorMessage.includes('tool') && agent?.name) {
      return `${agent.name} Tools`;
    }
    if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      return 'Network Layer';
    }
    if (errorMessage.includes('file') || errorMessage.includes('filesystem')) {
      return 'File System';
    }
    if (errorMessage.includes('memory') || errorMessage.includes('resource')) {
      return 'System Resources';
    }
  }
  
  // Fallback identification based on log type
  switch (logType) {
    case 'OrchestrationStatusUpdate':
      return 'Orchestration System';
    case 'AgentStatusUpdate':
      return agent?.name ? `Agent: ${agent.name}` : 'Agent System';
    case 'TaskStatusUpdate':
      return task?.id ? `Task: ${task.id}` : 'Task System';
    case 'WorkflowStatusUpdate':
      return 'Workflow Engine';
    default:
      return 'System Component';
  }
};

