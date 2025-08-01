/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import AgentsEditor from './components/AgentsEditor';
import PlaygroundLayout from './views/layout/PlaygroundLayout';
import {
  PlaygroundProvider,
  usePlaygroundStore,
} from './store/PlaygroundProvider';
import './index.css';

const defaultUiSettings = {
  showFullScreen: true,
  showExampleMenu: false,
  showShareOption: false,
  showSettingsOption: false,
  showExampleTeams: false,
  maximizeConfig: {
    isActive: false,
    scrollPosition: 0,
  },
  isPreviewMode: true,
  showSimpleShareOption: true,
  showWelcomeInfo: true,
  selectedTab: 0,
};

const filterUndefinedProps = obj => {
  const filteredProps = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      filteredProps[key] = obj[key];
    }
  });
  return filteredProps;
};

const mergeUiSettings = uiSettings => {
  return { ...defaultUiSettings, ...uiSettings };
};

const KaibanBoardWrapper = ({ isWebComponent, externalDataStore }) => {
  const useKaibanBoardStore = usePlaygroundStore();
  const { teamStore, initAction, setTeamAction } = useKaibanBoardStore(state => ({
    teamStore: state.teamStore,
    initAction: state.initAction,
    setTeamAction: state.setTeamAction,
  }));

  useEffect(() => {
    console.log('🔷 KaibanBoardWrapper: Calling initAction, isWebComponent:', isWebComponent, 'externalDataStore:', externalDataStore);
    initAction();
  }, [initAction]);

  useEffect(() => {
    if (isWebComponent && externalDataStore) {
      // Listen for Web Component events
      const handleTeamDataUpdate = (event) => {
        if (event.detail && event.detail.externalData) {
          setTeamAction(event.detail.externalData);
        }
      };

      const handleTaskStatusUpdate = (event) => {
        if (event.detail && event.detail.externalData) {
          setTeamAction(event.detail.externalData);
        }
      };

      const handleWorkflowLogAdd = (event) => {
        if (event.detail && event.detail.externalData) {
          setTeamAction(event.detail.externalData);
        }
      };

      const handleWorkflowStatusUpdate = (event) => {
        if (event.detail && event.detail.externalData) {
          setTeamAction(event.detail.externalData);
        }
      };

      const handleAgentStatusUpdate = (event) => {
        if (event.detail && event.detail.externalData) {
          setTeamAction(event.detail.externalData);
        }
      };

      const handleBatchUpdate = (event) => {
        if (event.detail && event.detail.externalData) {
          setTeamAction(event.detail.externalData);
        }
      };

      // Add event listeners to the parent element (Web Component)
      const parentElement = document.querySelector('kaiban-board');
      if (parentElement) {
        parentElement.addEventListener('team-data-update', handleTeamDataUpdate);
        parentElement.addEventListener('task-status-update', handleTaskStatusUpdate);
        parentElement.addEventListener('workflow-log-add', handleWorkflowLogAdd);
        parentElement.addEventListener('workflow-status-update', handleWorkflowStatusUpdate);
        parentElement.addEventListener('agent-status-update', handleAgentStatusUpdate);
        parentElement.addEventListener('batch-update', handleBatchUpdate);

        // Cleanup
        return () => {
          parentElement.removeEventListener('team-data-update', handleTeamDataUpdate);
          parentElement.removeEventListener('task-status-update', handleTaskStatusUpdate);
          parentElement.removeEventListener('workflow-log-add', handleWorkflowLogAdd);
          parentElement.removeEventListener('workflow-status-update', handleWorkflowStatusUpdate);
          parentElement.removeEventListener('agent-status-update', handleAgentStatusUpdate);
          parentElement.removeEventListener('batch-update', handleBatchUpdate);
        };
      }
    }
  }, [isWebComponent, externalDataStore, setTeamAction]);

  console.log('🔶 KaibanBoardWrapper render: teamStore exists?', !!teamStore);
  
  return (
    <>
      {teamStore && (
        <PlaygroundLayout
          editorComponent={<AgentsEditor />}
        />
      )}
    </>
  );
};

const KaibanBoard = ({
  uiSettings,
  code,
  keys,
  project,
  teams,
  defaultEnvVars,
  exampleTeams,
  isWebComponent,
  externalDataStore,
}) => {
  const mergedUiSettings = mergeUiSettings(uiSettings);
  const initialState = filterUndefinedProps({
    uiSettings: mergedUiSettings,
    code,
    keys,
    project,
    teams,
    defaultEnvVars,
    exampleTeams,
    isWebComponent,
    externalDataStore,
  });

  return (
    <PlaygroundProvider initialState={initialState}>
      <KaibanBoardWrapper 
        isWebComponent={isWebComponent} 
        externalDataStore={externalDataStore} 
      />
    </PlaygroundProvider>
  );
};

export default KaibanBoard;
