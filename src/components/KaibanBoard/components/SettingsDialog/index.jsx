import React from 'react';
import { Button, Input } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';

const SettingsDialog = () => {
  const useAgentsPlaygroundStore = usePlaygroundStore();
  const containerRef = useRef();
  const [keys, setKeys] = useState([]);

  const {
    keys: storeKeys,
    setKeysAction,
    setSettingsDialogOpenAction,
  } = useAgentsPlaygroundStore(state => ({
    keys: state.keys,
    setKeysAction: state.setKeysAction,
    setSettingsDialogOpenAction: state.setSettingsDialogOpenAction,
  }));

  // INFO: Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setSettingsDialogOpenAction(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  useEffect(() => {
    if (storeKeys.length > 0) {
      setKeys(storeKeys.map(key => ({ ...key, isNew: false })));
    } else {
      setKeys([{ key: '', value: '', isNew: true }]);
    }
  }, [storeKeys]);

  const handleAddKey = () => {
    setKeys([...keys, { key: '', value: '', isNew: true }]);
  };

  const handleInputChange = (index, event) => {
    const values = [...keys];
    values[index][event.target.name] = event.target.value;
    setKeys(values);
  };

  const handleRemoveKey = index => {
    const values = [...keys];
    values.splice(index, 1);
    setKeys(values);
  };

  const handleSaveKeys = () => {
    const filteredKeys = keys.filter(
      keyObj => keyObj.key !== '' && keyObj.value !== ''
    );
    if (filteredKeys.length > 0) {
      const keysToSave = filteredKeys.map(key => ({
        key: key.key,
        value: key.value,
      }));

      setKeysAction(keysToSave);
      setSettingsDialogOpenAction(false);
    } else {
      toast.error('Please enter at least one key-value pair');
    }
  };


  return (
    <div className="kb-absolute kb-w-full kb-h-full kb-inset-0 kb-bg-slate-900/50">
      <div className="kb-flex kb-min-h-full kb-items-center kb-justify-center kb-p-4">
        <div
          ref={containerRef}
          className="kb-z-40 kb-w-full kb-max-w-md kb-rounded-xl kb-bg-white/5 kb-p-6 kb-backdrop-blur-2xl"
        >
          <div className="kb-flex kb-items-center">
            <h3 className="kb-text-base/7 kb-font-medium kb-text-white">
              Settings
            </h3>
            <Button
              className="kb-ml-auto kb-text-slate-400 focus:kb-outline-none data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
              onClick={() => setSettingsDialogOpenAction(false)}
            >
              <XMarkIcon className="kb-w-5 kb-h-5" />
            </Button>
          </div>
          <p className="kb-mt-2 kb-text-sm/6 kb-text-slate-400">
            Please enter the keys you plan to use throughout your code.
          </p>
          <div className="kb-mt-2">
            {keys.map((item, index) => (
              <div
                key={index}
                className="kb-grid kb-grid-cols-[1fr_1fr_auto] kb-gap-2 kb-mb-2"
              >
                <Input
                  type="text"
                  name="key"
                  value={item.key}
                  onChange={event => handleInputChange(index, event)}
                  placeholder="Key"
                  className="kb-block kb-w-full kb-rounded-lg kb-border-none kb-bg-white/5 kb-py-1.5 kb-px-3 kb-text-sm/6 kb-text-white focus:kb-outline-none data-[focus]:kb-outline-2 data-[focus]:-kb-outline-offset-2 data-[focus]:kb-outline-white/25"
                />
                <Input
                  type="text"
                  name="value"
                  value={item.value}
                  onChange={event => handleInputChange(index, event)}
                  placeholder="Value"
                  className="kb-block kb-w-full kb-rounded-lg kb-border-none kb-bg-white/5 kb-py-1.5 kb-px-3 kb-text-sm/6 kb-text-white focus:kb-outline-none data-[focus]:kb-outline-2 data-[focus]:-kb-outline-offset-2 data-[focus]:kb-outline-white/25"
                />
                <Button
                  className="kb-w-min kb-inline-flex kb-items-center kb-rounded-lg kb-bg-red-500/5 kb-p-2 kb-text-red-500 focus:kb-outline-none data-[hover]:kb-bg-red-500/20 data-[hover]:kb-text-red-600 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
                  onClick={() => handleRemoveKey(index)}
                >
                  <TrashIcon className="kb-w-5 kb-h-5" />
                </Button>
              </div>
            ))}
            <Button
              className="kb-inline-flex kb-items-center kb-gap-2 kb-rounded-lg kb-bg-indigo-500/10 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-slate-400 focus:kb-outline-none data-[hover]:kb-bg-indigo-500/15 data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
              onClick={handleAddKey}
            >
              <PlusIcon className="kb-w-5 kb-h-5" />
              Add Key
            </Button>
          </div>
          <div className="kb-mt-4 kb-flex kb-gap-2 kb-items-center">
            <Button
              className="kb-ml-auto kb-min-w-20 kb-inline-flex kb-items-center kb-justify-center kb-gap-2 kb-rounded-md kb-bg-slate-800 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-slate-400 focus:kb-outline-none data-[hover]:kb-bg-indigo-500/15 data-[hover]:kb-text-indigo-500 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white"
              onClick={() => setSettingsDialogOpenAction(false)}
            >
              Cancel
            </Button>
            <Button
              className="kb-min-w-20 kb-inline-flex kb-items-center kb-justify-center kb-gap-2 kb-rounded-md kb-bg-indigo-500 kb-py-1.5 kb-px-3 kb-text-sm kb-font-medium kb-text-white focus:kb-outline-none data-[hover]:kb-bg-indigo-600 data-[focus]:kb-outline-1 data-[focus]:kb-outline-white data-[disabled]:kb-text-slate-600 data-[disabled]:kb-bg-indigo-500/10"
              onClick={() => {
                handleSaveKeys();
              }}
              disabled={
                keys.length === 0 ||
                (keys.length === 1 &&
                  keys[0].key === '' &&
                  keys[0].value === '')
              }
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog;
