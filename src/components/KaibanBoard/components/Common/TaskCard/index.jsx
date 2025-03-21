/* eslint-disable react/prop-types */
import React from 'react';
import { Button } from "@headlessui/react";
import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import AgentAvatar from "../AgentAvatar";
import Tooltip from "../Tooltip";
import { usePlaygroundStore } from "../../../store/PlaygroundProvider";
import { useEffect, useState } from "react";
import { isAwaitingValidation } from "../../../utils/helper";

const TaskCard = ({ task, showOptions = true }) => {
    const useAgentsPlaygroundStore = usePlaygroundStore();
    const [isAwaiting, setIsAwaiting] = useState(false);

    const { teamStore, setSelectedTaskAction } = useAgentsPlaygroundStore(state => ({
        teamStore: state.teamStore,
        setSelectedTaskAction: state.setSelectedTaskAction,
    }));

    const {
        workflowLogs,
    } = teamStore(state => ({
        workflowLogs: state.workflowLogs
    }));

    useEffect(() => {
        // console.log('workflowLogs--useEffect', workflowLogs);
        const awaiting = isAwaitingValidation(workflowLogs, task.id);
        if (awaiting !== isAwaiting) {
            setIsAwaiting(awaiting);
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [workflowLogs]);

    return (
        <div className={`kb-flex kb-flex-col kb-gap-3 kb-p-4 kb-ring-1 kb-ring-slate-950 kb-rounded-lg kb-bg-slate-800 kb-w-full ${showOptions ? "hover:kb-ring-indigo-500 kb-cursor-pointer" : ""}`}
            onClick={() => { if (showOptions) setSelectedTaskAction(task); }}>
            <p className="kb-text-sm kb-text-white kb-line-clamp-2">
                {task.description}
            </p>
            <div className="kb-flex kb-gap-2 kb-items-center kb-flex-wrap">
                {showOptions && (
                    <div className="kb-relative kb-group kb-flex kb-items-center">
                        <Button className="kb-text-slate-400 focus:kb-outline-none data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white">
                            <Bars3BottomLeftIcon className="kb-w-5 kb-h-5" />
                        </Button>
                        <Tooltip text="View details" styles="kb-left-0" />
                    </div>
                )}
                {showOptions && isAwaiting && (
                    <div className="kb-flex kb-items-center kb-bg-indigo-500/15 kb-py-1 kb-px-2 kb-rounded-full">
                        <span className="kb-text-xs kb-text-indigo-500 kb-font-medium">Awaiting Validation</span>
                    </div>
                )}
                <div className="kb-ml-auto">
                    <AgentAvatar agent={task.agent} size="lg" />
                </div>
            </div>
        </div>
    );
};

export default TaskCard;