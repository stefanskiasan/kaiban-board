import React from 'react';
import AgentAvatar from "../AgentAvatar";
import ModelLogo from "../ModelLogo";
const AgentCard = ({ agent }) => {

    return (
        <div className="bg-slate-800 rounded-lg p-4 ring-1 ring-slate-950 flex items-center gap-4">
            <AgentAvatar agent={agent} size="xl" />
            <div className="flex flex-col">
                <span className="text-sm text-white">
                    {agent.name}
                </span>
                <span className="mb-1 text-xs font-normal text-slate-400">{agent?.role}</span>
                <ModelLogo model={agent.agentInstance.llmConfig.provider || "openai"} />
            </div>
        </div>
    );
};

export default AgentCard;