import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChatBubbleLeftEllipsisIcon, PaperAirplaneIcon, XMarkIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon, StopIcon } from '@heroicons/react/24/outline';
import OpenAI from 'openai';

// Nota: La API key debe manejarse de forma segura, preferiblemente en el backend
const openai = new OpenAI({
    apiKey: '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',
    dangerouslyAllowBrowser: true // Esto es para desarrollo, no se recomienda en producción
});

const ASSISTANT_ID = 'asst_WlH10QG53sJsRVxn82KN92kK';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [threadId, setThreadId] = useState(null);
    const [currentRun, setCurrentRun] = useState(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
    }, [isOpen]);

    const createThread = async () => {
        try {
            const thread = await openai.beta.threads.create();
            setThreadId(thread.id);
        } catch (error) {
            console.error('Error al crear el thread:', error);
        }
    };

    const handleSendMessage = async () => {
        if (input.trim() === '' || !threadId) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            await openai.beta.threads.messages.create(threadId, {
                role: 'user',
                content: input
            });

            const run = await openai.beta.threads.runs.create(threadId, {
                assistant_id: ASSISTANT_ID
            });
            setCurrentRun(run);

            setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: '', isStreaming: true }]);

            while (true) {
                const runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
                if (runStatus.status === 'completed') {
                    const messages = await openai.beta.threads.messages.list(threadId);
                    const lastAssistantMessage = messages.data
                        .filter(message => message.role === 'assistant')
                        .slice(-1)[0];

                    const fullContent = lastAssistantMessage.content[0].text.value;
                    setMessages((prevMessages) => {
                        const newMessages = [...prevMessages];
                        newMessages[newMessages.length - 1] = {
                            role: 'assistant',
                            content: fullContent,
                            isStreaming: false
                        };
                        return newMessages;
                    });
                    break;
                } else if (runStatus.status === 'failed') {
                    throw new Error('La ejecución del asistente falló');
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.error('Error al obtener respuesta del asistente:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: 'assistant', content: 'Lo siento, ocurrió un error al procesar tu mensaje.', isStreaming: false },
            ]);
        } finally {
            setIsLoading(false);
            setCurrentRun(null);
        }
    };

    const handleStopGeneration = async () => {
        if (currentRun && threadId) {
            try {
                await openai.beta.threads.runs.cancel(threadId, currentRun.id);
                setIsLoading(false);
                setCurrentRun(null);
                setMessages((prevMessages) => {
                    const newMessages = [...prevMessages];
                    newMessages[newMessages.length - 1] = {
                        ...newMessages[newMessages.length - 1],
                        content: newMessages[newMessages.length - 1].content + ' [Generación detenida]',
                        isStreaming: false
                    };
                    return newMessages;
                });
            } catch (error) {
                console.error('Error al detener la generación:', error);
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
                    className="kb-bg-indigo-600 kb-text-white kb-rounded-full kb-p-4 kb-shadow-lg kb-transition-all kb-duration-300 focus:kb-outline-none focus:kb-ring-2 focus:kb-ring-offset-2 focus:kb-ring-indigo-500 hover:kb-bg-indigo-700 hover:kb-shadow-xl hover:kb-scale-110"
                >
                    <ChatBubbleLeftEllipsisIcon className="kb-h-6 kb-w-6" />
                </button>
            )}
            {isOpen && (
                <div 
                    className={`kb-bg-gray-900 kb-text-white kb-rounded-2xl kb-shadow-2xl kb-flex kb-flex-col kb-overflow-hidden kb-transition-all kb-duration-300 kb-ease-in-out`}
                    style={{
                        position: 'fixed',
                        bottom: '1rem',
                        right: '1rem',
                        width: isMaximized ? 'calc(100% - 2rem)' : '24rem',
                        height: isMaximized ? 'calc(100% - 2rem)' : '32rem',
                        transformOrigin: 'bottom right',
                    }}
                >
                    <div className="kb-bg-indigo-800 kb-text-white kb-p-4 kb-flex kb-justify-between kb-items-center kb-shadow-md">
                        <h3 className="kb-font-bold kb-text-lg">Asistente AI</h3>
                        <div className="kb-flex kb-items-center kb-space-x-2">
                            <button onClick={toggleMaximize} className="kb-text-white hover:kb-text-indigo-200 focus:kb-outline-none">
                                {isMaximized ? <ArrowsPointingInIcon className="kb-h-5 kb-w-5" /> : <ArrowsPointingOutIcon className="kb-h-5 kb-w-5" />}
                            </button>
                            <button onClick={() => setIsOpen(false)} className="kb-text-white hover:kb-text-indigo-200 focus:kb-outline-none">
                                <XMarkIcon className="kb-h-5 kb-w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="kb-flex-1 kb-overflow-y-auto kb-p-4 kb-space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`kb-flex ${message.role === 'user' ? 'kb-justify-end' : 'kb-justify-start'}`}
                            >
                                <div
                                    className={`kb-max-w-[80%] kb-p-3 kb-rounded-2xl ${
                                        message.role === 'user'
                                            ? 'kb-bg-indigo-600 kb-text-white'
                                            : 'kb-bg-gray-700 kb-text-gray-200'
                                    }`}
                                >
                                    <ReactMarkdown
                                        className="kb-text-sm kb-markdown-content"
                                        components={{
                                            code({node, inline, className, children, ...props}) {
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
                                    {message.isStreaming && (
                                        <span className="kb-inline-block kb-animate-pulse kb-text-xs">▋</span>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="kb-border-t kb-border-gray-700 kb-p-4 kb-bg-gray-800">
                        <div className="kb-flex kb-items-end kb-space-x-2">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                                placeholder="Escribe un mensaje..."
                                className="kb-flex-1 kb-bg-gray-700 kb-text-white kb-border kb-border-gray-600 kb-rounded-lg kb-p-2 focus:kb-outline-none focus:kb-ring-2 focus:kb-ring-indigo-500 focus:kb-border-transparent kb-resize-none kb-overflow-hidden kb-min-h-[40px] kb-max-h-[120px]"
                                style={{ height: '40px' }}
                                disabled={isLoading}
                            />
                            <button
                                onClick={isLoading ? handleStopGeneration : handleSendMessage}
                                className="kb-bg-indigo-600 kb-text-white kb-p-2 kb-rounded-lg hover:kb-bg-indigo-700 kb-transition-colors kb-duration-300 focus:kb-outline-none focus:kb-ring-2 focus:kb-ring-offset-2 focus:kb-ring-indigo-500 disabled:kb-opacity-50"
                                disabled={!input.trim() && !isLoading}
                            >
                                {isLoading ? (
                                    <StopIcon className="kb-h-5 kb-w-5" />
                                ) : (
                                    <PaperAirplaneIcon className="kb-h-5 kb-w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
