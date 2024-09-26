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
    }, [workflowLogs]);

    return (
        <div className={`flex flex-col gap-3 p-4 ring-1 ring-slate-950 rounded-lg bg-slate-800 w-full ${showOptions ? "hover:ring-indigo-500 cursor-pointer" : ""}`}
            onClick={() => { if (showOptions) setSelectedTaskAction(task); }}>
            <p className="text-sm text-white line-clamp-2">
                {task.description}
            </p>
            <div className="flex gap-2 items-center flex-wrap">
                {showOptions && (
                    <div className="relative group flex items-center">
                        <Button className="text-slate-400 focus:outline-none data-[hover]:text-indigo-500 data-[focus]:outline-1 data-[focus]:outline-white">
                            <Bars3BottomLeftIcon className="w-5 h-5" />
                        </Button>
                        <Tooltip text="View details" styles="left-0" />
                    </div>
                )}
                {showOptions && isAwaiting && (
                    <div className="flex items-center bg-indigo-500/15 py-1 px-2 rounded-full">
                        <span className="text-xs text-indigo-500 font-medium">Awaiting Validation</span>
                    </div>
                )}
                <div className="ml-auto">
                    <AgentAvatar agent={task.agent} size="lg" />
                </div>
            </div>
        </div>
    );
};

export default TaskCard;