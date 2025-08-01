/**
 * Performance Logger Utility
 * 
 * Sammelt echte Performance-Daten für das KaibanBoard Analytics-System
 * Generiert die Log-Events, die von orchestrationHelper.js analysiert werden
 */

class PerformanceLogger {
  constructor() {
    this.logs = [];
    this.sessionStartTime = null;
    this.activeOperations = new Map();
    this.tokenCounters = new Map();
    this.costAccumulator = 0;
    this.callbacks = [];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  startSession(sessionId) {
    this.sessionStartTime = Date.now();
    this.logs = [];
    this.activeOperations.clear();
    this.tokenCounters.clear();
    this.costAccumulator = 0;
    
    this.log({
      logType: 'WorkflowStatusUpdate',
      workflowStatus: 'STARTED',
      sessionId,
      logDescription: `Workflow session ${sessionId} started`,
      metadata: {
        sessionId,
        startTime: this.sessionStartTime
      }
    });
  }

  endSession(sessionId) {
    const endTime = Date.now();
    const duration = endTime - (this.sessionStartTime || endTime);
    
    this.log({
      logType: 'WorkflowStatusUpdate',
      workflowStatus: 'COMPLETED',
      sessionId,
      logDescription: `Workflow session ${sessionId} completed`,
      metadata: {
        sessionId,
        endTime,
        totalDuration: duration,
        totalCost: this.costAccumulator,
        totalLogs: this.logs.length
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // AGENT PERFORMANCE TRACKING
  // ═══════════════════════════════════════════════════════════════════════════

  startAgentThinking(agentName, taskId, agentId) {
    const operationId = `thinking_${agentId}_${Date.now()}`;
    this.activeOperations.set(operationId, {
      type: 'thinking',
      startTime: Date.now(),
      agentName,
      taskId,
      agentId
    });

    this.log({
      logType: 'AgentStatusUpdate',
      agentStatus: 'THINKING_START',
      agent: { id: agentId, name: agentName },
      task: { id: taskId },
      logDescription: `Agent ${agentName} started thinking`,
      metadata: {
        operationId,
        startTime: Date.now()
      }
    });

    return operationId;
  }

  endAgentThinking(operationId, llmUsageStats = {}) {
    const operation = this.activeOperations.get(operationId);
    if (!operation) return;

    const endTime = Date.now();
    const responseTime = endTime - operation.startTime;
    
    // Token counting
    const inputTokens = llmUsageStats.inputTokens || 0;
    const outputTokens = llmUsageStats.outputTokens || 0;
    const totalTokens = inputTokens + outputTokens;
    
    // Cost calculation (OpenAI GPT-4 pricing example)
    const inputCost = inputTokens * 0.01 / 1000; // $0.01 per 1K input tokens
    const outputCost = outputTokens * 0.03 / 1000; // $0.03 per 1K output tokens
    const totalCost = inputCost + outputCost;
    this.costAccumulator += totalCost;

    // Update agent token counter
    const agentName = operation.agentName;
    if (!this.tokenCounters.has(agentName)) {
      this.tokenCounters.set(agentName, { inputTokens: 0, outputTokens: 0, calls: 0, cost: 0 });
    }
    const counter = this.tokenCounters.get(agentName);
    counter.inputTokens += inputTokens;
    counter.outputTokens += outputTokens;
    counter.calls += 1;
    counter.cost += totalCost;

    this.log({
      logType: 'AgentStatusUpdate',
      agentStatus: 'THINKING_END',
      agent: { id: operation.agentId, name: operation.agentName },
      task: { id: operation.taskId },
      logDescription: `Agent ${operation.agentName} finished thinking (${responseTime}ms)`,
      metadata: {
        operationId,
        output: {
          llmUsageStats: {
            inputTokens,
            outputTokens,
            totalTokens,
            responseTime,
            cost: totalCost
          }
        },
        duration: responseTime
      }
    });

    this.activeOperations.delete(operationId);
    return { responseTime, totalTokens, totalCost };
  }

  logAgentToolUse(agentName, agentId, toolName, taskId) {
    this.log({
      logType: 'AgentStatusUpdate',
      agentStatus: 'USING_TOOL',
      agent: { id: agentId, name: agentName },
      task: { id: taskId },
      logDescription: `Agent ${agentName} is using tool '${toolName}'`,
      metadata: {
        tool: { name: toolName },
        startTime: Date.now()
      }
    });
  }

  logAgentError(agentName, agentId, error, taskId) {
    this.log({
      logType: 'AgentStatusUpdate',
      agentStatus: 'THINKING_ERROR',
      agent: { id: agentId, name: agentName },
      task: { id: taskId },
      logDescription: `Agent ${agentName} encountered an error: ${error.message}`,
      metadata: {
        error: {
          message: error.message,
          stack: error.stack,
          type: error.constructor.name
        }
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TASK PERFORMANCE TRACKING
  // ═══════════════════════════════════════════════════════════════════════════

  logTaskStatusChange(taskId, newStatus, oldStatus, taskTitle, agentName) {
    const statusChangeTime = Date.now();
    
    this.log({
      logType: 'TaskStatusUpdate',
      taskStatus: newStatus,
      task: { id: taskId, title: taskTitle },
      agent: agentName ? { name: agentName } : null,
      logDescription: `Task '${taskTitle}' changed from ${oldStatus} to ${newStatus}`,
      metadata: {
        previousStatus: oldStatus,
        statusChangeTime,
        changedBy: agentName
      }
    });

    // Track task duration for DOING -> DONE transitions
    if (oldStatus === 'DOING' && newStatus === 'DONE') {
      const doingStartLog = this.logs.find(log => 
        log.logType === 'TaskStatusUpdate' && 
        log.task?.id === taskId && 
        log.taskStatus === 'DOING'
      );
      
      if (doingStartLog) {
        const taskDuration = statusChangeTime - doingStartLog.timestamp;
        this.log({
          logType: 'TaskStatusUpdate',
          taskStatus: 'COMPLETED_WITH_METRICS',
          task: { id: taskId, title: taskTitle },
          logDescription: `Task '${taskTitle}' completed in ${taskDuration}ms`,
          metadata: {
            duration: taskDuration,
            completionTime: statusChangeTime
          }
        });
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ORCHESTRATION EVENTS
  // ═══════════════════════════════════════════════════════════════════════════

  logOrchestrationEvent(eventType, metadata = {}) {
    this.log({
      logType: 'OrchestrationStatusUpdate',
      orchestrationEvent: eventType,
      logDescription: `Orchestration: ${eventType}`,
      metadata: {
        ...metadata,
        eventTime: Date.now()
      }
    });
  }

  logTaskSelection(selectedTasks, aiReasoning, confidence) {
    this.log({
      logType: 'OrchestrationStatusUpdate', 
      orchestrationEvent: 'TASK_SELECTION',
      logDescription: `AI selected ${selectedTasks.length} tasks`,
      metadata: {
        selectedTasks,
        aiReasoning,
        confidence,
        isOrchestrationEvent: true
      }
    });
  }

  logTaskAdaptation(taskId, originalTask, adaptedTask, adaptationReason) {
    this.log({
      logType: 'OrchestrationStatusUpdate',
      orchestrationEvent: 'TASK_ADAPTATION', 
      logDescription: `AI adapted task '${originalTask.title}'`,
      metadata: {
        taskId,
        originalTask,
        adaptedTask,
        adaptationReason,
        adaptationLevel: 'moderate',
        isOrchestrationEvent: true
      }
    });
  }

  logTaskGeneration(newTasks, generationReason) {
    this.log({
      logType: 'OrchestrationStatusUpdate',
      orchestrationEvent: 'TASK_GENERATION',
      logDescription: `AI generated ${newTasks.length} new tasks`,
      metadata: {
        newTasks,
        generationReason,
        isOrchestrationEvent: true
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE LOGGING
  // ═══════════════════════════════════════════════════════════════════════════

  log(logEntry) {
    const timestamp = Date.now();
    const fullLogEntry = {
      timestamp,
      id: `log_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
      ...logEntry
    };

    this.logs.push(fullLogEntry);
    
    // Notify subscribers
    this.callbacks.forEach(callback => {
      try {
        callback(fullLogEntry, this.logs);
      } catch (error) {
        console.error('Error in performance logger callback:', error);
      }
    });

    return fullLogEntry;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DATA ACCESS
  // ═══════════════════════════════════════════════════════════════════════════

  getLogs() {
    return [...this.logs];
  }

  getTokenStats() {
    const stats = {};
    this.tokenCounters.forEach((counter, agentName) => {
      stats[agentName] = { ...counter };
    });
    return stats;
  }

  getTotalCost() {
    return this.costAccumulator;
  }

  getSessionDuration() {
    if (!this.sessionStartTime) return 0;
    return Date.now() - this.sessionStartTime;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SUBSCRIPTION
  // ═══════════════════════════════════════════════════════════════════════════

  subscribe(callback) {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  clear() {
    this.logs = [];
    this.activeOperations.clear();
    this.tokenCounters.clear();
    this.costAccumulator = 0;
    this.sessionStartTime = null;
  }
}

// Singleton instance
const performanceLogger = new PerformanceLogger();

// Helper functions for common logging patterns
export const logAgentStart = (agentName, taskId, agentId) => {
  return performanceLogger.startAgentThinking(agentName, taskId, agentId);
};

export const logAgentComplete = (operationId, llmStats) => {
  return performanceLogger.endAgentThinking(operationId, llmStats);
};

export const logTaskChange = (taskId, newStatus, oldStatus, taskTitle, agentName) => {
  return performanceLogger.logTaskStatusChange(taskId, newStatus, oldStatus, taskTitle, agentName);
};

export const logAISelection = (tasks, reasoning, confidence) => {
  return performanceLogger.logTaskSelection(tasks, reasoning, confidence);
};

export const logAIAdaptation = (taskId, original, adapted, reason) => {
  return performanceLogger.logTaskAdaptation(taskId, original, adapted, reason);
};

export const logWorkflowStart = (sessionId) => {
  return performanceLogger.startSession(sessionId);
};

export const logWorkflowEnd = (sessionId) => {
  return performanceLogger.endSession(sessionId);
};

export default performanceLogger;