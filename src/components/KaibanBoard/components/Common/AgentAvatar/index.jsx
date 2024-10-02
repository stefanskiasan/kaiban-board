import React from 'react';

const AgentAvatar = ({ agent, size, showBorder = true }) => {
    const avatarUrl = `https://robohash.org/${agent?.name}`;

    return (
        <div className={`rounded-full ${showBorder ? "ring-2 ring-slate-700 bg-slate-800" : ""}`}>
            <img className={`rounded-full bg-slate-950/50 ${size === "xl" ? "w-11 h-11" : size === "lg" ? "w-9 h-9" : size === "md" ? "w-8 h-8" : "w-[26px] h-[26px]"}`}
                src={avatarUrl} alt="agent" />
        </div>
    );
};

export default AgentAvatar;