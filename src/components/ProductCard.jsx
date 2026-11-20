import { Link } from 'react-router';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/format';

export function Price({ item }) {
  if (item.has_discount) {
    return (
      <span className="price price--sale">
        <span className="price-now">
          <span className="dot" aria-hidden="true" />
          <span className="visually-hidden">Sale price </span>
          {formatPrice(item.discount_price)}
        </span>
        <del>
          <span className="visually-hidden">was </span>
          {formatPrice(item.price)}
        </del>
      </span>
    );
  }
  return <span className="price">{formatPrice(item.price)}</span>;
}

/** A product shown like an exhibit: the photo on its plinth, a label underneath. */
export default function ProductCard({ item }) {
  const { add } = useCart();
  const { isSaved, toggle } = useWishlist();
  const { t } = useLanguage();
  const href = `/shop_item/${item.slug}`;
  const saved = isSaved(item.id);
  const soldOut = item.stock < 1;
  const meta = item.metas?.materials || item.categories?.map((c) => c.title).join(', ');

  return (
    <article className="piece">
      <Link to={href} className="piece-image" tabIndex={-1} aria-hidden="true">
        <img src={item.featured} alt="" loading="lazy" width="600" height="600" />
      </Link>
      <div className="piece-label">
        <h3 className="piece-title">
          <Link to={href}>{item.title}</Link>
        </h3>
        <span className="piece-price">
          <Price item={item} />
        </span>
        {meta && <p className="piece-meta">{meta}</p>}
      </div>
      <div className="piece-actions">
        <button type="button" onClick={() => add(item.id, 1)} disabled={soldOut}>
          {soldOut ? t('sold_out', 'Sold out') : t('add_to_cart', 'Add to cart')}
        </button>
        <button type="button" aria-pressed={saved} onClick={() => toggle(item.id)}>
          {saved ? t('saved', 'Saved') : t('save', 'Save')}
        </button>
      </div>
    </article>
  );
}
