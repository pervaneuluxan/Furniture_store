import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onStorageChange, readJson, writeJson } from './storage';

const WISHLIST_KEY = 'wishlist';

const WishlistContext = createContext(null);

// Stored as { [productId]: productId } for compatibility with earlier versions.
const readIds = () => {
  const stored = readJson(WISHLIST_KEY, {});
  return stored && typeof stored === 'object' ? Object.keys(stored) : [];
};

/** Pieces the visitor saved to come back to. Kept in the browser only. */
export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(readIds);

  useEffect(() => onStorageChange(WISHLIST_KEY, () => setIds(readIds())), []);

  const toggle = useCallback((productId) => {
    setIds((prev) => {
      const id = String(productId);
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeJson(WISHLIST_KEY, Object.fromEntries(next.map((x) => [x, Number(x)])));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ ids, isSaved: (productId) => ids.includes(String(productId)), toggle }),
    [ids, toggle]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return context;
}
