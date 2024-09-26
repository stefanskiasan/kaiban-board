import React, { useEffect } from 'react';
import AgentsEditor from './components/AgentsEditor';
import PlaygroundLayout from './views/layout/PlaygroundLayout';
import ExamplesMenu from './components/ExamplesMenu';
import { PlaygroundProvider, usePlaygroundStore } from './store/PlaygroundProvider';
import './styles/index.css';

const defaultUiSettings = {
    showFullScreen: true,
    showExampleMenu: true,
    showShareOption: true,
    showSettingsOption: true,
    maximizeConfig: {
        isActive: false,
        scrollPosition: 0
    },
    isPreviewMode: false,
    showSimpleShareOption: false,
};

const filterUndefinedProps = (obj) => {
    const filteredProps = {};
    Object.keys(obj).forEach(key => {
        if (obj[key] !== undefined) {
            filteredProps[key] = obj[key];
        }
    });
    return filteredProps;
};

const mergeUiSettings = (uiSettings) => {
    return { ...defaultUiSettings, ...uiSettings };
};

const KaibanBoardWrapper = () => {
    const useKaibanBoardStore = usePlaygroundStore();
    const {
        teamStore,
        initAction
    } = useKaibanBoardStore(
        (state) => ({
            teamStore: state.teamStore,
            initAction: state.initAction
        })
    );

    useEffect(() => {
        initAction();
    }, [initAction]);

    return (
        <>
            {teamStore && <PlaygroundLayout
                editorComponent={<AgentsEditor />}
                examplesMenu={<ExamplesMenu />}
            />}
        </>
    );
};

const KaibanBoard = ({ uiSettings, code, keys, project, teams }) => {
    const mergedUiSettings = mergeUiSettings(uiSettings);
    const initialState = filterUndefinedProps({ uiSettings: mergedUiSettings, code, keys, project, teams });

    return (
        <PlaygroundProvider initialState={initialState}>
            <KaibanBoardWrapper />
        </PlaygroundProvider>
    );
}

export default KaibanBoard;