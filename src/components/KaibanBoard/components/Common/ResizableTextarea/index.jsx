import React, { useEffect, useRef, useState } from 'react';
import { Textarea } from '@headlessui/react';

const ResizableTextarea = ({ value, onChange, onFocus, placeholder, name, keepExpandedOnBlur = false }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const textareaRef = useRef(null);

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

    const autoResize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        if (isExpanded) {
            autoResize();
        } else {
            textareaRef.current.style.height = '36px';
        }
    }, [value, isExpanded]);

    return (
        <Textarea
            ref={textareaRef}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="kb-block kb-w-full kb-min-h-9 kb-resize-none kb-rounded-lg kb-border-none kb-bg-white/5 kb-py-1.5 kb-px-3 kb-text-sm/6 kb-text-white focus:kb-outline-none focus:kb-ring-2 focus:kb-ring-white/25 kb-transition-height kb-duration-300 focus:kb-transition-none"
        />
    );
}

export default ResizableTextarea;