import React from 'react';
import { Button } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
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
                                <div key={idx} className="flex items-stretch gap-3 relative bg-white/5 p-3 rounded-lg">
                                    <div className="w-2 flex-grow rounded-full bg-red-500/75"></div>
                                    <div className="flex flex-col gap-[2px]">
                                        <p className="leading-[normal]">
                                            <span className="text-xs font-medium text-slate-200">{`Name: `}</span>
                                            <span className="text-xs font-normal text-slate-400">{key.name}</span>
                                        </p>
                                        <p className="leading-[normal]">
                                            <span className="text-xs font-medium text-slate-200">{`Where to put it: `}</span>
                                            <span className="text-xs font-normal text-slate-400">{key.projectLocation}</span>
                                        </p>
                                        <p className="leading-[normal]">
                                            <span className="text-xs font-medium text-slate-200">{`Get the value here: `}</span>
                                            <span className="text-xs font-normal text-slate-400">{key.valueLocation}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6 flex gap-2 items-center">
                        <Button
                            className="ml-auto min-w-20 inline-flex items-center justify-center gap-2 rounded-md bg-indigo-500 py-1.5 px-3 text-sm font-medium text-white focus:outline-none data-[hover]:bg-indigo-600 data-[focus]:outline-1 data-[focus]:outline-white data-[disabled]:bg-indigo-500/15"
                            onClick={() => {
                                setMissingKeysDialogOpenAction(true);
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