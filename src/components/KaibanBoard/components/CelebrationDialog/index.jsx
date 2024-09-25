import React from 'react';
import { Button } from '@headlessui/react';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';

const CelebrationDialog = () => {
    const useAgentsPlaygroundStore = usePlaygroundStore();
    const {
        setTabAction,
        setCelebrationDialogOpenAction
    } = useAgentsPlaygroundStore(
        (state) => ({
            setTabAction: state.setTabAction,
            setCelebrationDialogOpenAction: state.setCelebrationDialogOpenAction
        })
    );

    return (
        <div className="absolute w-full h-full inset-0 bg-slate-950/50">
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="z-40 w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl">
                    <h3 className="text-base/7 font-medium text-white">
                        Mission Accomplished
                    </h3>
                    <p className="mt-2 text-sm/6 text-slate-400">
                        Great job! Your team has successfully completed
                    </p>
                    <p className="text-sm/6 text-slate-400">
                        the work. 🥳
                    </p>
                    <div className="mt-4">
                        <Button
                            className="inline-flex items-center gap-2 rounded-md bg-indigo-500 py-1.5 px-3 text-sm font-medium text-white focus:outline-none data-[hover]:bg-indigo-600 data-[focus]:outline-1 data-[focus]:outline-white"
                            onClick={() => {
                                setCelebrationDialogOpenAction(false);
                                setTabAction(2);
                            }}
                        >
                            See Results
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CelebrationDialog;