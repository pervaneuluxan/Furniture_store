import { Link } from 'react-router';
import { useGlobalContext } from '../utils/CartContext';
import { useTitle } from '../utils/hooks';

export default function NotFound() {
  const { t } = useGlobalContext();
  useTitle('Not found');
  return (
    <div className="wrap page">
      <div className="state notice">
        <h1 className="title">{t('page_not_found', 'This page isn’t on display.')}</h1>
        <p className="lead">The link may be old, or the piece may have left the showroom.</p>
        <p>
          <Link to="/" className="button">
            {t('back_home', 'Go to the homepage')}
          </Link>{' '}
          <Link to="/shop" className="button button--ghost">
            {t('browse_shop', 'Browse the shop')}
          </Link>
        </p>
      </div>
    </div>
  );
}
