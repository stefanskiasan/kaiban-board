import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import toast from 'react-hot-toast';
import {
  encryptKeys,
  extractTeamName,
  findEnvValues,
  findSingleEnvValue,
} from '../utils/helper';
import { resumeCreationOpenai } from '../assets/teams/resume_creation';
import { saveKeysToLocalStorage, loadKeysFromLocalStorage } from '../utils/localStorageKeys';
import { 
  saveAnalyticsToLocalStorage, 
  loadAnalyticsFromLocalStorage, 
  generateAnalyticsSessionId,
  getAnalyticsStorageStats 
} from '../utils/localStorageKeys';
import performanceLogger, {
  logWorkflowStart,
  logWorkflowEnd,
  logTaskChange,
  logAgentStart,
  logAgentComplete,
  logAISelection,
  logAIAdaptation
} from '../utils/performanceLogger';

// INFO: For code evaluation
import { Agent, Task, Team } from 'kaibanjs';
import {
  Serper,
  WolframAlphaTool,
  ExaSearch,
  GithubIssues,
  Firecrawl,
  JinaUrlToMarkdown,
  SimpleRAG,
  WebsiteSearch,
  PdfSearch,
  TextFileSearch,
  ZapierWebhook,
  MakeWebhook,
} from '@kaibanjs/tools';
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { SearchApi } from '@langchain/community/tools/searchapi';
import { DallEAPIWrapper } from '@langchain/openai';
// TODO: Remove this import and delete the tools folder
import { SerperTool } from '../tools';

const createAgentsPlaygroundStore = (initialState = {}) => {
  return create(
    devtools(
      subscribeWithSelector((set, get) => ({
        //states
        teamStore: null,
        code: null,
        errorState: { hasError: false, error: null },
        selectedTab: 0,

        isActivityOpen: false,
        isExecutionDialogOpen: false,
        isCelebrationDialogOpen: false,
        isOrchestrationProgressOpen: false,
        persistedWorkflowLogs: [], // Store logs locally to persist across dialog sessions
        
        // Persistent Orchestration Analytics
        persistentOrchestrationAnalytics: [], // Historical analytics sessions
        currentWorkflowSessionId: null, // Current workflow session ID for analytics
        workflowStartTime: null, // Track when current workflow started

        selectedTask: null,
        isTaskDetailsDialogOpen: false,

        db: null,
        isShareDialogOpen: false,
        isLoadingShare: false,
        isShareUrlDialogOpen: false,
        shareUrl: '',

        isMissingKeysDialogOpen: false,
        
        // Use Case Dialog states
        isUseCaseDialogOpen: false,
        useCaseDialogMode: 'new', // 'new' | 'update'
        generatedUseCase: null,

        uiSettings: {
          showFullScreen: true,
          showExampleMenu: true,
          showShareOption: false,
          showSettingsOption: false,
          showExampleTeams: true,
          maximizeConfig: {
            isActive: false,
            scrollPosition: 0,
          },
          isPreviewMode: true,
          showSimpleShareOption: true,
          showWelcomeInfo: true,
          selectedTab: 0,
        },

        defaultEnvVars: [],

        keys: [],
        isOpenSettingsDialog: false,

        project: {
          name: 'Untitled Project',
          user: { name: 'Anonymous' },
        },

        teams: [],

        exampleTeams: [],

        ...initialState, // Merge initial state

        //actions
        setTeamStoreAction: teamStore => set({ teamStore }),

        setCodeAction: code => {
          try {
            const createTeam = code => {
              try {
                let valueToEvaluate = code;

                // Define allowed modules
                const allowedModules = [
                  'Agent',
                  'Task',
                  'Team',
                  'TavilySearchResults',
                  'SearchApi',
                  'DallEAPIWrapper',
                  'Serper',
                  'WolframAlphaTool',
                  'ExaSearch',
                  'GithubIssues',
                  'Firecrawl',
                  'JinaUrlToMarkdown',
                  'SimpleRAG',
                  'WebsiteSearch',
                  'PdfSearch',
                  'TextFileSearch',
                  'ZapierWebhook',
                  'MakeWebhook',
                ];

                // Check if allowed modules are imported
                allowedModules.forEach(module => {
                  const usageRegex = new RegExp(`\\b${module}\\b`, 'g');
                  const importRegex = new RegExp(
                    `import\\s+.*\\b${module}\\b.*from\\s+['"].*['"]\\s*;?`,
                    'g'
                  );
                  if (
                    usageRegex.test(valueToEvaluate) &&
                    !importRegex.test(valueToEvaluate)
                  ) {
                    throw new Error(
                      `Missing required import for used module: ${module}`
                    );
                  }
                });

                // Remove import statements - handles indented imports
                valueToEvaluate = valueToEvaluate.replace(
                  /^\s*import\s+.*;?$/gm,
                  ''
                );

                // Replace the team start function
                valueToEvaluate = valueToEvaluate.replace(
                  /.*?\b(\w+)\s*\.\s*start\(\)(?:\s*\.then\(\s*\(.*?\)\s*=>\s*\{[\s\S]*?\}\s*\))?;?/g,
                  ''
                );

                // Add the team return statements
                let teamNames = [];
                valueToEvaluate.replace(
                  /(const|let|var)\s+(\w+)\s*=\s*new\s+Team\s*\([^)]*\)\s*;/g,
                  (match, decl, name) => {
                    teamNames.push(name);
                    return match;
                  }
                );
                
                // Only add return statement if we found teams
                if (teamNames.length > 0) {
                  // Return the first team found (there should only be one)
                  valueToEvaluate = valueToEvaluate + '\nreturn ' + teamNames[0] + ';';
                } else {
                  // If no explicit team variable found, try to find the last team assignment
                  valueToEvaluate += '\nreturn team;';
                }

                // Debug: Log the code that's about to be evaluated
                console.log('🔍 DEBUG: Code to be evaluated:', valueToEvaluate);

                // Get keys
                const { keys } = get();

                // Replace keys with their corresponding values
                if (keys && keys.length > 0) {
                  keys.forEach(({ key, value }) => {
                    const keyRegex = new RegExp(
                      key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                      'g'
                    );
                    valueToEvaluate = valueToEvaluate.replace(keyRegex, value);
                  });
                }

                // Create the function and evaluate
                const func = new Function(
                  'Agent',
                  'Task',
                  'Team',
                  'TavilySearchResults',
                  'SearchApi',
                  'DallEAPIWrapper',
                  'WolframAlphaTool',
                  'SerperTool',
                  'Serper',
                  'ExaSearch',
                  'GithubIssues',
                  'Firecrawl',
                  'JinaUrlToMarkdown',
                  'SimpleRAG',
                  'WebsiteSearch',
                  'PdfSearch',
                  'TextFileSearch',
                  'ZapierWebhook',
                  'MakeWebhook',
                  valueToEvaluate
                );
                const team = func(
                  Agent,
                  Task,
                  Team,
                  TavilySearchResults,
                  SearchApi,
                  DallEAPIWrapper,
                  WolframAlphaTool,
                  SerperTool,
                  Serper,
                  ExaSearch,
                  GithubIssues,
                  Firecrawl,
                  JinaUrlToMarkdown,
                  SimpleRAG,
                  WebsiteSearch,
                  PdfSearch,
                  TextFileSearch,
                  ZapierWebhook,
                  MakeWebhook
                );

                return team;
              } catch (error) {
                console.error('Invalid code:', error);
                
                // CRITICAL FIX: Don't treat API key errors as code errors during app initialization
                // API key errors should only trigger the dialog when user starts workflow
                const isApiKeyError = error.message && error.message.includes('API key is missing');
                
                if (isApiKeyError) {
                  console.log('🔑 DEBUG: API key error detected during team creation - NOT setting error state');
                  // Don't set error state for API key issues during initialization
                  // The team creation will still fail gracefully, but no error dialog will show
                  return null;
                } else {
                  // Only set error state for actual code errors (syntax, imports, etc.)
                  console.log('❌ DEBUG: Actual code error detected - setting error state');
                  set({ errorState: { hasError: true, error: error.message } });
                  return null;
                }
              }
            };

            const team = createTeam(code);
            if (team && typeof team.useStore === 'function') {
              try {
                const store = team.useStore(team);
                if (store) {
                  const { setTeamStoreAction } = get();
                  setTeamStoreAction(store);
                  set({
                    code,
                    selectedTab: 0,
                    errorState: { hasError: false, error: null },
                  });
                }
              } catch (error) {
                console.log('🔑 DEBUG: Error during team.useStore - likely API key issue');
                // Handle API key errors during store creation
                const isApiKeyError = error.message && error.message.includes('API key is missing');
                
                if (isApiKeyError) {
                  console.log('🔑 DEBUG: API key error in useStore - storing code but not creating team store');
                  // Store the code but don't create team store - user can start workflow later
                  set({
                    code,
                    selectedTab: 0,
                    errorState: { hasError: false, error: null }, // Don't set error for API key issues
                  });
                } else {
                  console.log('❌ DEBUG: Actual error in useStore - setting error state');
                  set({ errorState: { hasError: true, error: error.message } });
                }
              }
            } else if (team === null) {
              // Team creation failed due to API key error - store code for later use
              console.log('🔑 DEBUG: Team creation returned null (API key error) - storing code only');
              set({
                code,
                selectedTab: 0,
                errorState: { hasError: false, error: null },
              });
            }
          } catch (error) {
            console.error('Invalid code:', error);
            set({ errorState: { hasError: true, error: error.message } });
          }
        },

        setTabAction: selectedTab => set({ selectedTab }),

        setActivityOpenAction: isActivityOpen => set({ isActivityOpen }),
        setExecutionDialogOpenAction: isExecutionDialogOpen =>
          set({ isExecutionDialogOpen }),
        setCelebrationDialogOpenAction: isCelebrationDialogOpen =>
          set({ isCelebrationDialogOpen }),
        setOrchestrationProgressOpenAction: isOrchestrationProgressOpen => {
          if (isOrchestrationProgressOpen) {
            // Close other dialogs when opening OrchestrationProgressDialog to prevent conflicts
            set({ 
              isOrchestrationProgressOpen: true,
              isMissingKeysDialogOpen: false,
              isExecutionDialogOpen: false,
              isUseCaseDialogOpen: false
            });
          } else {
            set({ isOrchestrationProgressOpen: false });
          }
        },
        
        // Actions for managing persisted workflow logs
        updatePersistedLogsAction: (workflowLogs) => 
          set(state => ({ 
            persistedWorkflowLogs: workflowLogs && workflowLogs.length > 0 ? workflowLogs : state.persistedWorkflowLogs 
          })),
        clearPersistedLogsAction: () => set({ persistedWorkflowLogs: [] }),

        // Actions for managing persistent orchestration analytics
        initializeWorkflowSessionAction: () => {
          const sessionId = generateAnalyticsSessionId();
          console.log('🎯 Starting new workflow session:', sessionId);
          
          // Initialize performance logger for new session
          logWorkflowStart(sessionId);
          
          set({ 
            currentWorkflowSessionId: sessionId,
            workflowStartTime: Date.now()
          });
          return sessionId;
        },

        savePersistentAnalyticsAction: async (workflowLogs = [], teamName = 'Unknown Team') => {
          const { currentWorkflowSessionId, workflowStartTime, persistedWorkflowLogs } = get();
          
          if (!currentWorkflowSessionId) {
            console.warn('No active workflow session to save analytics for');
            return false;
          }

          try {
            // End performance logger session and get real-time logs
            logWorkflowEnd(currentWorkflowSessionId);
            const performanceLogs = performanceLogger.getLogs();
            
            // Import orchestration helper functions dynamically
            const { 
              analyzeErrorPatterns, 
              analyzePerformanceMetrics, 
              analyzeTaskFlows 
            } = await import('../utils/orchestrationHelper');

            // Combine all log sources for complete analytics
            const allLogs = [
              ...(workflowLogs || []),
              ...(persistedWorkflowLogs || []),
              ...performanceLogs // Include real performance data
            ];
            
            // Filter orchestration-specific logs
            const orchestrationLogs = allLogs.filter(log => 
              log.logType === 'OrchestrationStatusUpdate' || 
              log.orchestrationEvent || 
              log.metadata?.isOrchestrationEvent
            );

            // Generate comprehensive analytics with real performance data
            const analyticsData = {
              sessionId: currentWorkflowSessionId,
              teamName,
              startTime: workflowStartTime,
              endTime: Date.now(),
              duration: Date.now() - (workflowStartTime || Date.now()),
              orchestrationLogs,
              performanceLogs, // Store raw performance logs
              totalLogs: allLogs.length,
              performanceStats: {
                totalCost: performanceLogger.getTotalCost(),
                sessionDuration: performanceLogger.getSessionDuration(),
                tokenStats: performanceLogger.getTokenStats()
              },
              performanceMetrics: analyzePerformanceMetrics(allLogs),
              taskFlows: analyzeTaskFlows(allLogs),
              errorAnalysis: analyzeErrorPatterns(allLogs),
              summary: {
                totalOrchestrationEvents: orchestrationLogs.length,
                taskSelections: orchestrationLogs.filter(log => log.orchestrationEvent === 'TASK_SELECTION').length,
                adaptations: orchestrationLogs.filter(log => log.orchestrationEvent === 'TASK_ADAPTATION').length,
                generations: orchestrationLogs.filter(log => log.orchestrationEvent === 'TASK_GENERATION').length,
                strategyChanges: orchestrationLogs.filter(log => log.orchestrationEvent === 'STRATEGY_CHANGE').length
              }
            };

            // Save to localStorage
            const saved = saveAnalyticsToLocalStorage(analyticsData);
            
            if (saved) {
              // Update state with latest analytics
              const allAnalytics = loadAnalyticsFromLocalStorage();
              set({ 
                persistentOrchestrationAnalytics: allAnalytics,
                currentWorkflowSessionId: null, // Reset session
                workflowStartTime: null
              });
              
              // Clear performance logger for next session
              performanceLogger.clear();
              
              console.log('✅ Successfully saved orchestration analytics with performance data for session:', currentWorkflowSessionId);
              return true;
            }
            
            return false;
          } catch (error) {
            console.error('Failed to save persistent analytics:', error);
            return false;
          }
        },

        loadPersistentAnalyticsAction: () => {
          try {
            const analytics = loadAnalyticsFromLocalStorage();
            set({ persistentOrchestrationAnalytics: analytics });
            console.log(`📊 Loaded ${analytics.length} analytics sessions from storage`);
            return analytics;
          } catch (error) {
            console.error('Failed to load persistent analytics:', error);
            return [];
          }
        },

        getAnalyticsStatsAction: () => {
          return getAnalyticsStorageStats();
        },

        // Performance Logger Integration Actions
        logTaskStatusChangeAction: (taskId, newStatus, oldStatus, taskTitle, agentName) => {
          logTaskChange(taskId, newStatus, oldStatus, taskTitle, agentName);
        },

        logAgentThinkingStartAction: (agentName, taskId, agentId) => {
          return logAgentStart(agentName, taskId, agentId);
        },

        logAgentThinkingEndAction: (operationId, llmStats) => {
          return logAgentComplete(operationId, llmStats);
        },

        logOrchestrationSelectionAction: (selectedTasks, aiReasoning, confidence) => {
          logAISelection(selectedTasks, aiReasoning, confidence);
        },

        logOrchestrationAdaptationAction: (taskId, originalTask, adaptedTask, reason) => {
          logAIAdaptation(taskId, originalTask, adaptedTask, reason);
        },

        logOrchestrationEventAction: (eventType, metadata = {}) => {
          performanceLogger.logOrchestrationEvent(eventType, metadata);
        },

        getPerformanceStatsAction: () => {
          return {
            logs: performanceLogger.getLogs(),
            tokenStats: performanceLogger.getTokenStats(),
            totalCost: performanceLogger.getTotalCost(),
            sessionDuration: performanceLogger.getSessionDuration()
          };
        },

        setTaskDetailsDialogOpenAction: isTaskDetailsDialogOpen =>
          set({ isTaskDetailsDialogOpen }),
        setSelectedTaskAction: selectedTask => {
          set({ selectedTask, isTaskDetailsDialogOpen: true });
        },

        initDbAction: () => {
          const firebaseConfig = {
            apiKey: findSingleEnvValue('FIREBASE_API_KEY'),
            authDomain: findSingleEnvValue('FIREBASE_AUTH_DOMAIN'),
            projectId: findSingleEnvValue('FIREBASE_PROJECT_ID'),
            storageBucket: findSingleEnvValue('FIREBASE_STORAGE_BUCKET'),
            messagingSenderId: findSingleEnvValue(
              'FIREBASE_MESSAGING_SENDER_ID'
            ),
            appId: findSingleEnvValue('FIREBASE_APP_ID'),
            measurementId: findSingleEnvValue('FIREBASE_MEASUREMENT_ID'),
          };

          const initFirebase = () => {
            if (!getApps().length) {
              return initializeApp(firebaseConfig);
            } else {
              return getApp();
            }
          };

          const app = initFirebase();
          const db = getFirestore(app);
          set({ db });
        },
        setShareDialogOpenAction: isShareDialogOpen =>
          set({ isShareDialogOpen }),
        setShareUrlDialogOpenAction: isShareUrlDialogOpen =>
          set({ isShareUrlDialogOpen }),
        shareTeamAction: async userName => {
          set({ isLoadingShare: true });

          const { keys, db, code } = get();

          try {
            const encryptedKeys = await encryptKeys(keys);
            // console.log('Encrypted keys:', encryptedKeys);

            const docRef = await addDoc(collection(db, 'share'), {
              code: code,
              keys: encryptedKeys,
              user: { name: userName },
            });
            // console.log("Document written with ID: ", docRef.id);

            const url = `${window.location.origin}/share/${docRef.id}`;
            await navigator.clipboard.writeText(url);

            // Primero cerramos el diálogo de compartir
            set({
              isLoadingShare: false,
              isShareDialogOpen: false,
            });

            // Luego, después de un breve retraso, abrimos el diálogo de URL
            setTimeout(() => {
              set({
                shareUrl: url,
                isShareUrlDialogOpen: true,
              });
            }, 300); // Pequeño retraso para asegurar que el primer diálogo se cierre completamente

            toast.success(
              'Your team has been shared! URL copied to clipboard.'
            );
          } catch (error) {
            set({ isLoadingShare: false, isShareDialogOpen: false });
            toast.error('Failed to process encryption or document creation.');
            console.error(
              'Failed to process encryption or document creation:',
              error
            );
          }
        },
        simpleShareAction: async () => {
          try {
            const url = window.location.href;
            await navigator.clipboard.writeText(url);

            toast.success(
              `The URL is copied! Just paste it to share your team.`
            );
          } catch (error) {
            toast.error('Failed to share the team.');
          }
        },

        setMissingKeysDialogOpenAction: isMissingKeysDialogOpen => {
          // DEBUG: Track when and why MissingKeysDialog is being opened
          if (isMissingKeysDialogOpen) {
            console.log('🚨 DEBUG: MissingKeysDialog opening requested', {
              timestamp: new Date().toISOString(),
              stack: new Error().stack
            });
            // Close other dialogs when opening MissingKeysDialog to prevent conflicts
            set({ 
              isMissingKeysDialogOpen: true,
              isOrchestrationProgressOpen: false,
              isExecutionDialogOpen: false,
              isUseCaseDialogOpen: false
            });
          } else {
            console.log('✅ DEBUG: MissingKeysDialog closing');
            set({ isMissingKeysDialogOpen: false });
          }
        },

        
        // Use Case Dialog actions
        openUseCaseDialogAction: (mode) => set({ 
          isUseCaseDialogOpen: true, 
          useCaseDialogMode: mode
        }),
        closeUseCaseDialogAction: () => set({ 
          isUseCaseDialogOpen: false,
          generatedUseCase: null
        }),
        setGeneratedUseCaseAction: (useCase) => set({ generatedUseCase: useCase }),
        applyGeneratedUseCaseAction: (codeString) => {
          const { setCodeAction } = get();
          setCodeAction(codeString);
          set({ 
            isUseCaseDialogOpen: false,
            generatedUseCase: null
          });
        },
        applyGeneratedTeamObjectsAction: (teamObjects) => {
          const { setTeamStoreAction } = get();
          
          if (teamObjects.success && teamObjects.team) {
            // Apply the generated team object directly
            const teamStore = teamObjects.team.useStore(teamObjects.team);
            if (teamStore) {
              setTeamStoreAction(teamStore);
              set({
                code: teamObjects.code,
                selectedTab: 0,
                errorState: { hasError: false, error: null },
                isUseCaseDialogOpen: false,
                generatedUseCase: null
              });
            } else {
              // Fallback to code-based approach
              const { setCodeAction } = get();
              setCodeAction(teamObjects.code);
              set({ 
                isUseCaseDialogOpen: false,
                generatedUseCase: null
              });
            }
          } else {
            // Error case - fallback to code
            const { setCodeAction } = get();
            setCodeAction(teamObjects.code);
            set({ 
              isUseCaseDialogOpen: false,
              generatedUseCase: null,
              errorState: { hasError: true, error: teamObjects.error || 'Failed to create team objects' }
            });
          }
        },

        setUiSettingsAction: newSettings =>
          set(state => ({
            uiSettings: { ...state.uiSettings, ...newSettings },
          })),
        toggleMaximizeAction: () => {
          set(state => {
            const isMaximized = !state.uiSettings.maximizeConfig.isActive;
            const scrollPosition = isMaximized
              ? window.scrollY
              : state.uiSettings.maximizeConfig.scrollPosition;

            return {
              uiSettings: {
                ...state.uiSettings,
                isMaximized,
                maximizeConfig: {
                  isActive: isMaximized,
                  scrollPosition,
                },
              },
            };
          });

          const { uiSettings } = get();

          if (uiSettings.maximizeConfig.isActive) {
            document.body.classList.add('overflow-hidden');
            window.scrollTo(0, 0);
            setTimeout(() => {
              document.querySelector('header').classList.add('hidden');
            }, 100);
          } else {
            document.body.classList.remove('overflow-hidden');
            window.scrollTo(0, uiSettings.maximizeConfig.scrollPosition);
            document.querySelector('header').classList.remove('hidden');
          }
        },

        initDefaultEnvVarsAction: () => {
          const { keys, defaultEnvVars } = get();

          if (Array.isArray(defaultEnvVars) && defaultEnvVars.length > 0) {
            // Create a Set of existing keys for O(1) lookup
            const existingKeySet = new Set(keys.map(k => k.key));

            // Filter and process new environment variables
            const envVars = findEnvValues(defaultEnvVars || []).filter(
              envVar => !existingKeySet.has(envVar.key)
            );

            // Only update if we have new keys to add
            if (envVars.length > 0) {
              set({ keys: [...keys, ...envVars] });
            }
          }
        },

        setKeysAction: keys => {
          set({ keys });
          // Save to LocalStorage for persistence
          saveKeysToLocalStorage(keys);
          // Re-compile team with updated keys
          const { code, setCodeAction } = get();
          if (code) {
            console.log('🔑 DEBUG: Keys updated - retrying team creation');
            setCodeAction(code);
          }
        },
        setSettingsDialogOpenAction: isOpenSettingsDialog =>
          set({ isOpenSettingsDialog }),

        setProjectAction: project => set({ project }),
        checkAndSetProject: () => {
          const { project, code, setProjectAction } = get();

          if (project.name === 'Untitled Project') {
            const name = extractTeamName(code);
            if (name) {
              setProjectAction({ ...project, name });
            }
          }
          if (project.user.name === 'Anonymous') {
            setProjectAction({
              ...project,
              user: { name: 'AI Champions Team' },
            });
          }
        },

        setExampleCodeAction: exampleCode => {
          const { setCodeAction, initDefaultEnvVarsAction, keys: existingKeys } = get();

          const team = exampleCode();
          const code = team.code;
          const teamKeys = findEnvValues(team.keys || []);
          const user = team.user;
          const name = extractTeamName(code);

          // Merge keys: preserve existing manually set keys, add only missing keys from team
          const existingKeysMap = new Map(existingKeys.map(k => [k.key, k.value]));
          const mergedKeys = [...existingKeys];

          teamKeys.forEach(teamKey => {
            if (!existingKeysMap.has(teamKey.key)) {
              // Only add key if it doesn't exist
              mergedKeys.push(teamKey);
            }
            // Don't overwrite existing keys - preserve user-set values
          });

          const project = {
            name: name || 'Untitled Project',
            user: { name: user || 'Anonymous' },
          };
          set({ keys: mergedKeys, project });

          initDefaultEnvVarsAction();

          setCodeAction(code);
        },

        setTeamAction: team => {
          const { setTeamStoreAction } = get();
          
          // Handle both KaibanJS team objects and plain data objects
          if (team && team.store && team.store.getState) {
            // This is a KaibanJS team with a store
            setTeamStoreAction(team.store);
            const project = {
              name: team.store.getState().name || 'Untitled Project',
              user: { name: 'Anonymous' },
            };
            set({ project, selectedTab: 0 });
          } else if (team && team.isExternal) {
            // This is an external data object from Web Component
            console.log('🎯 Setting external team data:', team);
            // Create a reactive store that references the external data
            const createReactiveStore = () => {
              const store = (selector) => {
                if (typeof selector === 'function') {
                  return selector(team);
                }
                return team;
              };
              
              // Add store methods for compatibility
              store.getState = () => team;
              store.subscribe = (callback) => {
                // Subscribe to external data changes if available
                if (team.subscribe) {
                  return team.subscribe(callback);
                }
                return () => {};
              };
              store.setState = (updates) => {
                // Update external data if method available
                if (team.updateData) {
                  team.updateData(updates);
                }
              };
              
              return store;
            };
            
            const reactiveStore = createReactiveStore();
            setTeamStoreAction(reactiveStore);
            
            const project = {
              name: team.name || 'Untitled Project',
              user: { name: 'Anonymous' },
            };
            set({ project, selectedTab: 0 });
            console.log('✅ External team store set successfully');
          } else if (team && team.name) {
            // This is a plain team data object (e.g., from Web Component)
            // Create a mock store that works like a Zustand store
            const mockState = {
              name: team.name,
              agents: (team.agents || []).map(agent => {
                const llmConfig = agent.llmConfig || {
                  provider: 'openai',
                  model: 'gpt-4'
                };
                return {
                  ...agent,
                  id: agent.id || Math.random().toString(36).substr(2, 9),
                  name: agent.name || 'Unnamed Agent',
                  role: agent.role || 'Agent',
                  goal: agent.goal || '',
                  backstory: agent.backstory || '',
                  llmConfig: llmConfig,
                  tools: agent.tools || [],
                  maxIterations: agent.maxIterations || 5,
                  allowDelegation: agent.allowDelegation !== undefined ? agent.allowDelegation : true,
                  // Add agentInstance for UI compatibility
                  agentInstance: {
                    llmConfig: llmConfig,
                    provider: llmConfig.provider,
                    model: llmConfig.model
                  }
                };
              }),
              tasks: (team.tasks || []).map(task => ({
                ...task,
                id: task.id || Math.random().toString(36).substr(2, 9),
                name: task.name || task.description || 'Unnamed Task',
                status: task.status || 'todo',
                agent: task.agent || null
              })),
              teamWorkflowStatus: team.teamWorkflowStatus || 'INITIAL',
              workflowLogs: team.workflowLogs || [],
              inputs: team.inputs || {},  // Add inputs object
              setInputs: (newInputs) => {
                mockState.inputs = newInputs;
                console.log('Mock: Inputs updated', newInputs);
              },
              backlogTasks: team.backlogTasks || [],  // Add backlogTasks
              startWorkflow: () => console.log('Mock: Start workflow'),
              pauseWorkflow: () => console.log('Mock: Pause workflow'),
              resumeWorkflow: () => console.log('Mock: Resume workflow'),
              stopWorkflow: () => console.log('Mock: Stop workflow'),
            };
            
            // Create a Zustand-like store function
            const mockStore = (selector) => {
              if (typeof selector === 'function') {
                return selector(mockState);
              }
              return mockState;
            };
            
            // Add store methods for compatibility
            mockStore.getState = () => mockState;
            mockStore.subscribe = () => () => {}; // Return unsubscribe function
            mockStore.setState = () => {};
            
            setTeamStoreAction(mockStore);
            const project = {
              name: team.name || 'Untitled Project',
              user: { name: 'Anonymous' },
            };
            set({ project, selectedTab: 0 });
          }
        },

        initAction: () => {
          const {
            code,
            setCodeAction,
            initDbAction,
            checkAndSetProject,
            teams,
            exampleTeams,
            setTeamAction,
            uiSettings,
            setTabAction,
            initDefaultEnvVarsAction,
            setExampleCodeAction,
            keys: existingKeys,
            loadPersistentAnalyticsAction,
          } = get();

          // CRITICAL: Force reset all dialog states IMMEDIATELY on initialization
          // This prevents any dialogs from appearing during app startup
          console.log('🚀 DEBUG: initAction called - Resetting all dialog states to prevent startup dialogs');
          set({
            isMissingKeysDialogOpen: false, // NEVER open on startup
            isExecutionDialogOpen: false,
            isCelebrationDialogOpen: false,
            isOrchestrationProgressOpen: false, // Also reset orchestration dialog
            isTaskDetailsDialogOpen: false,
            isShareDialogOpen: false,
            isShareUrlDialogOpen: false,
            isOpenSettingsDialog: false,
            isUseCaseDialogOpen: false,
          });

          // Load API keys from LocalStorage
          const storedKeys = loadKeysFromLocalStorage();
          if (storedKeys.length > 0) {
            // Merge stored keys with existing keys (stored keys have priority)
            const mergedKeys = [...existingKeys];
            storedKeys.forEach(storedKey => {
              const existingIndex = mergedKeys.findIndex(k => k.key === storedKey.key);
              if (existingIndex >= 0) {
                // Update existing key with stored value
                mergedKeys[existingIndex] = storedKey;
              } else {
                // Add new key
                mergedKeys.push(storedKey);
              }
            });
            set({ keys: mergedKeys });
          }

          // Load persistent orchestration analytics
          loadPersistentAnalyticsAction();

          if (teams.length === 0 && !exampleTeams.length) {
            let initialCode = code;

            if (!code) {
              const team = resumeCreationOpenai();
              const teamKeys = findEnvValues(team.keys || []);
              const user = team.user;
              const project = {
                name: 'Untitled Project',
                user: { name: user || 'Anonymous' },
              };
              initialCode = team.code;
              
              // Merge keys: preserve existing keys, add only missing keys
              const existingKeysMap = new Map(existingKeys.map(k => [k.key, k.value]));
              const mergedKeys = [...existingKeys];

              teamKeys.forEach(teamKey => {
                if (!existingKeysMap.has(teamKey.key)) {
                  mergedKeys.push(teamKey);
                }
              });

              set({ keys: mergedKeys, project });
            }

            console.log('🚀 DEBUG: initAction calling setCodeAction with initial code');
            setCodeAction(initialCode);
            initDbAction();
            checkAndSetProject();

            if (uiSettings.selectedTab !== undefined && uiSettings.selectedTab !== null) {
              setTimeout(() => {
                setTabAction(uiSettings.selectedTab);
              });
            }
          } else if (exampleTeams.length) {
            const team = exampleTeams[0];
            setExampleCodeAction(team);
          } else {
            const team = teams[0];
            setTeamAction(team);
          }
          
          // Check if we're in web component mode with external data
          const { externalDataStore, isWebComponent } = initialState || {};
          if (isWebComponent && externalDataStore) {
            console.log('🚀 Web Component mode detected, setting external data store:', externalDataStore);
            setTeamAction(externalDataStore);
            
            // Set the selected tab from UI settings for viewer mode
            if (uiSettings.selectedTab !== undefined && uiSettings.selectedTab !== null) {
              console.log('📑 Setting selected tab for viewer mode:', uiSettings.selectedTab);
              setTabAction(uiSettings.selectedTab);
            }
          }

          initDefaultEnvVarsAction();
        },
      }))
    )
  );
};

export { createAgentsPlaygroundStore };
