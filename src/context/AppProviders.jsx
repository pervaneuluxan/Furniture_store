import { CartProvider } from './CartContext';
import { LanguageProvider } from './LanguageContext';
import { ToastProvider } from './ToastContext';
import { WishlistProvider } from './WishlistContext';

/** Order matters: the cart uses language (for messages) and toasts. */
export default function AppProviders({ children }) {
  return (
    <LanguageProvider>
      <ToastProvider>
        <WishlistProvider>
          <CartProvider>{children}</CartProvider>
        </WishlistProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
