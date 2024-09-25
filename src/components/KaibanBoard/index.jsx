import React, { useEffect } from 'react';
import AgentsEditor from './components/AgentsEditor';
import PlaygroundLayout from './views/layout/PlaygroundLayout';
import ExamplesMenu from './components/ExamplesMenu';
import { PlaygroundProvider, usePlaygroundStore } from './store/PlaygroundProvider';
import './styles/index.css';

const filterUndefinedProps = (obj) => {
    const filteredProps = {};
    Object.keys(obj).forEach(key => {
        if (obj[key] !== undefined) {
            filteredProps[key] = obj[key];
        }
    });
    return filteredProps;
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

const KaibanBoard = ({ uiSettings, code, keys, project }) => {
    const initialState = filterUndefinedProps({ uiSettings, code, keys, project });

    return (
        <PlaygroundProvider initialState={initialState}>
            <KaibanBoardWrapper />
        </PlaygroundProvider>
    );
}

export default KaibanBoard;