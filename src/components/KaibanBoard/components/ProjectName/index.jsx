import { Button } from '@headlessui/react';
import { KaibanJSIcon } from "../../assets/icons";
import { usePlaygroundStore } from "../../store/PlaygroundProvider";

const ProjectName = () => {
    const useAgentsPlaygroundStore = usePlaygroundStore();

    const {
        project,
        uiSettings
    } = useAgentsPlaygroundStore(
        (state) => ({
            project: state.project,
            uiSettings: state.uiSettings
        })
    );

    return (
        <div className="flex items-center gap-2 pl-0.5">
            <Button className={`relative pl-[2px] pr-[8px] flex justify-center items-center text-slate-400 ${uiSettings.showFullScreen ? "hover:text-indigo-500 cursor-pointer" : "cursor-default"}`}
                onClick={() => {
                    if (uiSettings.showFullScreen) {
                        if (uiSettings.isPreviewMode) {
                            window.open('https://www.kaibanjs.com/', '_blank');
                        } else {
                            window.location.href = '/';
                        }
                    }
                }}>
                <KaibanJSIcon />
            </Button>
            <div className="hidden md:flex flex-col">
                <span className="text-sm text-white">
                    {project.name}
                </span>
                <span className="text-xs font-normal text-slate-400">{project.user.name}</span>
            </div>
        </div>
    );
}

export default ProjectName;