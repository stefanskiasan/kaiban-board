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
        <div className="absolute w-full h-full inset-0 bg-slate-950/50">
            <div className="flex min-h-full items-center justify-center p-4">
                <div ref={containerRef} className="z-40 w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl">
                    <div className="flex items-center">
                        <h3 className="text-base/7 font-medium text-white">
                            Share Team
                        </h3>
                        <Button className="ml-auto text-slate-400 focus:outline-none data-[hover]:text-indigo-500 data-[focus]:outline-1 data-[focus]:outline-white"
                            onClick={() => setShareDialogOpenAction(false)}
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </Button>
                    </div>
                    <p className="mt-2 text-sm/6 text-slate-400">
                        Pick a username or stick with the default.
                    </p>
                    <p className="text-xs text-slate-600">
                        Your agents and team will be publicly visible on the internet. Ensure all information is suitable for public sharing.
                    </p>
                    <div className="mt-4">
                        <div className="grid grid-cols-[auto_1fr] gap-2 mb-2">
                            {executed.current && (
                                <div className="relative group flex items-center">
                                    <AgentAvatar agent={{ name: userName !== "" ? userName : "Username" }} size="xl" />
                                    {userName === defaultUsername.username && <Tooltip text={defaultUsername.explanation} styles="left-[22px]" />}
                                </div>
                            )}
                            <Input
                                type="text"
                                name="name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                disabled={isLoadingShare}
                                placeholder="Username"
                                className="block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex gap-2 items-center">
                        {isLoadingShare && (
                            <div className="flex items-center gap-2">
                                <Spinner />
                                <span className="text-xs font-medium text-slate-400">Sharing team details...</span>
                            </div>
                        )}
                        <Button className="ml-auto min-w-20 inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 ring-1 ring-indigo-500/15 py-1.5 px-3 text-sm font-medium text-slate-400 focus:outline-none data-[hover]:bg-indigo-500/15 data-[hover]:text-indigo-500 data-[focus]:outline-1 data-[focus]:outline-white"
                            onClick={() => setShareDialogOpenAction(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="min-w-20 inline-flex items-center justify-center gap-2 rounded-md bg-indigo-500 py-1.5 px-3 text-sm font-medium text-white focus:outline-none data-[hover]:bg-indigo-600 data-[focus]:outline-1 data-[focus]:outline-white data-[disabled]:bg-indigo-500/15"
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