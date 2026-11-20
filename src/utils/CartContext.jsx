import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getBasket, getTranslate } from './Models';

const AppContext = createContext(null);

const BASKET_KEY = 'basket';
const WISHLIST_KEY = 'wishlist';

// localStorage holds { [productId]: qty } for the cart and { [productId]: productId }
// for the wishlist; product details always come fresh from the API.
const readStore = (key) => {
  try {
    return JSON.parse(window.localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
};
const writeStore = (key, value) => window.localStorage.setItem(key, JSON.stringify(value));

const AppProvider = ({ children }) => {
  const [translate, setTranslate] = useState({});
  const [cart, setCart] = useState([]);
  const [basketVersion, setBasketVersion] = useState(0);

  const refreshBasket = useCallback(() => setBasketVersion((v) => v + 1), []);

  useEffect(() => {
    getTranslate()
      .then((res) => setTranslate(res.data))
      .catch(() => setTranslate({}));
  }, []);

  useEffect(() => {
    const basket = readStore(BASKET_KEY);
    const ids = Object.keys(basket).join(',');
    if (!ids) {
      setCart([]);
      return;
    }

    let cancelled = false;
    getBasket(ids)
      .then((res) => {
        if (cancelled) return;
        setCart(
          res.data.data.map((row) => {
            const qty = Number(basket[row.id]) || 1;
            const unitPrice = row.has_discount ? row.discount_price : row.price;
            return {
              id: row.id,
              title: row.title,
              featured: row.featured,
              excerpt: row.excerpt,
              metas: row.metas,
              link: row.slug,
              date: row.date,
              has_discount: row.has_discount,
              price: row.price,
              discount_price: row.discount_price,
              stock: row.stock,
              qty,
              sum: Math.round(unitPrice * qty * 100) / 100,
            };
          })
        );
      })
      .catch(() => !cancelled && setCart([]));

    return () => {
      cancelled = true;
    };
  }, [basketVersion]);

  const total = useMemo(
    () => Math.round(cart.reduce((sum, item) => sum + item.sum, 0) * 100) / 100,
    [cart]
  );

  const addBasket = useCallback(
    (productId, count) => {
      writeStore(BASKET_KEY, { ...readStore(BASKET_KEY), [productId]: Number(count) || 1 });
      refreshBasket();
    },
    [refreshBasket]
  );

  const updateItemCount = useCallback(
    (productId, e) => addBasket(productId, e.target.value),
    [addBasket]
  );

  const removeItem = useCallback(
    (productId) => {
      if (!window.confirm('Are you sure delete this?')) return;
      const basket = readStore(BASKET_KEY);
      delete basket[productId];
      writeStore(BASKET_KEY, basket);
      refreshBasket();
    },
    [refreshBasket]
  );

  const clearCart = useCallback(() => {
    window.localStorage.removeItem(BASKET_KEY);
    refreshBasket();
  }, [refreshBasket]);

  const addWishlist = useCallback((productId) => {
    writeStore(WISHLIST_KEY, { ...readStore(WISHLIST_KEY), [productId]: productId });
    alert('Product added to your wishlist');
  }, []);

  return (
    <AppContext.Provider
      value={{ translate, cart, total, addBasket, updateItemCount, removeItem, clearCart, addWishlist }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => useContext(AppContext);

export { AppContext, AppProvider };
