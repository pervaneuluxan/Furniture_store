import { useState } from 'react';
import { Link } from 'react-router';
import { Loading, PageIntro } from '../components/layout/Chrome';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/format';
import { useTitle } from '../utils/hooks';
import { apiErrorMessage, placeOrder } from '../utils/Models';

const EMPTY = { firstName: '', lastName: '', email: '', phone: '', company: '', country: 'Azerbaijan', postCode: '' };

const FIELDS = [
  ['firstName', 'First name', { autoComplete: 'given-name' }],
  ['lastName', 'Last name', { autoComplete: 'family-name' }],
  ['email', 'Email', { type: 'email', autoComplete: 'email' }],
  ['phone', 'Phone', { type: 'tel', autoComplete: 'tel' }],
  ['country', 'Country', { autoComplete: 'country-name' }],
  ['postCode', 'Postcode', { autoComplete: 'postal-code' }],
  ['company', 'Company (optional)', { autoComplete: 'organization', optional: true, span: true }],
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};
  for (const [name, label, opts] of FIELDS) {
    if (!opts.optional && !values[name].trim()) errors[name] = `Enter your ${label.toLowerCase()}.`;
  }
  if (!errors.email && !EMAIL_RE.test(values.email.trim())) errors.email = 'Enter an email like name@example.com.';
  return errors;
}

export default function Checkout() {
  const { lines: cart, loading: cartLoading, total, clear: clearCart } = useCart();
  const { t } = useLanguage();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [order, setOrder] = useState(null);
  useTitle(t('checkout', 'Checkout'));

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    setSubmitting(true);
    setServerError('');
    placeOrder(values, cart.map((item) => ({ productId: item.id, qty: item.qty })))
      .then((res) => {
        setOrder(res.data);
        clearCart();
        setValues(EMPTY);
        window.scrollTo({ top: 0 });
      })
      .catch((error) => setServerError(apiErrorMessage(error)))
      .finally(() => setSubmitting(false));
  };

  if (order) {
    return (
      <div className="wrap page">
        <PageIntro title="Thank you" crumbs={[{ label: t('checkout', 'Checkout') }]} />
        <div className="notice">
          <p className="lead">
            Order {order.id} is confirmed. The total is {formatPrice(order.total)}, and we’ll contact you to arrange
            payment and delivery.
          </p>
          <Link to="/shop" className="button">
            {t('return_to_shop', 'Return to shop')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap page">
      <PageIntro title={t('checkout', 'Checkout')} crumbs={[{ label: t('cart', 'Cart'), to: '/cart' }]} />

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
          <form id="order-form" className="checkout-form" onSubmit={onSubmit} noValidate>
            <h2 className="heading">Your details</h2>
            <div className="form-grid">
              {FIELDS.map(([name, label, { optional, span, ...attrs }]) => (
                <div key={name} className={`field${span ? ' span-2' : ''}`}>
                  <label htmlFor={name}>{label}</label>
                  <input
                    id={name}
                    name={name}
                    className="input"
                    value={values[name]}
                    onChange={onChange}
                    aria-invalid={errors[name] ? 'true' : undefined}
                    aria-describedby={errors[name] ? `${name}-error` : undefined}
                    required={!optional}
                    {...attrs}
                  />
                  {errors[name] && (
                    <span id={`${name}-error`} className="field-error">
                      {errors[name]}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="caption checkout-note">
              Delivery is free. We’ll contact you after you order to arrange payment and a delivery time.
            </p>
          </form>

          <aside className="summary" aria-label="Order summary">
            <ul className="summary-items">
              {cart.map((item) => (
                <li key={item.id}>
                  <span>
                    {item.title} <span className="caption">× {item.qty}</span>
                  </span>
                  <span className="price">{formatPrice(item.sum)}</span>
                </li>
              ))}
            </ul>
            <dl>
              <div>
                <dt>{t('shipping', 'Delivery')}</dt>
                <dd>{t('shipping_free', 'Free')}</dd>
              </div>
              <div className="summary-total">
                <dt>{t('total', 'Total')}</dt>
                <dd className="price">{formatPrice(total)}</dd>
              </div>
            </dl>
            {serverError && (
              <p className="field-error" role="alert">
                {serverError}
              </p>
            )}
            <button type="submit" form="order-form" className="button button--block" disabled={submitting}>
              {submitting ? t('placing_order', 'Placing order…') : t('place_order', 'Place order')}
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
