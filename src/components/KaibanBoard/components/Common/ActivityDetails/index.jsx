
import React, { useEffect, useRef, useState, useCallback } from 'react';

const ActivityDetails = ({ details, styles="kb-max-w-[428px]" }) => {

    const [isExpanded, setIsExpanded] = useState(false);
    const textRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const checkOverflow = useCallback(() => {
        if (textRef.current) {
            const isContentOverflowing = textRef.current.clientHeight > 54;
            setIsOverflowing(isContentOverflowing);
        }
    }, [textRef]);

    useEffect(() => {
        checkOverflow();

        window.addEventListener('resize', checkOverflow);
        return () => {
            window.removeEventListener('resize', checkOverflow);
        };
    }, [details, checkOverflow]);

    return (
        <div className={`kb-bg-slate-800 kb-rounded-lg kb-px-3 kb-py-2 kb-ring-1 kb-ring-slate-900 kb-relative ${styles}`}>
            <div className={`kb-break-words kb-overflow-hidden ${isOverflowing && !isExpanded ? 'kb-max-h-14' : ''}`}>
                <span ref={textRef} className="kb-text-xs kb-font-normal kb-text-white kb-block kb-leading-normal">
                    {details}
                </span>
            </div>
            {isOverflowing && (
                <div className="kb-relative">
                    {!isExpanded && (<div className="kb-absolute kb-left-0 -kb-top-14 kb-w-full kb-h-14 kb-bg-gradient-to-t kb-from-slate-800 kb-to-transparent"></div>)}
                    <button type="button" className="kb-relative kb-mt-1.5 kb-flex kb-items-center kb-gap-0.5 kb-text-slate-400 kb-text-xs kb-font-semibold hover:kb-text-slate-200 focus:kb-outline-none kb-transition-colors kb-duration-200 kb-w-auto"
                        onClick={() => setIsExpanded(!isExpanded)}>
                        <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActivityDetails;
