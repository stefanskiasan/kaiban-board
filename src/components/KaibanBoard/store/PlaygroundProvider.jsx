import React, { createContext, useContext } from 'react';
import { createAgentsPlaygroundStore } from './store';

const PlaygroundContext = createContext(null);

export const PlaygroundProvider = ({ children, initialState }) => {
    const store = createAgentsPlaygroundStore(initialState);
    return (
        <PlaygroundContext.Provider value={store}>
            {children}
        </PlaygroundContext.Provider>
    );
};

export const usePlaygroundStore = () => useContext(PlaygroundContext);
