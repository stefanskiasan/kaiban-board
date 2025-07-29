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

        selectedTask: null,
        isTaskDetailsDialogOpen: false,

        db: null,
        isShareDialogOpen: false,
        isLoadingShare: false,
        isShareUrlDialogOpen: false,
        shareUrl: '',

        isMissingKeysDialogOpen: false,

        isChatBotOpen: false,
        
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
          isChatbotFloating: false,
        },

        defaultEnvVars: [],

        keys: [],
        isOpenSettingsDialog: false,
        isChatBotSettingsDialogOpen: false,

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
                  valueToEvaluate =
                    valueToEvaluate +
                    '\n' +
                    teamNames.map(name => `return ${name};`).join('\n');
                } else {
                  // If no explicit team variable found, try to find the last team assignment
                  valueToEvaluate += '\nreturn team;';
                }

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

                // Wrap the code in an IIFE to create proper scope
                const wrappedCode = `
                  (function() {
                    ${valueToEvaluate}
                  })();
                `;

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
                  `return (${wrappedCode})`
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

        setChatBotOpenAction: isChatBotOpen => set({ isChatBotOpen }),
        
        // Use Case Dialog actions
        openUseCaseDialogAction: (mode) => set({ 
          isUseCaseDialogOpen: true, 
          useCaseDialogMode: mode,
          isChatBotOpen: false // Close regular chatbot when opening dialog
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
        setChatBotSettingsDialogOpenAction: isChatBotSettingsDialogOpen =>
          set({ isChatBotSettingsDialogOpen }),

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
          setTeamStoreAction(team.store);

          const project = {
            name: team.store.getState().name || 'Untitled Project',
            user: { name: 'Anonymous' },
          };
          set({ project, selectedTab: 0 });
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
            isChatBotSettingsDialogOpen: false,
            isUseCaseDialogOpen: false,
            isChatBotOpen: false,
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

            if (uiSettings.selectedTab !== 0) {
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

          initDefaultEnvVarsAction();
        },
      }))
    )
  );
};

export { createAgentsPlaygroundStore };
