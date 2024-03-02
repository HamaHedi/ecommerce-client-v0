import React, { createContext, useContext, useState } from 'react';

// Step 1: Create a Context
const GlobalStateContext = createContext();

// Step 2: Create a Provider component
export const GlobalStateProvider = ({ children }) => {
  const [keyword, setKeyword] = useState('');

  return (
    <GlobalStateContext.Provider value={{ keyword, setKeyword }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Step 3: Custom hook to access the global state
export const useGlobalState = () => useContext(GlobalStateContext);
