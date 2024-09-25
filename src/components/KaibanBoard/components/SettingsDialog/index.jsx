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
        setSettingsDialogOpenAction
    } = useAgentsPlaygroundStore(
        (state) => ({
            keys: state.keys,
            setKeysAction: state.setKeysAction,
            setSettingsDialogOpenAction: state.setSettingsDialogOpenAction
        })
    );

    // INFO: Close dialog when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
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

    const handleRemoveKey = (index) => {
        const values = [...keys];
        values.splice(index, 1);
        setKeys(values);
    };

    const handleSaveKeys = () => {
        const filteredKeys = keys.filter(keyObj => keyObj.key !== '' && keyObj.value !== '');
        if (filteredKeys.length > 0) {
            const keysToSave = filteredKeys.map(key => ({
                key: key.key,
                value: key.value
            }));

            setKeysAction(keysToSave);
            setSettingsDialogOpenAction(false);
        } else {
            toast.error('Please enter at least one key-value pair');
        }
    };

    const maskKey = (key) => {
        if (typeof key !== 'string' || key.length === 0) {
            return;
        }

        const visibleLength = key.length < 5 ? 2 : 5;
        const visiblePart = key.substring(0, visibleLength);
        const maskedPart = '*'.repeat(key.length - visibleLength);
        return `${visiblePart}${maskedPart}`;
    };

    return (
        <div className="absolute w-full h-full inset-0 bg-slate-950/50">
            <div className="flex min-h-full items-center justify-center p-4">
                <div ref={containerRef} className="z-40 w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl">
                    <div className="flex items-center">
                        <h3 className="text-base/7 font-medium text-white">
                            Settings
                        </h3>
                        <Button className="ml-auto text-slate-400 focus:outline-none data-[hover]:text-indigo-500 data-[focus]:outline-1 data-[focus]:outline-white"
                            onClick={() => setSettingsDialogOpenAction(false)}
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </Button>
                    </div>
                    <p className="mt-2 text-sm/6 text-slate-400">
                        Please enter the keys you plan to use throughout your code.
                    </p>
                    <div className="mt-2">
                        {keys.map((item, index) => (
                            <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-2">
                                <Input
                                    type="text"
                                    name="key"
                                    value={item.key}
                                    onChange={(event) => handleInputChange(index, event)}
                                    placeholder="Key"
                                    className="block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                                />
                                <Input
                                    type="text"
                                    name="value"
                                    value={item.isNew ? item.value : maskKey(item.value)}
                                    onChange={(event) => handleInputChange(index, event)}
                                    disabled={!item.isNew}
                                    placeholder="Value"
                                    className="block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                                />
                                <Button className="w-min inline-flex items-center rounded-lg bg-red-500/5 p-2 text-red-500 focus:outline-none data-[hover]:bg-red-500/20 data-[hover]:text-red-600 data-[focus]:outline-1 data-[focus]:outline-white"
                                    onClick={() => handleRemoveKey(index)}>
                                    <TrashIcon className="w-5 h-5" />
                                </Button>
                            </div>
                        ))}
                        <Button className="inline-flex items-center gap-2 rounded-lg bg-indigo-500/10 py-1.5 px-3 text-sm font-medium text-slate-400 focus:outline-none data-[hover]:bg-indigo-500/15 data-[hover]:text-indigo-500 data-[focus]:outline-1 data-[focus]:outline-white"
                            onClick={handleAddKey}>
                            <PlusIcon className="w-5 h-5" />
                            Add Key
                        </Button>
                    </div>
                    <div className="mt-4 flex gap-2 items-center">
                        <Button className="ml-auto min-w-20 inline-flex items-center justify-center gap-2 rounded-md bg-slate-800 py-1.5 px-3 text-sm font-medium text-slate-400 focus:outline-none data-[hover]:bg-indigo-500/15 data-[hover]:text-indigo-500 data-[focus]:outline-1 data-[focus]:outline-white"
                            onClick={() => setSettingsDialogOpenAction(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="min-w-20 inline-flex items-center justify-center gap-2 rounded-md bg-indigo-500 py-1.5 px-3 text-sm font-medium text-white focus:outline-none data-[hover]:bg-indigo-600 data-[focus]:outline-1 data-[focus]:outline-white data-[disabled]:text-slate-600 data-[disabled]:bg-indigo-500/10"
                            onClick={() => {
                                handleSaveKeys();
                            }}
                            disabled={keys.length === 0 || (keys.length === 1 && keys[0].key === '' && keys[0].value === '')}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsDialog;