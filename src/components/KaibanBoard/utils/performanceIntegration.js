/**
 * Performance Integration Utility
 * 
 * Verbindet KaibanBoard mit PerformanceLogger für echte Datensammlung
 * Stellt High-Level-Wrapper für Performance-Logging bereit
 */

import { usePlaygroundStore } from '../store/PlaygroundProvider';
import performanceLogger from './performanceLogger';

// Store Hook für Performance-Logging
export const usePerformanceLogging = () => {
  const store = usePlaygroundStore();
  
  if (!store) {
    console.warn('Performance logging hook called outside of PlaygroundProvider');
    return {
      startWorkflowSession: () => null,
      endWorkflowSession: () => false,
      logTaskChange: () => null,
      startAgentThinking: () => null,
      endAgentThinking: () => null,
      logAISelection: () => null,
      logAIAdaptation: () => null,
      logOrchestrationEvent: () => null,
      getPerformanceStats: () => ({ logs: [], tokenStats: {}, totalCost: 0, sessionDuration: 0 }),
      getLiveLogs: () => [],
      getLiveTokenStats: () => {},
      getLiveCost: () => 0,
      getSessionDuration: () => 0
    };
  }

  const state = store.getState();
  
  return {
    // Workflow-Lifecycle
    startWorkflowSession: () => state.initializeWorkflowSessionAction(),
    endWorkflowSession: (workflowLogs, teamName) => 
      state.savePersistentAnalyticsAction(workflowLogs, teamName),
    
    // Task-Lifecycle
    logTaskChange: (taskId, newStatus, oldStatus, taskTitle, agentName) =>
      state.logTaskStatusChangeAction(taskId, newStatus, oldStatus, taskTitle, agentName),
    
    // Agent-Lifecycle
    startAgentThinking: (agentName, taskId, agentId) =>
      state.logAgentThinkingStartAction(agentName, taskId, agentId),
    endAgentThinking: (operationId, llmStats) =>
      state.logAgentThinkingEndAction(operationId, llmStats),
    
    // Orchestration-Events
    logAISelection: (tasks, reasoning, confidence) =>
      state.logOrchestrationSelectionAction(tasks, reasoning, confidence),
    logAIAdaptation: (taskId, original, adapted, reason) =>
      state.logOrchestrationAdaptationAction(taskId, original, adapted, reason),
    logOrchestrationEvent: (eventType, metadata) =>
      state.logOrchestrationEventAction(eventType, metadata),
    
    // Performance-Stats
    getPerformanceStats: () => state.getPerformanceStatsAction(),
    
    // Real-time Data Access
    getLiveLogs: () => performanceLogger.getLogs(),
    getLiveTokenStats: () => performanceLogger.getTokenStats(),
    getLiveCost: () => performanceLogger.getTotalCost(),
    getSessionDuration: () => performanceLogger.getSessionDuration()
  };
};

// Performance-Logging Decorator für KaibanJS Agents
export const withPerformanceLogging = (agent) => {
  const originalThink = agent.think;
  const originalTool = agent.tool;
  
  return {
    ...agent,
    
    // Wrap think method with performance logging
    think: async (message, options = {}) => {
      const agentId = agent.id || `agent_${Date.now()}`;
      const taskId = options.taskId || 'unknown_task';
      
      // Start performance tracking
      const operationId = performanceLogger.startAgentThinking(
        agent.name || 'Unknown Agent',
        taskId,
        agentId
      );
      
      try {
        const result = await originalThink.call(agent, message, options);
        
        // Extract LLM stats if available
        const llmStats = {
          inputTokens: result?.usage?.inputTokens || 0,
          outputTokens: result?.usage?.outputTokens || 0,
          totalTokens: result?.usage?.totalTokens || 0
        };
        
        // End performance tracking
        performanceLogger.endAgentThinking(operationId, llmStats);
        
        return result;
      } catch (error) {
        // Log error and end tracking
        performanceLogger.logAgentError(
          agent.name || 'Unknown Agent',
          agentId,
          error,
          taskId
        );
        performanceLogger.endAgentThinking(operationId);
        throw error;
      }
    },
    
    // Wrap tool usage with logging
    tool: async (toolName, input, options = {}) => {
      const agentId = agent.id || `agent_${Date.now()}`;
      const taskId = options.taskId || 'unknown_task';
      
      // Log tool usage
      performanceLogger.logAgentToolUse(
        agent.name || 'Unknown Agent',
        agentId,
        toolName,
        taskId
      );
      
      return originalTool.call(agent, toolName, input, options);
    }
  };
};

// Auto-Integration für KaibanJS Team
export const enablePerformanceTracking = (team) => {
  if (!team || !team.agents) {
    console.warn('Invalid team provided for performance tracking');
    return team;
  }
  
  // Wrap all agents with performance logging
  const enhancedAgents = team.agents.map(agent => withPerformanceLogging(agent));
  
  // Subscribe to performance logger for real-time updates
  const unsubscribe = performanceLogger.subscribe((logEntry, allLogs) => {
    // Real-time performance data can be accessed here
    // Could trigger UI updates, alerts, etc.
    console.log('📊 Performance Log:', logEntry.logType, logEntry.logDescription);
  });
  
  return {
    ...team,
    agents: enhancedAgents,
    _performanceUnsubscribe: unsubscribe
  };
};

// Convenience wrapper für einfache Integration
export const startPerformanceMonitoring = (team) => {
  console.log('🚀 Starting performance monitoring for team:', team.name);
  
  // Enable automatic performance tracking
  const enhancedTeam = enablePerformanceTracking(team);
  
  // Initialize workflow session
  const sessionId = performanceLogger.startSession(
    `team_${team.name}_${Date.now()}`
  );
  
  console.log('📊 Performance monitoring started. Session ID:', sessionId);
  
  return {
    team: enhancedTeam,
    sessionId,
    
    // Cleanup function
    stop: () => {
      if (enhancedTeam._performanceUnsubscribe) {
        enhancedTeam._performanceUnsubscribe();
      }
      performanceLogger.endSession(sessionId);
      console.log('🏁 Performance monitoring stopped for session:', sessionId);
    }
  };
};

// Demo-Daten Generator für Testing
export const generateSamplePerformanceData = () => {
  const sessionId = `demo_session_${Date.now()}`;
  performanceLogger.startSession(sessionId);
  
  // Simuliere Agent-Aktivitäten
  const agents = ['Agent-1', 'Agent-2', 'Agent-3'];
  const tasks = ['task-1', 'task-2', 'task-3'];
  
  agents.forEach((agentName, index) => {
    tasks.forEach((taskId, taskIndex) => {
      // Simuliere Agent-Thinking
      const operationId = performanceLogger.startAgentThinking(
        agentName,
        taskId,
        `agent_${index}`
      );
      
      // Simuliere LLM-Usage
      setTimeout(() => {
        performanceLogger.endAgentThinking(operationId, {
          inputTokens: Math.floor(Math.random() * 1000) + 100,
          outputTokens: Math.floor(Math.random() * 500) + 50,
        });
      }, Math.random() * 100);
      
      // Simuliere Task-Status-Changes
      performanceLogger.logTaskStatusChange(
        taskId,
        'DOING',
        'TODO',
        `Sample Task ${taskIndex + 1}`,
        agentName
      );
    });
  });
  
  // Simuliere Orchestration-Events
  performanceLogger.logTaskSelection(
    [{ id: 'task-1', title: 'Sample Task 1' }],
    'AI selected this task based on priority and dependencies',
    0.85
  );
  
  performanceLogger.logTaskAdaptation(
    'task-2',
    { title: 'Original Task' },
    { title: 'Adapted Task' },
    'Task adapted based on workflow feedback'
  );
  
  setTimeout(() => {
    performanceLogger.endSession(sessionId);
    console.log('🎭 Sample performance data generated for session:', sessionId);
  }, 1000);
  
  return sessionId;
};

export default {
  usePerformanceLogging,
  withPerformanceLogging,
  enablePerformanceTracking,
  startPerformanceMonitoring,
  generateSamplePerformanceData
};