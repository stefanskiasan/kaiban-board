/* eslint-disable react/prop-types */
import React from 'react';

const AgentAvatar = ({ agent, size, showBorder = true }) => {
    const avatarUrl = `https://robohash.org/${agent?.name}`;

    return (
        <div className={`kb-rounded-full ${showBorder ? "kb-ring-2 kb-ring-slate-700 kb-bg-slate-800" : ""}`}>
            <img className={`kb-rounded-full kb-bg-slate-950/50 ${size === "xl" ? "kb-w-11 kb-h-11" : size === "lg" ? "kb-w-9 kb-h-9" : size === "md" ? "kb-w-8 kb-h-8" : "kb-w-[26px] kb-h-[26px]"}`}
                src={avatarUrl} alt="agent" />
        </div>
    );
};

export default AgentAvatar;