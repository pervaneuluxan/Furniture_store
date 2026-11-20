import { Link } from 'react-router';
import { Loading, PageIntro } from '../components/layout/Chrome';
import { Price } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/format';
import { useTitle } from '../utils/hooks';

export default function Cart() {
  const { lines: cart, loading: cartLoading, total, setQty, remove } = useCart();
  const { t } = useLanguage();
  useTitle(t('cart', 'Cart'));

  return (
    <div className="wrap page">
      <PageIntro title={t('cart', 'Cart')} />

      {cartLoading && cart.length === 0 ? (
        <Loading />
      ) : cart.length === 0 ? (
        <div className="notice">
          <p className="lead">{t('empty_cart', 'Your cart is empty.')}</p>
          <Link to="/shop" className="button">
            {t('browse_shop', 'Browse the shop')}
          </Link>
        </div>
      ) : (
        <div className="checkout-layout">
          <ul className="line-items">
            {cart.map((item) => (
              <li key={item.id} className="line-item">
                <Link to={`/shop_item/${item.link}`} className="line-image" tabIndex={-1} aria-hidden="true">
                  <img src={item.featured} alt="" width="120" height="120" />
                </Link>
                <div className="line-info">
                  <h2 className="piece-title">
                    <Link to={`/shop_item/${item.link}`}>{item.title}</Link>
                  </h2>
                  <p className="caption">
                    <Price item={item} />
                  </p>
                  {item.stock < 1 && <p className="field-error">{t('sold_out', 'Sold out')}</p>}
                </div>
                <label className="line-qty">
                  <span className="visually-hidden">
                    {t('quantity', 'Quantity')}, {item.title}
                  </span>
                  <input
                    type="number"
                    className="qty"
                    min="1"
                    max={Math.max(item.stock, 1)}
                    value={item.qty}
                    onChange={(e) => setQty(item.id, Math.min(parseInt(e.target.value, 10) || 1, item.stock))}
                  />
                </label>
                <p className="line-sum price">{formatPrice(item.sum)}</p>
                <button type="button" className="plain-button line-remove caption" onClick={() => remove(item.id)}>
                  {t('remove', 'Remove')}
                  <span className="visually-hidden"> {item.title}</span>
                </button>
              </li>
            ))}
          </ul>

          <aside className="summary" aria-label="Order summary">
            <dl>
              <div>
                <dt>{t('subtotal', 'Subtotal')}</dt>
                <dd className="price">{formatPrice(total)}</dd>
              </div>
              <div>
                <dt>{t('shipping', 'Delivery')}</dt>
                <dd>{t('shipping_free', 'Free')}</dd>
              </div>
              <div className="summary-total">
                <dt>{t('total', 'Total')}</dt>
                <dd className="price">{formatPrice(total)}</dd>
              </div>
            </dl>
            <Link to="/checkout" className="button button--block">
              {t('checkout', 'Checkout')}
            </Link>
            <Link to="/shop" className="text-link">
              {t('return_to_shop', 'Return to shop')}
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
