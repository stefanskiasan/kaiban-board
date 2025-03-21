/* eslint-disable react/prop-types */
import React from 'react';
import AgentAvatar from "../AgentAvatar";
import ModelLogo from "../ModelLogo";

const AgentCard = ({ agent }) => {

    return (
        <div className="kb-bg-slate-800 kb-rounded-lg kb-p-4 kb-ring-1 kb-ring-slate-950 kb-flex kb-items-center kb-gap-4">
            <AgentAvatar agent={agent} size="xl" />
            <div className="kb-flex kb-flex-col">
                <span className="kb-text-sm kb-text-white">
                    {agent.name}
                </span>
                <span className="kb-mb-1 kb-text-xs kb-font-normal kb-text-slate-400">{agent?.role}</span>
                <ModelLogo model={agent.agentInstance.llmConfig.provider || "openai"} />
            </div>
        </div>
    );
};

export default AgentCard;