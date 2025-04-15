/* eslint-disable react/prop-types */
import React from 'react';
import { TabGroup, TabPanel, TabPanels } from '@headlessui/react';
import { Toaster } from 'react-hot-toast';
import '../../assets/styles/index.css';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';

import Header from '../../components/Header';
import SideMenu from '../../components/SideMenu';
import EditPreviewView from '../editPreview/EditPreviewView';
import BoardView from '../board/BoardView';
import ResultView from '../results/ResultView';
import Activity from '../../components/Activity';
import TaskDetailsDialog from '../../components/TaskDetailsDialog';
import ExecutionDialog from '../../components/ExecutionDialog';
import CelebrationDialog from '../../components/CelebrationDialog';
import ShareDialog from '../../components/ShareDialog';
import ShareUrlDialog from '../../components/ShareDialog/ShareUrlDialog';
import SettingsDialog from '../../components/SettingsDialog';
import MissingKeysDialog from '../../components/MissingKeysDialog';
import ChatBot from '../../components/ChatBot';

const PlaygroundLayout = ({ editorComponent, examplesMenu }) => {
  const useAgentsPlaygroundStore = usePlaygroundStore();
  const {
    uiSettings,
    selectedTab,
    isExecutionDialogOpen,
    isCelebrationDialogOpen,
    isTaskDetailsDialogOpen,
    isShareDialogOpen,
    isShareUrlDialogOpen,
    isOpenSettingsDialog,
    isMissingKeysDialogOpen,
  } = useAgentsPlaygroundStore(state => ({
    uiSettings: state.uiSettings,
    selectedTab: state.selectedTab,
    isExecutionDialogOpen: state.isExecutionDialogOpen,
    isCelebrationDialogOpen: state.isCelebrationDialogOpen,
    isTaskDetailsDialogOpen: state.isTaskDetailsDialogOpen,
    isShareDialogOpen: state.isShareDialogOpen,
    isShareUrlDialogOpen: state.isShareUrlDialogOpen,
    isOpenSettingsDialog: state.isOpenSettingsDialog,
    isMissingKeysDialogOpen: state.isMissingKeysDialogOpen,
  }));

  return (
    <div
      className={`kb-bg-slate-900 kb-overflow-hidden ${uiSettings.showFullScreen || uiSettings.maximizeConfig?.isActive ? 'kb-full-screen kb-fixed kb-top-0 kb-left-0 kb-w-screen kb-h-screen kb-z-50' : 'kb-relative kb-container kb-rounded-xl kb-ring-1 kb-ring-slate-700'}`}
      id="kaibanjs"
    >
      <canvas
        id="confetti_canvas"
        className="kb-absolute kb-w-full kb-h-full kb-inset-0"
        style={{
          zIndex: isCelebrationDialogOpen ? 20 : -1,
        }}
      ></canvas>
      <TabGroup selectedIndex={selectedTab} className="kb-flex kb-flex-col">
        <Header examplesMenu={examplesMenu} />
        <div className="kb-relative kb-isolate kb-flex kb-divide-x kb-divide-slate-700">
          <SideMenu />
          <TabPanels
            className={`${uiSettings.showFullScreen || uiSettings.maximizeConfig?.isActive ? 'kb-w-[calc(100vw-55px)] kb-h-[calc(100vh-55px)]' : 'kb-w-[calc(100%-55px)] sm:kb-w-[590px] md:kb-w-[723px] lg:kb-w-[979px] xl:kb-w-[1235px] 2xl:kb-w-[1493px] kb-h-[455px] lg:kb-h-[555px] xl:kb-h-[655px] 2xl:kb-h-[755px]'}`}
          >
            <TabPanel className="kb-h-full">
              <EditPreviewView editorComponent={editorComponent} />
            </TabPanel>
            <TabPanel className="kb-h-full kb-overflow-auto">
              <BoardView />
            </TabPanel>
            <TabPanel className="kb-h-full kb-overflow-auto">
              <ResultView />
            </TabPanel>
          </TabPanels>
        </div>
      </TabGroup>
      {isTaskDetailsDialogOpen && <TaskDetailsDialog />}
      {isExecutionDialogOpen && <ExecutionDialog />}
      {isCelebrationDialogOpen && <CelebrationDialog />}
      {isShareDialogOpen && <ShareDialog />}
      {isShareUrlDialogOpen && <ShareUrlDialog />}
      {isOpenSettingsDialog && <SettingsDialog />}
      {isMissingKeysDialogOpen && <MissingKeysDialog />}
      <Activity />
      <ChatBot />
      <Toaster
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#94a3b8',
          },
        }}
        containerStyle={{
          position: 'absolute',
          top: 20,
        }}
      />
    </div>
  );
};

export default PlaygroundLayout;
