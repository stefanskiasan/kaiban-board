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
    setActivityOpenAction,
  } = useAgentsPlaygroundStore(state => ({
    teamStore: state.teamStore,
    isActivityOpen: state.isActivityOpen,
    selectedTab: state.selectedTab,
    uiSettings: state.uiSettings,
    setActivityOpenAction: state.setActivityOpenAction,
  }));

  const { workflowLogs } = teamStore(state => ({
    workflowLogs: state.workflowLogs,
  }));

  const [logsList, setLogsList] = useState([]);

  const updateLogsLists = workflowLogs => {
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
    const handleClickOutside = event => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
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
    <Transition
      show={isActivityOpen && selectedTab === 1 && logsList.length > 0}
    >
      <div className="kb-absolute kb-top-0 -kb-right-[1px] kb-transition kb-ease-in-out data-[closed]:kb-opacity-0 data-[enter]:kb-duration-300 data-[enter]:data-[closed]:kb-translate-x-full data-[leave]:kb-duration-300 data-[leave]:data-[closed]:kb-translate-x-full">
        <div
          ref={containerRef}
          className="kb-mt-[54px] kb-bg-slate-900 kb-w-[320px] md:kb-w-[400px] kb-h-full kb-border kb-border-slate-700 kb-divide-y kb-divide-slate-700 kb-shadow-2xl kb-shadow-slate-950 kb-backdrop-blur-2xl"
        >
          <div className="kb-relative kb-py-2 kb-px-4 kb-h-[43px] kb-flex kb-items-center kb-justify-center">
            <span className="kb-text-sm kb-font-medium kb-text-white">
              Activity
            </span>
            <Button className="kb-ml-auto kb-inline-flex kb-items-center kb-rounded-full kb-p-1 kb-text-slate-400 kb-text-sm focus:kb-outline-none data-[hover]:kb-bg-indigo-500/15 data-[hover]:kb-text-indigo-500 data-[open]:kb-bg-gray-700 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white">
              <XMarkIcon
                className="kb-w-5 kb-h-5"
                onClick={() => {
                  setActivityOpenAction(false);
                }}
              />
            </Button>
          </div>
          <div
            className={`kb-flex kb-flex-col kb-gap-4 kb-p-4 kb-min-w-full kb-overflow-auto ${uiSettings.showFullScreen || uiSettings.maximizeConfig?.isActive ? 'kb-h-[calc(100vh-98px)]' : 'kb-h-[402px] lg:kb-h-[502px] xl:kb-h-[602px] 2xl:kb-h-[702px]'}`}
          >
            {logsList.map((log, idx) => (
              <div
                key={idx}
                className="kb-grid kb-grid-cols-[28px_1fr] kb-gap-2"
              >
                {log.status === 'REVISE' || log.status === 'VALIDATED' ? (
                  <div className="kb-bg-slate-950/50 kb-text-slate-500 kb-rounded-full kb-w-7 kb-h-7 kb-flex kb-justify-center kb-relative">
                    <UserIcon className="kb-w-5 kb-h-5 kb-absolute kb-bottom-0" />
                  </div>
                ) : (
                  <div>
                    <AgentAvatar
                      agent={{ name: log.agent }}
                      showBorder={false}
                    />
                  </div>
                )}
                <div className="kb-flex kb-flex-col kb-gap-1">
                  <p>
                    <span className="kb-text-sm kb-font-medium kb-text-slate-200">
                      {log.status === 'REVISE' || log.status === 'VALIDATED'
                        ? 'Anonymous'
                        : log.agent}
                    </span>
                    <span className="kb-text-sm kb-font-normal kb-text-slate-400">
                      {log.description}
                    </span>
                  </p>
                  {log.details !== '' && (
                    <ActivityDetails
                      details={log.details}
                      styles={'kb-max-w-[240px] md:kb-max-w-[320px]'}
                    />
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
