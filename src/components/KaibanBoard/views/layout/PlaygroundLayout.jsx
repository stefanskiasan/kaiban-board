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
import SettingsDialog from '../../components/SettingsDialog';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const PlaygroundLayout = ({ editorComponent, examplesMenu, teamsMenu }) => {
    const useAgentsPlaygroundStore = usePlaygroundStore();
    const {
        uiSettings,
        selectedTab,
        isExecutionDialogOpen,
        isCelebrationDialogOpen,
        isTaskDetailsDialogOpen,
        isShareDialogOpen,
        isOpenSettingsDialog
    } = useAgentsPlaygroundStore(
        (state) => ({
            uiSettings: state.uiSettings,
            selectedTab: state.selectedTab,
            isExecutionDialogOpen: state.isExecutionDialogOpen,
            isCelebrationDialogOpen: state.isCelebrationDialogOpen,
            isTaskDetailsDialogOpen: state.isTaskDetailsDialogOpen,
            isShareDialogOpen: state.isShareDialogOpen,
            isOpenSettingsDialog: state.isOpenSettingsDialog
        })
    );


    return (
        <div className={`bg-slate-900 overflow-hidden ${uiSettings.showFullScreen || uiSettings.maximizeConfig?.isActive ? "fixed top-0 left-0 w-screen h-screen z-50" : "relative container rounded-xl ring-1 ring-slate-700"}`} id="kaibanjs">
            <canvas id="confetti_canvas" className="absolute w-full h-full inset-0" style={{
                zIndex: isCelebrationDialogOpen ? 20 : -1
            }}></canvas>
            <TabGroup selectedIndex={selectedTab} className="flex flex-col">
                <Header examplesMenu={examplesMenu} teamsMenu={teamsMenu} />
                <div className="relative isolate flex divide-x divide-slate-700">
                    <SideMenu />
                    <TabPanels className={`${uiSettings.showFullScreen || uiSettings.maximizeConfig?.isActive ? "w-[calc(100vw-55px)] h-[calc(100vh-55px)]" : "w-[550px] sm:w-[590px] md:w-[723px] lg:w-[979px] xl:w-[1235px] 2xl:w-[1493px] h-[255px] sm:h-[355px] md:h-[455px] lg:h-[555px] xl:h-[655px] 2xl:h-[755px]"}`}>
                        <TabPanel className="h-full">
                            <EditPreviewView editorComponent={editorComponent} />
                        </TabPanel>
                        <TabPanel className="h-full overflow-auto">
                            <BoardView />
                        </TabPanel>
                        <TabPanel className="h-full overflow-auto">
                            <ResultView />
                        </TabPanel>
                    </TabPanels>
                </div>
            </TabGroup>
            {isTaskDetailsDialogOpen && <TaskDetailsDialog />}
            {isExecutionDialogOpen && <ExecutionDialog />}
            {isCelebrationDialogOpen && <CelebrationDialog />}
            {isShareDialogOpen && <ShareDialog />}
            {isOpenSettingsDialog && <SettingsDialog />}
            <Activity />
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
                }} />
        </div>
    );
};

export default PlaygroundLayout;