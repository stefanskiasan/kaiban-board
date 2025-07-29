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

const KaibanBoardWrapper = () => {
  const useKaibanBoardStore = usePlaygroundStore();
  const { teamStore, initAction } = useKaibanBoardStore(state => ({
    teamStore: state.teamStore,
    initAction: state.initAction,
  }));

  useEffect(() => {
    initAction();
  }, [initAction]);

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
  });

  return (
    <PlaygroundProvider initialState={initialState}>
      <KaibanBoardWrapper />
    </PlaygroundProvider>
  );
};

export default KaibanBoard;
