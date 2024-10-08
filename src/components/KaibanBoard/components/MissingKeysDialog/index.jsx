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
        <div className="kb-absolute kb-w-full kb-h-full kb-inset-0 kb-bg-slate-950/50">
            <div className="kb-flex kb-min-h-full kb-items-center kb-justify-center kb-p-4">
                <div ref={containerRef} className="kb-z-40 kb-w-full kb-max-w-md kb-rounded-xl kb-bg-white/5 kb-p-6 kb-backdrop-blur-2xl">
                    <div className="kb-flex kb-items-center">
                        <h3 className="kb-text-base/7 kb-font-medium kb-text-white">
                            Missing Keys
                        </h3>
                        <Button className="kb-ml-auto kb-text-slate-400 focus:kb-outline-none data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
                            onClick={() => setMissingKeysDialogOpenAction(false)}
                        >
                            <XMarkIcon className="kb-w-5 kb-h-5" />
                        </Button>
                    </div>
                    <p className="kb-mt-2 kb-text-sm/6 kb-text-slate-400">
                        Please configure the environment variables in the .env file by setting the keys listed below.
                    </p>
                    <div className="kb-mt-4">
                        <div className="kb-flex kb-flex-col kb-gap-2 kb-mb-2">
                            {keys.map((key, idx) => (
                                <div key={idx} className="kb-flex kb-items-stretch kb-gap-3 kb-relative kb-bg-white/5 kb-p-3 kb-rounded-lg kb-ring-1 kb-ring-slate-900">
                                    <div className="kb-max-w-1 kb-flex-grow kb-rounded-full kb-bg-red-500/75"></div>
                                    <div key={idx} className="kb-flex kb-flex-col kb-gap-2">
                                        <div className="kb-flex kb-gap-1">
                                            <span className="kb-text-xs kb-font-medium kb-text-slate-200">{`Key:`}</span>
                                            <span className="kb-text-xs kb-font-normal kb-text-slate-400">{key.key}</span>
                                        </div>
                                        <div className="kb-flex kb-flex-col">
                                            <div className="kb-w-[360px] kb-relative kb-bg-slate-900 kb-rounded-lg kb-shadow-lg">
                                                <div className="kb-relative kb-p-3">
                                                    <pre className="kb-text-xs kb-leading-6 kb-text-slate-400 kb-flex kb-flex-col kb-gap-1 kb-overflow-auto">
                                                        <code className="kb-flex-none kb-min-w-full">
                                                            <span className="kb-flex">
                                                                <span className="kb-text-lime-300">{`VITE_${key.key}`}</span>
                                                                <span className="kb-text-fuchsia-300">{`=`}</span>
                                                                <span className="kb-text-yellow-400">{`your-api-key-value`}</span>
                                                            </span>
                                                        </code>
                                                    </pre>

                                                    <div className="kb-absolute kb-top-2 kb-right-2 kb-h-8 kb-flex kb-items-center">
                                                        <div className="kb-relative kb-flex">
                                                            <button type="button" className="kb-text-slate-400 hover:kb-text-slate-200"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(`VITE_${key.key}=your-api-key-value`);
                                                                }}>
                                                                <ClipboardIcon className="kb-w-[18px] kb-h-[18px]" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="kb-text-xs kb-font-normal kb-text-slate-400" dangerouslySetInnerHTML={{ __html: key.get }}></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="kb-mt-6 kb-flex kb-gap-2 kb-items-center">
                        <Button
                            className="kb-ml-auto kb-min-w-20 kb-inline-flex kb-items-center kb-justify-center kb-gap-2 kb-rounded-md kb-bg-indigo-500 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-white focus:kb-outline-none data-[hover]:kb-bg-indigo-600 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white data-[disabled]:kb-bg-indigo-500/15"
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