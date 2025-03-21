import React from 'react';
import { Button } from '@headlessui/react';
import { KaibanJSIcon } from '../../assets/icons';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';

const ProjectName = () => {
  const useAgentsPlaygroundStore = usePlaygroundStore();

  const { project, uiSettings } = useAgentsPlaygroundStore(state => ({
    project: state.project,
    uiSettings: state.uiSettings,
  }));

  return (
    <div className="kb-flex kb-items-center kb-gap-2 kb-pl-0.5">
      <Button
        className={`kb-relative kb-pl-[2px] kb-pr-[8px] kb-flex kb-justify-center kb-items-center kb-text-slate-400 ${uiSettings.showFullScreen ? 'hover:kb-text-indigo-500 kb-cursor-pointer' : 'kb-cursor-default'}`}
        onClick={() => {
          if (uiSettings.showFullScreen) {
            if (uiSettings.isPreviewMode) {
              window.open('https://www.kaibanjs.com/', '_blank');
            } else {
              window.location.href = '/';
            }
          }
        }}
      >
        <KaibanJSIcon />
      </Button>
      <div className="kb-hidden md:kb-flex kb-flex-col">
        <span className="kb-text-sm kb-text-white">{project.name}</span>
        <span className="kb-text-xs kb-font-normal kb-text-slate-400">
          {project.user.name}
        </span>
      </div>
    </div>
  );
};

export default ProjectName;
