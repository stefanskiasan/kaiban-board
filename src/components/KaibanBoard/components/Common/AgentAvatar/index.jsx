const AgentAvatar = ({ agent, size }) => {
    const avatarUrl = `https://robohash.org/${agent?.name}`;

    return (
        <div className="bg-slate-950/50 rounded-full">
            <img className={`rounded-full ${size === "xl" ? "w-11 h-11" : size === "lg" ? "w-9 h-9" : size === "md" ? "w-8 h-8" : "w-7 h-7"}`}
                src={avatarUrl} alt="agent"/>
        </div>
    );
};

export default AgentAvatar;