import React from 'react';
const Tooltip = ({ text, styles="kb-left-4" }) => {
    return (
        <div className={`kb-absolute ${styles} kb-z-20 kb-w-max kb-items-center kb-hidden kb-ml-6 group-hover:kb-flex`}>
            <div className="kb-w-2 kb-h-2 -kb-mr-1 kb-rotate-45 kb-bg-slate-950"></div>
            <span className="kb-relative kb-p-2 kb-text-xs kb-leading-none kb-text-slate-400 kb-whitespace-no-wrap kb-bg-slate-950 kb-rounded-md">{text}</span>
        </div>
    );
};

export default Tooltip;