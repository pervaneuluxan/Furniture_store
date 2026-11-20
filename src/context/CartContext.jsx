import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { getBasket } from '../utils/Models';
import { buildCartLines, cartReducer, sanitizeItems } from './cartReducer';
import { useLanguage } from './LanguageContext';
import { onStorageChange, readJson, writeJson } from './storage';
import { useToast } from './ToastContext';

const BASKET_KEY = 'basket';

const CartContext = createContext(null);

const loadItems = () => sanitizeItems(readJson(BASKET_KEY, {}));

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, () => ({ items: loadItems() }));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { notify } = useToast();

  // Persist every change, and pick up changes made in other tabs.
  useEffect(() => writeJson(BASKET_KEY, state.items), [state.items]);
  useEffect(() => onStorageChange(BASKET_KEY, () => dispatch({ type: 'replaced', items: loadItems() })), []);

  // Product details are refetched only when the set of products changes;
  // quantity changes are applied locally.
  const ids = Object.keys(state.items).sort().join(',');
  useEffect(() => {
    if (!ids) {
      setProducts([]);
      setLoading(false);
      return undefined;
    }
    let current = true;
    setLoading(true);
    getBasket(ids)
      .then((res) => current && setProducts(res.data.data))
      .catch(() => current && setProducts([]))
      .finally(() => current && setLoading(false));
    return () => {
      current = false;
    };
  }, [ids]);

  const { lines, total, count } = useMemo(() => buildCartLines(state.items, products), [state.items, products]);

  const add = useCallback(
    (productId, qty = 1) => {
      dispatch({ type: 'added', productId, qty });
      notify(t('added_to_cart', 'Added to your cart'), { to: '/cart', label: t('cart', 'Cart') });
    },
    [notify, t]
  );
  const setQty = useCallback((productId, qty) => dispatch({ type: 'quantitySet', productId, qty }), []);
  const remove = useCallback((productId) => dispatch({ type: 'removed', productId }), []);
  const clear = useCallback(() => dispatch({ type: 'cleared' }), []);

  const value = useMemo(
    () => ({ lines, total, count, loading, add, setQty, remove, clear }),
    [lines, total, count, loading, add, setQty, remove, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>');
  return context;
}
