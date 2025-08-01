import React from 'react';
import {
  Squares2X2Icon,
  SparklesIcon,
  CodeBracketIcon,
  ViewColumnsIcon,
  ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline';
import { Button, Tab, TabList } from '@headlessui/react';
import Tooltip from '../Common/Tooltip';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';

const SideMenu = () => {
  const useAgentsPlaygroundStore = usePlaygroundStore();
  const { teamStore, uiSettings, setTabAction, setChatBotOpenAction } =
    useAgentsPlaygroundStore(state => ({
      teamStore: state.teamStore,
      uiSettings: state.uiSettings,
      setTabAction: state.setTabAction,
      setChatBotOpenAction: state.setChatBotOpenAction,
    }));

  const { teamWorkflowStatus } = teamStore(state => ({
    teamWorkflowStatus: state.teamWorkflowStatus,
  }));

  // Check if workflow is in a state that should disable tabs
  const isWorkflowActive = ['RUNNING', 'PAUSED', 'STOPPING'].includes(
    teamWorkflowStatus
  );

  return (
    <TabList className="kb-w-[55px] kb-flex kb-flex-col">
      <Tab
        className="kb-relative kb-z-10 kb-isolate kb-group kb-w-full kb-h-[55px] kb-flex kb-justify-center kb-items-center kb-border-l-2 kb-pr-[2px] kb-border-slate-900 kb-text-sm kb-font-medium kb-text-slate-400 focus:kb-outline-none data-[selected]:kb-border-indigo-500 data-[selected]:kb-text-indigo-500 data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white data-[disabled]:kb-text-slate-500"
        onClick={() => setTabAction(0)}
        disabled={isWorkflowActive}
      >
        {!uiSettings.isPreviewMode ? (
          <>
            <CodeBracketIcon className="kb-w-6 kb-h-6" />
            <Tooltip text="Setup Team" />
          </>
        ) : (
          <>
            <Squares2X2Icon className="kb-w-6 kb-h-6" />
            <Tooltip text="Dashboard" />
          </>
        )}
      </Tab>
      <Tab
        className="kb-relative kb-z-10 kb-isolate kb-group kb-w-full kb-h-[55px] kb-flex kb-justify-center kb-items-center kb-border-l-2 kb-pr-[2px] kb-border-slate-900 kb-text-sm kb-font-medium kb-text-slate-400 focus:kb-outline-none data-[selected]:kb-border-indigo-500 data-[selected]:kb-text-indigo-500 data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white data-[disabled]:kb-text-slate-500"
        onClick={() => setTabAction(1)}
        disabled={!isWorkflowActive}
      >
        <ViewColumnsIcon className="kb-w-6 kb-h-6" />
        <Tooltip text="Kaiban Board" />
      </Tab>
      <Tab
        className="kb-relative kb-z-10 kb-isolate kb-group kb-w-full kb-h-[55px] kb-flex kb-justify-center kb-items-center kb-border-l-2 kb-pr-[2px] kb-border-slate-900 kb-text-sm kb-font-medium kb-text-slate-400 focus:kb-outline-none data-[selected]:kb-border-indigo-500 data-[selected]:kb-text-indigo-500 data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white data-[disabled]:kb-text-slate-500"
        onClick={() => setTabAction(2)}
        disabled={isWorkflowActive}
      >
        <SparklesIcon className="kb-w-6 kb-h-6" />
        <Tooltip text="Results Overview" />
      </Tab>
      {!uiSettings.isChatbotFloating && (
        // This option is hidden in this moment because we need to improve the chatbot
        <div className="kb-hidden kb-absolute kb-bottom-0 kb-w-[55px]">
          <Button
            className=" kb-relative kb-z-10 kb-isolate kb-group kb-w-full kb-h-[55px] kb-flex kb-justify-center kb-items-center kb-border-l-2 kb-pr-[2px] kb-border-slate-900 kb-text-sm kb-font-medium kb-text-slate-400 focus:kb-outline-none data-[selected]:kb-border-indigo-500 data-[selected]:kb-text-indigo-500 data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
            onClick={() => setChatBotOpenAction(true)}
          >
            <ChatBubbleLeftEllipsisIcon className="kb-w-6 kb-h-6" />
            <Tooltip text="AI Assistant" />
          </Button>
        </div>
      )}
    </TabList>
  );
};

export default SideMenu;
