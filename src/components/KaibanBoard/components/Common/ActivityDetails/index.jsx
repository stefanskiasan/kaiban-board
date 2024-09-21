
import React, { useEffect, useRef, useState, useCallback } from 'react';

const ActivityDetails = ({ details, styles="max-w-[428px]" }) => {

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
        <div className={`bg-slate-800 rounded-lg px-3 py-2 ring-1 ring-slate-900 relative ${styles}`}>
            <div className={`break-words overflow-hidden ${isOverflowing && !isExpanded ? 'max-h-14' : ''}`}>
                <span ref={textRef} className="text-xs font-normal text-white block leading-normal">
                    {details}
                </span>
            </div>
            {isOverflowing && (
                <div className="relative">
                    {!isExpanded && (<div className="absolute left-0 -top-14 w-full h-14 bg-gradient-to-t from-slate-800 to-transparent"></div>)}
                    <button type="button" className="relative mt-1.5 flex items-center gap-0.5 text-slate-400 text-xs font-semibold hover:text-slate-200 focus:outline-none transition-colors duration-200 w-auto"
                        onClick={() => setIsExpanded(!isExpanded)}>
                        <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActivityDetails;
