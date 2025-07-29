import React from 'react';
import { Button } from '@headlessui/react';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';

const CelebrationDialog = () => {
  const useAgentsPlaygroundStore = usePlaygroundStore();
  const { setTabAction, setCelebrationDialogOpenAction } =
    useAgentsPlaygroundStore(state => ({
      setTabAction: state.setTabAction,
      setCelebrationDialogOpenAction: state.setCelebrationDialogOpenAction,
    }));

  return (
    <div className="kb-absolute kb-w-full kb-h-full kb-inset-0 kb-bg-slate-950/50">
      <div className="kb-flex kb-min-h-full kb-items-center kb-justify-center kb-p-4">
        <div className="kb-z-40 kb-w-full kb-max-w-md kb-rounded-xl kb-bg-white/5 kb-p-6 kb-backdrop-blur-2xl">
          <h3 className="kb-text-base/7 kb-font-medium kb-text-white">
            Mission Accomplished
          </h3>
          <p className="kb-mt-2 kb-text-sm/6 kb-text-slate-400">
            Great job! Your team has successfully completed
          </p>
          <p className="kb-text-sm/6 kb-text-slate-400">the work. 🥳</p>
          <div className="kb-mt-4">
            <Button
              className="kb-inline-flex kb-items-center kb-gap-2 kb-rounded-md kb-bg-indigo-500 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-white focus:kb-outline-none data-[hover]:kb-bg-indigo-600 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
              onClick={() => {
                setCelebrationDialogOpenAction(false);
                // Removed automatic navigation to Results - stay on current tab (Kanban Board)
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CelebrationDialog;
