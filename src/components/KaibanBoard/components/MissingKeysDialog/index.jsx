import React from 'react';
import { Button } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import { ClipboardIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import { checkApiKeys } from '../../utils/helper';

const MissingKeysDialog = () => {
    const useAgentsPlaygroundStore = usePlaygroundStore();
    const {
        teamStore,
        setMissingKeysDialogOpenAction
    } = useAgentsPlaygroundStore(
        (state) => ({
            teamStore: state.teamStore,
            setMissingKeysDialogOpenAction: state.setMissingKeysDialogOpenAction
        })
    );

    const containerRef = useRef();
    // INFO: Close dialog when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setMissingKeysDialogOpenAction(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    const [keys, setKeys] = useState([]);
    useEffect(() => {
        const missingKeys = checkApiKeys(teamStore);
        setKeys(missingKeys);
    }, []);


    return (
        <div className="absolute w-full h-full inset-0 bg-slate-950/50">
            <div className="flex min-h-full items-center justify-center p-4">
                <div ref={containerRef} className="z-40 w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl">
                    <div className="flex items-center">
                        <h3 className="text-base/7 font-medium text-white">
                            Missing Keys
                        </h3>
                        <Button className="ml-auto text-slate-400 focus:outline-none data-[hover]:text-indigo-500 data-[focus]:outline-1 data-[focus]:outline-white"
                            onClick={() => setMissingKeysDialogOpenAction(false)}
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </Button>
                    </div>
                    <p className="mt-2 text-sm/6 text-slate-400">
                        Please configure the environment variables in the .env file by setting the keys listed below.
                    </p>
                    <div className="mt-4">
                        <div className="flex flex-col gap-2 mb-2">
                            {keys.map((key, idx) => (
                                <div key={idx} className="flex items-stretch gap-3 relative bg-white/5 p-3 rounded-lg ring-1 ring-slate-900">
                                    <div className="max-w-1 flex-grow rounded-full bg-red-500/75"></div>
                                    <div key={idx} className="flex flex-col gap-2">
                                        <div className="flex gap-1">
                                            <span className="text-xs font-medium text-slate-200">{`Key:`}</span>
                                            <span className="text-xs font-normal text-slate-400">{key.key}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-slate-200">{`How to add it:`}</span>
                                            <span className="text-xs font-normal text-slate-400">{`In your project's .env file on the root of the project:`}</span>
                                            <div className="w-[360px] relative mt-2 bg-slate-900 rounded-xl shadow-lg">
                                                <div className="relative flex text-slate-400 text-xs leading-6">
                                                    <div className="mt-2 flex-none text-sky-300 border-t border-b border-t-transparent border-b-sky-300 px-4 py-1 flex items-center">
                                                        .env
                                                    </div>
                                                    <div className="flex-auto flex pt-2 rounded-tr-xl overflow-hidden">
                                                        <div className="flex-auto -mr-px bg-slate-800 border border-slate-700 rounded-tl">
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-2 right-0 h-8 flex items-center pr-4">
                                                        <div className="relative flex -mr-2">
                                                            <button type="button" className="text-slate-400 hover:text-slate-200"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(`${key.line}`);
                                                                }}>
                                                                <ClipboardIcon className="w-[18px] h-[18px]" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="relative px-5 py-3">
                                                    <pre className="text-xs leading-6 text-slate-400 flex flex-col gap-1 overflow-auto">
                                                        <code className="flex-none min-w-full">
                                                            <span className="flex">
                                                                <svg viewBox="0 -9 3 24" aria-hidden="true" className="flex-none overflow-visible text-pink-400 w-auto h-6 mr-3">
                                                                    <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                </svg>
                                                                <span className="flex-auto">
                                                                    {key.line}
                                                                </span>
                                                            </span>
                                                        </code>
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-slate-200">{`Where to get the key:`}</span>
                                            <span className="text-xs font-normal text-slate-400" dangerouslySetInnerHTML={{ __html: key.get }}></span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6 flex gap-2 items-center">
                        <Button
                            className="ml-auto min-w-20 inline-flex items-center justify-center gap-2 rounded-md bg-indigo-500 py-1.5 px-3 text-sm font-medium text-white focus:outline-none data-[hover]:bg-indigo-600 data-[focus]:outline-1 data-[focus]:outline-white data-[disabled]:bg-indigo-500/15"
                            onClick={() => {
                                setMissingKeysDialogOpenAction(false);
                            }}
                        >
                            Ok
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MissingKeysDialog;