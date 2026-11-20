import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);

/** Short confirmation messages, e.g. after adding a piece to the cart. */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef();

  const notify = useCallback((message, link) => {
    clearTimeout(timer.current);
    setToast({ message, link, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const value = useMemo(() => ({ toast, notify }), [toast, notify]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>');
  return context;
}
