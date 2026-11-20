import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getBasket, getTranslate } from './Models';

const AppContext = createContext(null);

const BASKET_KEY = 'basket';
const WISHLIST_KEY = 'wishlist';
const LANG_KEY = 'default_lang';

// localStorage holds { [productId]: qty } for the cart and { [productId]: productId }
// for saved pieces; product details always come fresh from the API.
const readStore = (key) => {
  try {
    const value = JSON.parse(window.localStorage.getItem(key));
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
};
const writeStore = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode); the session still works.
  }
};

const LANGS = ['en', 'az'];
const readLang = () => {
  try {
    // Older versions stored the value JSON-encoded ("\"en\"").
    const stored = (window.localStorage.getItem(LANG_KEY) || '').replace(/"/g, '');
    return LANGS.includes(stored) ? stored : 'en';
  } catch {
    return 'en';
  }
};

const roundMoney = (n) => Math.round(n * 100) / 100;

const AppProvider = ({ children }) => {
  const [lang, setLangState] = useState(readLang);
  const [translate, setTranslate] = useState({});
  const [basket, setBasket] = useState(() => readStore(BASKET_KEY));
  const [wishlist, setWishlist] = useState(() => readStore(WISHLIST_KEY));
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  useEffect(() => {
    try {
      window.localStorage.setItem(LANG_KEY, lang);
    } catch {
      // ignore unavailable storage
    }
    document.documentElement.lang = lang;
    getTranslate()
      .then((res) => setTranslate(res.data))
      .catch(() => setTranslate({}));
  }, [lang]);

  // Keep tabs in sync: a change in another tab updates this one.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === BASKET_KEY) setBasket(readStore(BASKET_KEY));
      if (e.key === WISHLIST_KEY) setWishlist(readStore(WISHLIST_KEY));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const basketIds = Object.keys(basket).join(',');

  // Product details are only refetched when the set of products changes;
  // quantity changes are applied locally.
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (!basketIds) {
      setProducts([]);
      setCartLoading(false);
      return;
    }
    let current = true;
    setCartLoading(true);
    getBasket(basketIds)
      .then((res) => current && setProducts(res.data.data))
      .catch(() => current && setProducts([]))
      .finally(() => current && setCartLoading(false));
    return () => {
      current = false;
    };
  }, [basketIds]);

  useEffect(() => {
    setCart(
      products
        .filter((row) => basket[row.id] !== undefined)
        .map((row) => {
          const qty = Math.min(Math.max(Number(basket[row.id]) || 1, 1), Math.max(row.stock, 1));
          const unitPrice = row.has_discount ? row.discount_price : row.price;
          return {
            id: row.id,
            title: row.title,
            featured: row.featured,
            link: row.slug,
            metas: row.metas,
            has_discount: row.has_discount,
            price: row.price,
            discount_price: row.discount_price,
            unit_price: unitPrice,
            stock: row.stock,
            qty,
            sum: roundMoney(unitPrice * qty),
          };
        })
    );
  }, [products, basket]);

  const total = useMemo(() => roundMoney(cart.reduce((sum, item) => sum + item.sum, 0)), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);

  const t = useCallback(
    (key, fallback, vars) => {
      let text = translate[key] ?? fallback ?? key;
      for (const [name, value] of Object.entries(vars ?? {})) text = text.replace(`{${name}}`, value);
      return text;
    },
    [translate]
  );

  const notify = useCallback((message, link) => {
    clearTimeout(toastTimer.current);
    setToast({ message, link, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  const updateBasket = useCallback((update) => {
    setBasket((prev) => {
      const next = update({ ...prev });
      writeStore(BASKET_KEY, next);
      return next;
    });
  }, []);

  /** Adds `qty` more of a product to the cart. */
  const addBasket = useCallback(
    (productId, qty = 1) => {
      updateBasket((b) => ({ ...b, [productId]: (Number(b[productId]) || 0) + Math.max(Number(qty) || 1, 1) }));
      notify(t('added_to_cart', 'Added to your cart'), { to: '/cart', label: t('cart', 'Cart') });
    },
    [updateBasket, notify, t]
  );

  /** Sets the quantity of a product already in the cart. */
  const setItemQty = useCallback(
    (productId, qty) => {
      const value = Math.floor(Number(qty));
      if (!Number.isFinite(value) || value < 1) return;
      updateBasket((b) => ({ ...b, [productId]: value }));
    },
    [updateBasket]
  );

  const removeItem = useCallback(
    (productId) =>
      updateBasket((b) => {
        delete b[productId];
        return b;
      }),
    [updateBasket]
  );

  const clearCart = useCallback(() => updateBasket(() => ({})), [updateBasket]);

  const isSaved = useCallback((productId) => wishlist[productId] !== undefined, [wishlist]);

  const toggleWishlist = useCallback((productId) => {
    setWishlist((prev) => {
      const next = { ...prev };
      if (next[productId] !== undefined) delete next[productId];
      else next[productId] = productId;
      writeStore(WISHLIST_KEY, next);
      return next;
    });
  }, []);

  const value = {
    lang,
    setLang: setLangState,
    translate,
    t,
    cart,
    cartLoading,
    cartCount,
    total,
    addBasket,
    setItemQty,
    removeItem,
    clearCart,
    wishlistIds: Object.keys(wishlist),
    isSaved,
    toggleWishlist,
    toast,
    notify,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useGlobalContext = () => useContext(AppContext);

export { AppContext, AppProvider };
