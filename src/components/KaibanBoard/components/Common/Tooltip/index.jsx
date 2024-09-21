const Tooltip = ({ text, styles="left-4" }) => {
    return (
        <div className={`absolute ${styles} z-20 w-max flex items-center hidden ml-6 group-hover:flex`}>
            <div className="w-2 h-2 -mr-1 rotate-45 bg-slate-950"></div>
            <span className="relative p-2 text-xs leading-none text-slate-400 whitespace-no-wrap bg-slate-950 rounded-md">{text}</span>
        </div>
    );
};

export default Tooltip;