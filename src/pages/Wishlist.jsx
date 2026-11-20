import { Link } from 'react-router';
import { LoadError, Loading, PageIntro } from '../components/layout/Chrome';
import ProductCard from '../components/ProductCard';
import { useGlobalContext } from '../utils/CartContext';
import { useApi, useTitle } from '../utils/hooks';
import { getBasket } from '../utils/Models';

export default function Wishlist() {
  const { wishlistIds, t } = useGlobalContext();
  const ids = wishlistIds.join(',');
  const title = t('saved_pieces', 'Saved');
  useTitle(title);

  const { data, loading, error } = useApi(
    () => (ids ? getBasket(ids) : Promise.resolve({ data: { data: [] } })),
    [ids]
  );
  // Unsaving a piece hides it straight away, without waiting for a refetch.
  const items = (data?.data ?? []).filter((item) => wishlistIds.includes(String(item.id)));

  return (
    <div className="wrap page">
      <PageIntro title={title} lead={items.length > 0 ? 'Pieces you saved to come back to.' : null} />
      {error ? (
        <LoadError />
      ) : loading && !data ? (
        <Loading />
      ) : items.length === 0 ? (
        <div className="notice">
          <p className="lead">{t('empty_saved', 'You haven’t saved any pieces yet.')}</p>
          <Link to="/shop" className="button">
            {t('browse_shop', 'Browse the shop')}
          </Link>
        </div>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
