import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChatBubbleLeftEllipsisIcon, PaperAirplaneIcon, XMarkIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon, StopIcon, UserPlusIcon, ClipboardDocumentCheckIcon, UserGroupIcon, MagnifyingGlassCircleIcon, GlobeAmericasIcon, NewspaperIcon, EllipsisHorizontalCircleIcon, AcademicCapIcon, HomeModernIcon, HeartIcon } from '@heroicons/react/24/outline';
import { Button, Textarea } from '@headlessui/react';
import { KaibanJSIcon } from '../../assets/icons';
import rehypeRaw from 'rehype-raw';

const API_URL = 'http://localhost:3000/api/chat';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [threadId, setThreadId] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isWriting, setIsWriting] = useState(false);
    const isWritingRef = useRef(false);
    const [currentRun, setCurrentRun] = useState(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const [showExpandedSuggestions, setShowExpandedSuggestions] = useState(false);

    const initialSuggestions = [
        {
            text: "Create Research & Analysis Team",
            icon: MagnifyingGlassCircleIcon,
            iconColor: "kb-text-emerald-400"
        },
        {
            text: "Create Travel Planning Team",
            icon: GlobeAmericasIcon,
            iconColor: "kb-text-sky-400"
        },
        {
            text: "Create Content Creation Team",
            icon: NewspaperIcon,
            iconColor: "kb-text-violet-400"
        }
    ];

    const expandedSuggestions = [
        {
            text: "How to create a team?",
            icon: UserGroupIcon,
            iconColor: "kb-text-pink-400"
        },
        {
            text: "How to create a task?",
            icon: ClipboardDocumentCheckIcon,
            iconColor: "kb-text-orange-400"
        },
        {
            text: "How to create an agent?",
            icon: UserPlusIcon,
            iconColor: "kb-text-yellow-400"
        }
    ];

    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: isWritingRef.current ? 'auto' : 'smooth'
        });
    }, [messages]);

    useEffect(() => {
        isWritingRef.current = isWriting;
    }, [isWriting]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    useEffect(() => {
        if (isOpen && !threadId) {
            createThread();
        }

        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: 'auto',
                block: 'end'
            });
        }
    }, [isOpen]);

    const createThread = async () => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'createThread' })
            });
            const thread = await response.json();
            setThreadId(thread.id);
        } catch (error) {
            console.error('Error al crear el thread:', error);
        }
    };

    const handleSendMessage = async () => {
        if (input.trim() === '' || !threadId) return;

        setMessages([...messages, { role: 'user', content: input }]);
        setInput('');
        setIsLoading(true);

        try {
            const runResponse = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'sendMessage',
                    threadId,
                    message: input
                })
            });
            const run = await runResponse.json();
            setCurrentRun(run);

            let accumulatedContent = '';

            while (true) {
                const statusResponse = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'getRunStatus',
                        threadId,
                        runId: run.id
                    })
                });
                const runStatus = await statusResponse.json();

                if (runStatus.status === 'completed') {
                    setIsWriting(true);
                    const messagesResponse = await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'getMessages',
                            threadId
                        })
                    });
                    const messagesData = await messagesResponse.json();
                    const latestMessage = messagesData.data[0];
                    if (latestMessage.role === 'assistant') {
                        setMessages(prevMessages => {
                            const newMessages = [...prevMessages, {
                                role: 'assistant',
                                content: ''
                            }];
                            return newMessages;
                        });

                        const fullContent = latestMessage.content[0].text.value;
                        if (fullContent !== accumulatedContent) {
                            const newContent = fullContent.slice(accumulatedContent.length).split(/(\s+)/);
                            for (let word of newContent) {
                                accumulatedContent += word;

                                setMessages(prevMessages => {
                                    const newMessages = [...prevMessages];
                                    newMessages[newMessages.length - 1] = {
                                        role: 'assistant',
                                        content: accumulatedContent + '<span class="kb-ml-2 kb-inline-block kb-w-2 kb-h-2 kb-bg-slate-400 kb-rounded-full kb-animate-ping"></span>'
                                    };
                                    return newMessages;
                                });

                                if (!isWritingRef.current) break;
                                await new Promise(resolve => setTimeout(resolve, 50));
                            }
                        }

                        setMessages(prevMessages => {
                            const newMessages = [...prevMessages];
                            newMessages[newMessages.length - 1] = {
                                role: 'assistant',
                                content: accumulatedContent
                            };
                            return newMessages;
                        });

                        setIsWriting(false);
                    }
                    break;
                }

                if (runStatus.status === 'cancelled') {
                    break;
                }

                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.error('Error in handleSendMessage: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStopGeneration = async () => {
        if (currentRun && threadId) {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'cancelRun',
                        threadId,
                        runId: currentRun.id
                    })
                });

                setIsWriting(false);
                setIsLoading(false);
                setCurrentRun(null);
            } catch (error) {
                console.error('Error in handleStopGeneration: ', error);
            }
        }
    };

    const toggleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    return (
        <div className="kb-fixed kb-z-50 kb-bottom-4 kb-right-4">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="kb-bg-indigo-500 kb-text-white kb-rounded-full kb-p-4 kb-shadow-lg kb-transition-all kb-duration-300 focus:kb-outline-none focus:kb-ring-2 focus:kb-ring-offset-2 focus:kb-ring-indigo-400 hover:kb-bg-indigo-600 hover:kb-shadow-xl hover:kb-scale-110"
                >
                    <ChatBubbleLeftEllipsisIcon className="kb-h-6 kb-w-6" />
                </button>
            )}
            {isOpen && (
                <div
                    className={`kb-bg-slate-900 kb-ring-1 kb-ring-slate-950 kb-rounded-2xl kb-shadow-2xl kb-flex kb-flex-col kb-overflow-hidden kb-transition-all kb-duration-300 kb-ease-in-out`}
                    style={{
                        position: 'fixed',
                        bottom: '1rem',
                        right: '1rem',
                        width: isMaximized ? 'calc(100% - 2rem)' : '24rem',
                        height: isMaximized ? 'calc(100% - 2rem)' : '32rem',
                        transformOrigin: 'bottom right',
                    }}
                >
                    <div className="kb-bg-indigo-500 kb-p-4 kb-flex kb-justify-between kb-items-center kb-border-b kb-border-slate-900">
                        <div className="kb-flex kb-items-center kb-gap-1 kb-text-white">
                            <KaibanJSIcon />
                            <h3 className="kb-font-bold kb-text-lg kb-text-white">aiban</h3>
                        </div>
                        <div className="kb-flex kb-items-center kb-space-x-2">
                            <Button onClick={toggleMaximize} className="kb-text-white data-[hover]:kb-text-indigo-200 data-[focus]:kb-outline-none">
                                {isMaximized ? <ArrowsPointingInIcon className="kb-h-5 kb-w-5" /> : <ArrowsPointingOutIcon className="kb-h-5 kb-w-5" />}
                            </Button>
                            <Button onClick={() => setIsOpen(false)} className="kb-text-white data-[hover]:kb-text-indigo-200 data-[focus]:kb-outline-none">
                                <XMarkIcon className="kb-h-5 kb-w-5" />
                            </Button>
                        </div>
                    </div>
                    <div className="kb-flex-1 kb-overflow-y-auto kb-p-4 kb-space-y-4">
                        {messages.length === 0 ? (
                            <div className="kb-flex kb-flex-col kb-items-center kb-justify-center kb-h-full kb-space-y-4">
                                <h3 className="kb-text-slate-200 kb-text-xl kb-font-medium">
                                    What can I help with?
                                </h3>
                                <div className="kb-flex kb-flex-wrap kb-gap-2 kb-justify-center">
                                    {initialSuggestions.map((suggestion, index) => {
                                        const IconComponent = suggestion.icon;
                                        return (
                                            <Button
                                                key={index}
                                                onClick={() => handleSuggestionClick(suggestion.text)}
                                                className="kb-bg-slate-700 kb-text-slate-200 kb-px-4 kb-py-2 kb-rounded-full kb-text-sm data-[hover]:kb-bg-slate-600 kb-transition-colors kb-flex kb-items-center kb-gap-2"
                                            >
                                                <IconComponent className={`kb-h-4 kb-w-4 ${suggestion.iconColor}`} />
                                                {suggestion.text}
                                            </Button>
                                        );
                                    })}
                                    {!showExpandedSuggestions && (
                                        <Button
                                            className="kb-bg-slate-700 kb-text-slate-200 kb-px-4 kb-py-2 kb-rounded-full kb-text-sm data-[hover]:kb-bg-slate-600 kb-transition-colors kb-flex kb-items-center kb-gap-2"
                                            onClick={() => setShowExpandedSuggestions(true)}>
                                            <EllipsisHorizontalCircleIcon className="kb-h-4 kb-w-4 kb-text-slate-200" />
                                            More
                                        </Button>
                                    )}
                                    {showExpandedSuggestions && expandedSuggestions.map((suggestion, index) => {
                                        const IconComponent = suggestion.icon;
                                        return (
                                            <Button
                                                className="kb-bg-slate-700 kb-text-slate-200 kb-px-4 kb-py-2 kb-rounded-full kb-text-sm data-[hover]:kb-bg-slate-600 kb-transition-colors kb-flex kb-items-center kb-gap-2"
                                                key={index} onClick={() => handleSuggestionClick(suggestion.text)}>
                                                <IconComponent className={`kb-h-4 kb-w-4 ${suggestion.iconColor}`} />
                                                {suggestion.text}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`kb-flex ${message.role === 'user' ? 'kb-justify-end' : 'kb-justify-start'}`}
                                >
                                    <div
                                        className={`kb-max-w-[80%] kb-p-3 kb-rounded-2xl ${message.role === 'user'
                                            ? 'kb-bg-indigo-600 kb-text-white'
                                            : 'kb-bg-slate-700 kb-text-slate-200'
                                            }`}
                                    >
                                        <ReactMarkdown
                                            className="kb-text-sm kb-markdown-content"
                                            rehypePlugins={[rehypeRaw]}
                                            components={{
                                                code({ node, inline, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '')
                                                    return !inline && match ? (
                                                        <SyntaxHighlighter
                                                            {...props}
                                                            style={atomDark}
                                                            language={match[1]}
                                                            PreTag="div"
                                                        >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                                                    ) : (
                                                        <code {...props} className={className}>
                                                            {children}
                                                        </code>
                                                    )
                                                }
                                            }}
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && !isWriting && (
                            <span className="kb-inline-block kb-w-3 kb-h-3 kb-bg-slate-700 kb-rounded-full kb-animate-ping" />
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="kb-border-t kb-border-slate-700 kb-p-4 kb-bg-slate-800">
                        <div className="kb-flex kb-items-end kb-gap-2">
                            <Textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                                placeholder="Enter your message..."
                                className="kb-flex-1 kb-bg-white/5 kb-text-white kb-py-1.5 kb-px-3 kb-text-sm/6 kb-border kb-border-slate-800 kb-rounded-lg kb-p-2 focus:kb-outline-none focus:kb-ring-2 focus:kb-ring-white/25 focus:kb-border-transparent kb-resize-none kb-overflow-hidden kb-min-h-[40px] kb-max-h-[120px]"
                                style={{ height: '40px' }}
                                disabled={isLoading}
                            />
                            <Button
                                onClick={() => {
                                    if (isLoading) {
                                        handleStopGeneration();
                                    } else {
                                        handleSendMessage();
                                    }
                                }}
                                className="kb-bg-indigo-500 kb-text-white kb-p-2 kb-rounded-lg data-[hover]:kb-bg-indigo-600 kb-transition-colors kb-duration-300 data-[focus]:kb-outline-none data-[focus]:kb-ring-2 data-[focus]:kb-ring-offset-2 data-[focus]:kb-ring-white data-[disabled]:kb-opacity-50"
                                disabled={!input.trim() && !isLoading}
                            >
                                {isLoading ? (
                                    <StopIcon className="kb-h-5 kb-w-5" />
                                ) : (
                                    <PaperAirplaneIcon className="kb-h-5 kb-w-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
