import React, { useRef, useEffect } from 'react';
import { Button, Input } from '@headlessui/react';
import { XMarkIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import toast from 'react-hot-toast';

const ShareUrlDialog = () => {
  const useAgentsPlaygroundStore = usePlaygroundStore();
  const { shareUrl, setShareUrlDialogOpenAction } = useAgentsPlaygroundStore(
    state => ({
      shareUrl: state.shareUrl,
      setShareUrlDialogOpenAction: state.setShareUrlDialogOpenAction,
    })
  );

  const containerRef = useRef();

  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShareUrlDialogOpenAction(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL to clipboard');
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <div className="kb-absolute kb-w-full kb-h-full kb-inset-0 kb-bg-slate-950/50">
      <div className="kb-flex kb-min-h-full kb-items-center kb-justify-center kb-p-4">
        <div
          ref={containerRef}
          className="kb-z-40 kb-w-full kb-max-w-md kb-rounded-xl kb-bg-white/5 kb-p-6 kb-backdrop-blur-2xl"
        >
          <div className="kb-flex kb-items-center">
            <h3 className="kb-text-base/7 kb-font-medium kb-text-white">
              Share URL
            </h3>
            <Button
              className="kb-ml-auto kb-text-slate-400 focus:kb-outline-none data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
              onClick={() => setShareUrlDialogOpenAction(false)}
            >
              <XMarkIcon className="kb-w-5 kb-h-5" />
            </Button>
          </div>
          <p className="kb-mt-2 kb-text-sm/6 kb-text-slate-400">
            Your team has been shared successfully! Copy the URL below to share
            it with others.
          </p>
          <div className="kb-mt-4">
            <div className="kb-flex kb-gap-2">
              <Input
                type="text"
                name="url"
                value={shareUrl}
                readOnly
                className="kb-block kb-w-full kb-rounded-lg kb-border-none kb-bg-white/5 kb-py-1.5 kb-px-3 kb-text-sm/6 kb-text-white focus:kb-outline-none data-[focus]:kb-outline-2 data-[focus]:-kb-outline-offset-2 data-[focus]:kb-outline-white/25"
              />
              <Button
                className="kb-inline-flex kb-items-center kb-justify-center kb-gap-2 kb-rounded-md kb-bg-indigo-500 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-white focus:kb-outline-none data-[hover]:kb-bg-indigo-600 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
                onClick={handleCopyUrl}
              >
                <ClipboardDocumentIcon className="kb-w-4 kb-h-4" />
                Copy
              </Button>
            </div>
          </div>
          <div className="kb-mt-6 kb-flex kb-gap-2 kb-items-center">
            <Button
              className="kb-ml-auto kb-min-w-20 kb-inline-flex kb-items-center kb-justify-center kb-gap-2 kb-rounded-md kb-bg-slate-800 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-slate-400 focus:kb-outline-none data-[hover]:kb-bg-indigo-500/15 data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
              onClick={() => setShareUrlDialogOpenAction(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareUrlDialog;
