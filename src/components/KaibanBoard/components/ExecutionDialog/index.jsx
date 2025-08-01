import React from 'react';
const ExecutionDialog = () => {
  return (
    <div className="kb-absolute kb-w-full kb-h-full kb-inset-0 kb-bg-slate-900/50">
      <div className="kb-flex kb-min-h-full kb-items-center kb-justify-center kb-p-4">
        <div className="kb-w-full kb-max-w-md kb-rounded-xl kb-bg-white/5 kb-p-6 kb-backdrop-blur-2xl">
          <h3 className="kb-text-base/7 kb-font-medium kb-text-white">
            Preparing Your AI Team
          </h3>
          <p className="kb-mt-2 kb-text-sm/6 kb-text-slate-400">
            Setting up your agents, tasks, and tools, preparing your
          </p>
          <div className="kb-flex kb-gap-1">
            <p className="kb-text-sm/6 kb-text-slate-400">team for action.</p>
            <div className="kb-animate-bounce kb-relative kb-inset-1">🚀</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionDialog;
