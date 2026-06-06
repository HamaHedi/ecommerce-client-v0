import React, { createContext, useContext, useEffect, useState } from "react";

// Step 1: Create a Context
const GlobalStateContext = createContext();

const readLS = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

// Step 2: Create a Provider component
export const GlobalStateProvider = ({ children }) => {
  const [keyword, setKeyword] = useState(undefined);
  const [category, setCategory] = useState("");
  const [subcategory, setSubategory] = useState("");
  const [brand, setBrand] = useState("");

  // Wishlist (favorites) — persisted in localStorage
  const [wishlist, setWishlist] = useState(() => readLS("wishlist", []));
  // Recently viewed products — persisted in localStorage
  const [recentlyViewed, setRecentlyViewed] = useState(() =>
    readLS("recentlyViewed", [])
  );

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const isInWishlist = (id) => wishlist.some((p) => p._id === id);

  const toggleWishlist = (product) => {
    if (!product || !product._id) return;
    setWishlist((prev) =>
      prev.some((p) => p._id === product._id)
        ? prev.filter((p) => p._id !== product._id)
        : [
            {
              _id: product._id,
              name: product.name,
              price: product.price,
              oldPrice: product.oldPrice,
              brand: product.brand,
              images: product.images,
            },
            ...prev,
          ]
    );
  };

  const removeFromWishlist = (id) =>
    setWishlist((prev) => prev.filter((p) => p._id !== id));

  const addRecentlyViewed = (product) => {
    if (!product || !product._id) return;
    setRecentlyViewed((prev) => {
      const next = prev.filter((p) => p._id !== product._id);
      next.unshift({
        _id: product._id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        brand: product.brand,
        images: product.images,
      });
      return next.slice(0, 12);
    });
  };

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
        // wishlist
        wishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        // recently viewed
        recentlyViewed,
        addRecentlyViewed,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

// Step 3: Custom hook to access the global state
export const useGlobalState = () => useContext(GlobalStateContext);
