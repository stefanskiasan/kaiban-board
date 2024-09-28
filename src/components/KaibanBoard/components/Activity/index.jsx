import React, { useEffect, useRef, useState } from 'react';
import { Button, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import AgentAvatar from '../Common/AgentAvatar';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import { filterAndFormatAgentLogs } from '../../utils/helper';
import ActivityDetails from '../Common/ActivityDetails';
import { UserIcon } from '@heroicons/react/24/solid';

const Activity = () => {
    const containerRef = useRef();
    const useAgentsPlaygroundStore = usePlaygroundStore();
    const {
        teamStore,
        isActivityOpen,
        selectedTab,
        uiSettings,
        setActivityOpenAction
    } = useAgentsPlaygroundStore(
        (state) => ({
            teamStore: state.teamStore,
            isActivityOpen: state.isActivityOpen,
            selectedTab: state.selectedTab,
            uiSettings: state.uiSettings,
            setActivityOpenAction: state.setActivityOpenAction
        })
    );

    const {
        workflowLogs,
    } = teamStore(state => ({
        workflowLogs: state.workflowLogs
    }));

    const [logsList, setLogsList] = useState([]);

    const updateLogsLists = (workflowLogs) => {
        const logs = filterAndFormatAgentLogs(workflowLogs);
        // console.log('processedLogs----', logs);
        setLogsList(logs);
    };


    useEffect(() => {
        // console.log('workflowLogs--useEffect', workflowLogs);
        updateLogsLists(workflowLogs);
    }, [workflowLogs]);

    // INFO: Close dialog when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setActivityOpenAction(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    return (
        <Transition show={isActivityOpen && selectedTab === 1 && logsList.length > 0}>
            <div className="absolute top-0 -right-[1px] transition ease-in-out data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:data-[closed]:translate-x-full data-[leave]:duration-300 data-[leave]:data-[closed]:translate-x-full">
                <div ref={containerRef} className="mt-[54px] bg-slate-900 w-[400px] h-full border border-slate-700 divide-y divide-slate-700 shadow-2xl shadow-slate-950 backdrop-blur-2xl">
                    <div className="relative py-2 px-4 h-[43px] flex items-center justify-center">
                        <span className="text-sm font-medium text-white">Activity</span>
                        <Button className="ml-auto inline-flex items-center rounded-full p-1 text-slate-400 text-sm focus:outline-none data-[hover]:bg-indigo-500/15 data-[hover]:text-indigo-500 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                            <XMarkIcon className="w-5 h-5" onClick={() => { setActivityOpenAction(false) }} />
                        </Button>
                    </div>
                    <div className={`flex flex-col gap-4 p-4 min-w-full overflow-auto ${uiSettings.showFullScreen || uiSettings.maximizeConfig?.isActive ? "h-[calc(100vh-98px)]" : "h-[202px] sm:h-[302px] md:h-[402px] lg:h-[502px] xl:h-[602px] 2xl:h-[702px]"}`}>
                        {logsList.map((log, idx) => (
                            <div key={idx} className="grid grid-cols-[28px_1fr] gap-2">
                                {(log.status === "REVISE" || log.status === "VALIDATED") ? (
                                    <div className="bg-slate-950/50 text-slate-500 rounded-full w-7 h-7 flex justify-center relative">
                                        <UserIcon className="w-5 h-5 absolute bottom-0" />
                                    </div>
                                ) : (
                                    <div>
                                        <AgentAvatar agent={{ name: log.agent }} showBorder={false} />
                                    </div>
                                )}
                                <div className="flex flex-col gap-1">
                                    <p>
                                        <span className="text-sm font-medium text-slate-200">{(log.status === "REVISE" || log.status === "VALIDATED") ? 'Anonymous' : log.agent}</span>
                                        <span className="text-sm font-normal text-slate-400">{log.description}</span>
                                    </p>
                                    {log.details !== "" && (
                                        <ActivityDetails details={log.details} styles={"max-w-[320px]"} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Transition>
    );
};

export default Activity;