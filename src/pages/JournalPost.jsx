import { Link, useParams } from 'react-router';
import { LoadError, Loading, PageIntro } from '../components/layout/Chrome';
import { formatDate } from '../utils/format';
import { useApi, useTitle } from '../utils/hooks';
import { getPostBySlug, getPostsByType } from '../utils/Models';
import NotFound from './NotFound';

export default function JournalPost() {
  const { blog_link } = useParams();
  const { data: post, loading, error, notFound } = useApi(() => getPostBySlug(blog_link), [blog_link]);
  const more = useApi(() => getPostsByType('blog', { limit: 4, sort: 'newest' }), []);
  useTitle(post?.title);

  if (notFound || (post && post.type !== 'blog')) return <NotFound />;
  if (error) return <div className="wrap"><LoadError /></div>;
  if (loading || !post) return <div className="wrap"><Loading /></div>;

  const others = (more.data?.data ?? []).filter((p) => p.id !== post.id).slice(0, 3);
  const gallery = post.metas?.gallery ?? [];

  return (
    <div className="wrap page">
      <article className="article">
        <PageIntro title={post.title} crumbs={[{ label: 'Journal', to: '/blog' }]}>
          <p className="caption article-meta">
            {formatDate(post.date)}
            {post.author && <> by {post.author}</>}
            {post.categories?.length > 0 && <>, in {post.categories.map((c) => c.title).join(' and ')}</>}
          </p>
        </PageIntro>

        <img className="article-hero" src={post.featured} alt="" width="1920" height="1170" />

        <div className="prose article-body">
          <p className="lead">{post.excerpt}</p>
          <p>{post.content}</p>
        </div>

        {gallery.length > 0 && (
          <div className="article-gallery">
            {gallery.map((src) => (
              <img key={src} src={src} alt="" loading="lazy" />
            ))}
          </div>
        )}
      </article>

      {others.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="heading">More from the journal</h2>
            <Link to="/blog" className="text-link">
              All articles
            </Link>
          </div>
          <div className="journal-row">
            {others.map((p) => (
              <article key={p.id} className="journal-card">
                <Link to={`/read_blog/${p.slug}`} className="journal-image" tabIndex={-1} aria-hidden="true">
                  <img src={p.featured} alt="" loading="lazy" width="1920" height="1170" />
                </Link>
                <p className="caption">{formatDate(p.date)}</p>
                <h3 className="journal-title">
                  <Link to={`/read_blog/${p.slug}`}>{p.title}</Link>
                </h3>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
