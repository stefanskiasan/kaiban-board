import React, { useState } from 'react';
import { Textarea } from '@headlessui/react';

const ResizableTextarea = ({ value, onChange, onFocus, placeholder, name, keepExpandedOnBlur = false }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleFocus = () => {
        setIsExpanded(true);
        if (onFocus) onFocus();
    };

    const handleBlur = () => {
        if (keepExpandedOnBlur && value && value.trim() !== '') {
            return;
        } else {
            setIsExpanded(false);
        }
    };

    return (
        <div className="kb-relative kb-min-h-[60px] kb-bg-white/5 kb-rounded-lg">
            <Textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`kb-block kb-w-full kb-resize-none kb-rounded-lg kb-border-none kb-bg-transparent kb-py-1.5 kb-px-3 kb-text-sm/6 kb-text-white focus:kb-outline-none focus:kb-ring-2 focus:kb-ring-white/25 ${isExpanded ? 'kb-h-28' : 'kb-h-12'} kb-transition-all kb-duration-300`}
            />
        </div>
    );
}

export default ResizableTextarea;
