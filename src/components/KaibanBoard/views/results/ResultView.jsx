import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@headlessui/react';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { ClipboardIcon, SparklesIcon as SparklesOutlineIcon } from '@heroicons/react/24/outline';
import { copyToClipboard } from '../../utils/helper';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';

const ResultView = () => {
    const useAgentsPlaygroundStore = usePlaygroundStore();
    const {
        teamStore,
    } = useAgentsPlaygroundStore(
        (state) => ({
            teamStore: state.teamStore,
        })
    );

    const {
        workflowResult
    } = teamStore(state => ({
        workflowResult: state.workflowResult,
    }));

    return (
        <>
            <div className="flex flex-row">
                <div className="px-6 mt-3 pb-3 flex items-center gap-1.5">
                    <SparklesOutlineIcon className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">Results Overview</span>
                </div>
                <div className="flex-grow border border-slate-700 border-r-0 border-t-0 bg-slate-950">
                    <div className="flex items-center gap-4 h-full pr-3.5">
                        {workflowResult && (
                            <Button className="ml-auto inline-flex items-center gap-2 rounded-lg bg-slate-900  py-1.5 px-3 text-slate-400 text-sm focus:outline-none data-[hover]:bg-indigo-500/15 data-[hover]:text-indigo-500 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                                onClick={()=>{copyToClipboard(typeof workflowResult === 'string' ? workflowResult : JSON.stringify(workflowResult))}}>
                                <ClipboardIcon className="w-5 h-5" />
                                Copy
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-4 px-6">
                {workflowResult && (
                    <div className="p-4" style={{ background: "#0C1117" }}>
                        <div data-color-mode="dark">
                            <MDEditor.Markdown source={typeof workflowResult === 'string' ? workflowResult : JSON.stringify(workflowResult)} />
                        </div>
                    </div>
                )}
                {!workflowResult && (
                    <div className="flex flex-col items-center justify-center gap-2 h-[calc(100vh-250px)]">
                        <SparklesIcon className="w-9 h-9 text-indigo-300" />
                        <div className="flex flex-col items-center">
                            <span className="text-base font-semibold text-slate-200">No Results Yet</span>
                            <span className="text-sm font-normal text-slate-400 max-w-md text-center">The workflow has not been executed or no results are available. Please run the workflow to see results.</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ResultView;