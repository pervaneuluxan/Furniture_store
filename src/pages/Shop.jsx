import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import { LoadError, Loading, PageIntro } from '../components/layout/Chrome';
import ProductCard from '../components/ProductCard';
import { useApi, useTitle } from '../utils/hooks';
import { getCategories, getPage, getPostsByType } from '../utils/Models';

const PER_PAGE = 9;
const SORT_OPTIONS = [
  ['default', 'Featured'],
  ['newest', 'Newest'],
  ['popular', 'Most viewed'],
  ['price_asc', 'Price, low to high'],
  ['price_desc', 'Price, high to low'],
];

export default function Shop() {
  const { page } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get('category') || '';
  const sort = SORT_OPTIONS.some(([key]) => key === searchParams.get('sort')) ? searchParams.get('sort') : 'default';
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);

  const intro = useApi(() => getPage('shop'), []);
  const categories = useApi(() => getCategories('product'), []);
  const products = useApi(
    () => getPostsByType('product', { limit: PER_PAGE, page: currentPage, sort, category: category || undefined }),
    [currentPage, sort, category]
  );

  const activeCategory = categories.data?.find((c) => c.slug === category);
  useTitle(activeCategory ? activeCategory.title : 'Shop');

  // Keeps the active filters when changing page, and resets to page 1 when filters change.
  const shopUrl = ({ toPage = 1, toCategory = category, toSort = sort } = {}) => {
    const query = new URLSearchParams();
    if (toCategory) query.set('category', toCategory);
    if (toSort !== 'default') query.set('sort', toSort);
    const qs = query.toString();
    return `/shop${toPage > 1 ? `/${toPage}` : ''}${qs ? `?${qs}` : ''}`;
  };

  const total = products.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <div className="wrap page">
      <PageIntro
        title={activeCategory ? activeCategory.title : intro.data?.title || 'Shop'}
        lead={activeCategory ? null : intro.data?.content}
        crumbs={activeCategory ? [{ label: 'Shop', to: '/shop' }] : []}
      />

      <div className="filters">
        <nav aria-label="Categories">
          <ul className="filter-links">
            <li>
              <Link to={shopUrl({ toCategory: '' })} aria-current={category === '' ? 'true' : undefined}>
                All pieces
              </Link>
            </li>
            {(categories.data ?? []).map((c) => (
              <li key={c.slug}>
                <Link to={shopUrl({ toCategory: c.slug })} aria-current={category === c.slug ? 'true' : undefined}>
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <label className="sort">
          Sort by
          <select className="input" value={sort} onChange={(e) => navigate(shopUrl({ toSort: e.target.value }))}>
            {SORT_OPTIONS.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {products.error ? (
        <LoadError />
      ) : products.loading && !products.data ? (
        <Loading />
      ) : products.data.data.length === 0 ? (
        <div className="state notice">
          <p className="heading">Nothing in this category right now.</p>
          <p>
            <Link to="/shop" className="text-link">
              See all pieces
            </Link>
          </p>
        </div>
      ) : (
        <>
          <p className="caption result-count">
            {total} {total === 1 ? 'piece' : 'pieces'}
          </p>
          <div className="grid" aria-busy={products.loading}>
            {products.data.data.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}

      {pageCount > 1 && (
        <nav className="pager" aria-label="Pages">
          {currentPage > 1 && <Link to={shopUrl({ toPage: currentPage - 1 })}>Previous</Link>}
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <Link key={n} to={shopUrl({ toPage: n })} aria-current={n === currentPage ? 'page' : undefined}>
              {n}
            </Link>
          ))}
          {currentPage < pageCount && <Link to={shopUrl({ toPage: currentPage + 1 })}>Next</Link>}
        </nav>
      )}
    </div>
  );
}
