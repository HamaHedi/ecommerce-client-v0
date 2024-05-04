import React, { createContext, useContext, useState } from "react";

// Step 1: Create a Context
const GlobalStateContext = createContext();

// Step 2: Create a Provider component
export const GlobalStateProvider = ({ children }) => {
  const [keyword, setKeyword] = useState(undefined);
  const [category, setCategory] = useState("");
  const [subcategory, setSubategory] = useState("");
  const [brand, setBrand] = useState("");

  return (
    <GlobalStateContext.Provider
      value={{
        keyword,
        setKeyword,
        category,
        setCategory,
        subcategory,
        setSubategory,
        brand,
        setBrand,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

// Step 3: Custom hook to access the global state
export const useGlobalState = () => useContext(GlobalStateContext);
