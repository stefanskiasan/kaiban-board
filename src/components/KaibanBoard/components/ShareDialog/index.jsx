import React from 'react';
import { Button, Input } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Spinner from '../Common/Spinner';
import AgentAvatar from '../Common/AgentAvatar';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import { getRandomUsername } from '../../utils/helper';
import Tooltip from '../Common/Tooltip';

const ShareDialog = () => {
    const useAgentsPlaygroundStore = usePlaygroundStore();
    const {
        isLoadingShare,
        shareTeamAction,
        setShareDialogOpenAction
    } = useAgentsPlaygroundStore(
        (state) => ({
            isLoadingShare: state.isLoadingShare,
            shareTeamAction: state.shareTeamAction,
            setShareDialogOpenAction: state.setShareDialogOpenAction
        })
    );

    const containerRef = useRef();
    // INFO: Close dialog when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShareDialogOpenAction(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    const [userName, setUserName] = useState('');
    const [defaultUsername, setDefaultUsername] = useState(null);
    const executed = useRef(false);
    useEffect(() => {
        if (!executed.current) {
            const user = getRandomUsername();
            setUserName(user.username);
            setDefaultUsername(user);
            executed.current = true;
        }
    }, []);


    return (
        <div className="kb-absolute kb-w-full kb-h-full kb-inset-0 kb-bg-slate-950/50">
            <div className="kb-flex kb-min-h-full kb-items-center kb-justify-center kb-p-4">
                <div ref={containerRef} className="kb-z-40 kb-w-full kb-max-w-md kb-rounded-xl kb-bg-white/5 kb-p-6 kb-backdrop-blur-2xl">
                    <div className="kb-flex kb-items-center">
                        <h3 className="kb-text-base/7 kb-font-medium kb-text-white">
                            Share Team
                        </h3>
                        <Button className="kb-ml-auto kb-text-slate-400 focus:kb-outline-none data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
                            onClick={() => setShareDialogOpenAction(false)}
                        >
                            <XMarkIcon className="kb-w-5 kb-h-5" />
                        </Button>
                    </div>
                    <p className="kb-mt-2 kb-text-sm/6 kb-text-slate-400">
                        Pick a username or stick with the default.
                    </p>
                    <p className="kb-text-xs kb-text-slate-600">
                        Your agents and team will be publicly visible on the internet. Ensure all information is suitable for public sharing.
                    </p>
                    <div className="kb-mt-4">
                        <div className="kb-grid kb-grid-cols-[auto_1fr] kb-gap-2 kb-mb-2">
                            {executed.current && (
                                <div className="kb-relative kb-group kb-flex kb-items-center">
                                    <AgentAvatar agent={{ name: userName !== "" ? userName : "Username" }} size="xl" />
                                    {userName === defaultUsername.username && <Tooltip text={defaultUsername.explanation} styles="kb-left-[22px]" />}
                                </div>
                            )}
                            <Input
                                type="text"
                                name="name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                disabled={isLoadingShare}
                                placeholder="Username"
                                className="kb-block kb-w-full kb-rounded-lg kb-border-none kb-bg-white/5 kb-py-1.5 kb-px-3 kb-text-sm/6 kb-text-white focus:kb-outline-none data-[focus]:kb-outline-2 data-[focus]:-kb-outline-offset-2 data-[focus]:kb-outline-white/25"
                            />
                        </div>
                    </div>
                    <div className="kb-mt-6 kb-flex kb-gap-2 kb-items-center">
                        {isLoadingShare && (
                            <div className="kb-flex kb-items-center kb-gap-2">
                                <Spinner />
                                <span className="kb-text-xs kb-font-medium kb-text-slate-400">Sharing team details...</span>
                            </div>
                        )}
                        <Button className="kb-ml-auto kb-min-w-20 kb-inline-flex kb-items-center kb-justify-center kb-gap-2 kb-rounded-md kb-bg-slate-800 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-slate-400 focus:kb-outline-none data-[hover]:kb-bg-indigo-500/15 data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
                            onClick={() => setShareDialogOpenAction(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="kb-min-w-20 kb-inline-flex kb-items-center kb-justify-center kb-gap-2 kb-rounded-md kb-bg-indigo-500 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-white focus:kb-outline-none data-[hover]:kb-bg-indigo-600 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white data-[disabled]:kb-bg-indigo-500/15"
                            onClick={() => {
                                shareTeamAction(userName);
                            }}
                            disabled={userName === '' || isLoadingShare}
                        >
                            Share
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShareDialog;