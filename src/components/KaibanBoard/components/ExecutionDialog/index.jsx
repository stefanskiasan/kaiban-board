import React from 'react';
const ExecutionDialog = () => {
    return (
        <div className="absolute w-full h-full inset-0 bg-slate-950/50">
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl">
                    <h3 className="text-base/7 font-medium text-white">
                        Preparing Your AI Team
                    </h3>
                    <p className="mt-2 text-sm/6 text-slate-400">
                        Setting up your agents, tasks, and tools, preparing your
                    </p>
                    <div className="flex gap-1">
                        <p className="text-sm/6 text-slate-400">
                            team for action.
                        </p>
                        <div className="animate-bounce relative inset-1">🚀</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExecutionDialog;