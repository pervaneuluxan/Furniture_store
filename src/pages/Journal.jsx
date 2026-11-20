import { Link, useParams } from 'react-router';
import { LoadError, Loading, PageIntro } from '../components/layout/Chrome';
import { formatDate } from '../utils/format';
import { useApi, useTitle } from '../utils/hooks';
import { getPage, getPostsByType } from '../utils/Models';

const PER_PAGE = 6;

export default function Journal() {
  const { page } = useParams();
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const intro = useApi(() => getPage('blog'), []);
  const posts = useApi(() => getPostsByType('blog', { limit: PER_PAGE, page: currentPage, sort: 'newest' }), [currentPage]);
  useTitle(intro.data?.title || 'Journal');

  const pageCount = Math.max(1, Math.ceil((posts.data?.total ?? 0) / PER_PAGE));
  const pageUrl = (n) => (n > 1 ? `/blog/${n}` : '/blog');
  const [first, ...rest] = posts.data?.data ?? [];

  return (
    <div className="wrap page">
      <PageIntro title={intro.data?.title || 'Journal'} lead={intro.data?.content} />

      {posts.error ? (
        <LoadError />
      ) : posts.loading && !posts.data ? (
        <Loading />
      ) : !first ? (
        <p className="lead">No articles yet.</p>
      ) : (
        <>
          {currentPage === 1 ? (
            <article className="feature-post">
              <Link to={`/read_blog/${first.slug}`} className="feature-image" tabIndex={-1} aria-hidden="true">
                <img src={first.featured} alt="" width="1920" height="1170" />
              </Link>
              <div>
                <p className="caption">{formatDate(first.date)}</p>
                <h2 className="heading">
                  <Link to={`/read_blog/${first.slug}`}>{first.title}</Link>
                </h2>
                <p className="caption feature-excerpt">{first.excerpt}</p>
                <Link to={`/read_blog/${first.slug}`} className="text-link">
                  Read the article
                </Link>
              </div>
            </article>
          ) : null}
          <div className="journal-row journal-row--grid">
            {(currentPage === 1 ? rest : posts.data.data).map((post) => (
              <article key={post.id} className="journal-card">
                <Link to={`/read_blog/${post.slug}`} className="journal-image" tabIndex={-1} aria-hidden="true">
                  <img src={post.featured} alt="" loading="lazy" width="1920" height="1170" />
                </Link>
                <p className="caption">{formatDate(post.date)}</p>
                <h3 className="journal-title">
                  <Link to={`/read_blog/${post.slug}`}>{post.title}</Link>
                </h3>
              </article>
            ))}
          </div>
        </>
      )}

      {pageCount > 1 && (
        <nav className="pager" aria-label="Pages">
          {currentPage > 1 && <Link to={pageUrl(currentPage - 1)}>Previous</Link>}
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <Link key={n} to={pageUrl(n)} aria-current={n === currentPage ? 'page' : undefined}>
              {n}
            </Link>
          ))}
          {currentPage < pageCount && <Link to={pageUrl(currentPage + 1)}>Next</Link>}
        </nav>
      )}
    </div>
  );
}
