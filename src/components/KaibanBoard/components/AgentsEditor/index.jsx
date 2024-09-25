import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import CustomTheme from './themes/nightowl.json';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';

const AgentsEditor = () => {
    const useAgentsPlaygroundStore = usePlaygroundStore();
    const {
        code,
        setCodeAction
    } = useAgentsPlaygroundStore(
        (state) => ({
            code: state.code,
            setCodeAction: state.setCodeAction
        })
    );

    const [editorValue, setEditorValue] = useState(code);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (editorValue !== code)
                setCodeAction(editorValue);
        }, 500);

        return () => clearTimeout(timer);
            /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [editorValue]);

    const handleEditorDidMount = async (monaco) => {
        monaco.editor.defineTheme('CustomTheme', {
            base: 'vs-dark',
            inherit: true,
            ...CustomTheme
        });
    };

    return (
        <Editor
            defaultLanguage="javascript"
            value={code}
            onChange={setEditorValue}
            options={{
                fontSize: 14,
                fontFamily: 'Jetbrains-Mono',
                fontLigatures: true,
                wordWrap: 'on',
                minimap: {
                    enabled: false
                },
                bracketPairColorization: {
                    enabled: true
                },
                cursorBlinking: 'expand',
                formatOnPaste: true,
                suggest: {
                    showFields: false,
                    showFunctions: false
                }
            }}
            beforeMount={handleEditorDidMount}
            theme="CustomTheme"
        />
    );
};

export default AgentsEditor;