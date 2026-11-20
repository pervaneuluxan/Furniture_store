import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { LoadError, Loading } from '../components/layout/Chrome';
import ProductCard, { Price } from '../components/ProductCard';
import { useGlobalContext } from '../utils/CartContext';
import { useApi, useTitle } from '../utils/hooks';
import { getPostBySlug, getPostsByType } from '../utils/Models';
import NotFound from './NotFound';

export default function Product() {
  const { item_link } = useParams();
  const { addBasket, toggleWishlist, isSaved, t } = useGlobalContext();
  const { data: product, loading, error, notFound } = useApi(() => getPostBySlug(item_link), [item_link]);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setQty(1);
    setActiveImage(0);
  }, [item_link]);

  const category = product?.categories?.[0];
  const related = useApi(
    () =>
      category
        ? getPostsByType('product', { limit: 4, category: category.slug, sort: 'popular' })
        : Promise.resolve({ data: { data: [] } }),
    [category?.slug]
  );

  useTitle(product?.title);

  if (notFound || (product && product.type !== 'product')) return <NotFound />;
  if (error) return <div className="wrap"><LoadError /></div>;
  if (loading || !product) return <div className="wrap"><Loading /></div>;

  const { metas } = product;
  const images = [product.featured, ...(metas.images ?? [])].filter(Boolean);
  const soldOut = product.stock < 1;
  const saved = isSaved(product.id);
  const relatedItems = (related.data?.data ?? []).filter((p) => p.id !== product.id).slice(0, 3);

  const details = [
    [t('materials', 'Materials'), metas.materials],
    [t('dimensions', 'Dimensions'), metas.dimensions],
    [t('weight', 'Weight'), metas.weight ? `${metas.weight} kg` : null],
  ].filter(([, value]) => value);

  const addToCart = (e) => {
    e.preventDefault();
    addBasket(product.id, Math.min(Math.max(qty, 1), product.stock));
  };

  return (
    <div className="wrap page">
      <nav aria-label="Breadcrumb" className="intro intro--tight">
        <ol className="crumbs">
          <li>
            <Link to="/">{t('home_title', 'Home')}</Link>
          </li>
          <li>
            <Link to="/shop">Shop</Link>
          </li>
          {category && (
            <li>
              <Link to={`/shop?category=${category.slug}`}>{category.title}</Link>
            </li>
          )}
        </ol>
      </nav>

      <div className="exhibit">
        <div className="exhibit-media">
          <div className="exhibit-image">
            <img src={images[activeImage]} alt={product.title} width="1125" height="1125" />
          </div>
          {images.length > 1 && (
            <ul className="exhibit-thumbs">
              {images.map((src, i) => (
                <li key={src}>
                  <button type="button" aria-pressed={i === activeImage} onClick={() => setActiveImage(i)}>
                    <img src={src} alt={`View ${i + 1}`} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="exhibit-label">
          <h1 className="title">{product.title}</h1>
          <p className="exhibit-price">
            <Price item={product} />
          </p>
          <p className="exhibit-excerpt">{product.excerpt}</p>

          {details.length > 0 && (
            <dl className="details">
              {details.map(([term, value]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}

          <form className="buy" onSubmit={addToCart}>
            {soldOut ? (
              <p className="stock-note">{t('sold_out', 'Sold out')}</p>
            ) : (
              <>
                <label className="field">
                  <span className="caption">{t('quantity', 'Quantity')}</span>
                  <input
                    type="number"
                    className="qty"
                    min="1"
                    max={product.stock}
                    value={qty}
                    onChange={(e) => setQty(Math.min(Math.max(parseInt(e.target.value, 10) || 1, 1), product.stock))}
                  />
                </label>
                <button type="submit" className="button">
                  {t('add_to_cart', 'Add to cart')}
                </button>
              </>
            )}
            <button
              type="button"
              className="button button--ghost"
              aria-pressed={saved}
              onClick={() => toggleWishlist(product.id)}
            >
              {saved ? t('saved', 'Saved') : t('save', 'Save')}
            </button>
          </form>
          {!soldOut && product.stock <= 3 && (
            <p className="stock-note">{t('only_left', 'Only {n} left', { n: product.stock })}</p>
          )}
        </div>
      </div>

      {product.content && (
        <section className="section exhibit-story">
          <h2 className="heading">About this piece</h2>
          <div className="prose caption">
            <p>{product.content}</p>
          </div>
        </section>
      )}

      {relatedItems.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="heading">More {category.title.toLowerCase()}</h2>
            <Link to={`/shop?category=${category.slug}`} className="text-link">
              See all
            </Link>
          </div>
          <div className="grid">
            {relatedItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
