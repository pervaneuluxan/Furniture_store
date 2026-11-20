import { useState } from 'react';
import { Link } from 'react-router';
import ProductCard from '../components/ProductCard';
import { useGlobalContext } from '../utils/CartContext';
import { formatDate } from '../utils/format';
import { useApi, useTitle } from '../utils/hooks';
import { getPage, getPostsByType } from '../utils/Models';

function Hero() {
  const { data } = useApi(() => getPostsByType('slide'), []);
  const [index, setIndex] = useState(0);
  const slides = data?.data ?? [];

  if (slides.length === 0) return <section className="hero hero--empty" aria-hidden="true" />;

  const slide = slides[index % slides.length];
  const go = (step) => setIndex((i) => (i + step + slides.length) % slides.length);

  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Featured rooms">
      <div className="hero-stage">
        {slides.map((s, i) => (
          <img
            key={s.id}
            src={s.featured}
            alt=""
            className="hero-image"
            data-active={i === index % slides.length}
            width="1500"
            height="930"
          />
        ))}
      </div>
      <div className="hero-text" aria-live="polite">
        <h1 className="hero-title">{slide.title}</h1>
        <div className="hero-caption">
          <p>{slide.excerpt}</p>
          <Link to="/shop" className="text-link">
            Shop the collection
          </Link>
        </div>
      </div>
      {slides.length > 1 && (
        <div className="hero-controls">
          <button type="button" className="plain-button" onClick={() => go(-1)}>
            Previous
          </button>
          <span className="count">
            {(index % slides.length) + 1} of {slides.length}
          </span>
          <button type="button" className="plain-button" onClick={() => go(1)}>
            Next
          </button>
        </div>
      )}
    </section>
  );
}

function OnView() {
  const { t } = useGlobalContext();
  const { data } = useApi(() => getPostsByType('product', { limit: 6, sort: 'popular' }), []);
  const products = data?.data ?? [];

  return (
    <section className="section">
      <div className="section-head">
        <h2 className="heading">{t('in_showroom', 'In the showroom')}</h2>
        <Link to="/shop" className="text-link">
          {t('view_all', 'See every piece')}
        </Link>
      </div>
      <div className="grid">
        {products.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function AboutBand() {
  const { data: page } = useApi(() => getPage('about'), []);
  if (!page) return null;
  return (
    <section className="section band">
      <img src="/assets/images/about_dispatch_img.jpg" alt="" className="band-image" width="800" height="466" loading="lazy" />
      <div className="band-text">
        <h2 className="heading">{page.title}</h2>
        <p className="caption">{page.content}</p>
        <Link to="/about" className="text-link">
          How we work
        </Link>
      </div>
    </section>
  );
}

function LatestJournal() {
  const { data } = useApi(() => getPostsByType('blog', { limit: 3, sort: 'newest' }), []);
  const posts = data?.data ?? [];
  if (posts.length === 0) return null;

  return (
    <section className="section">
      <div className="section-head">
        <h2 className="heading">From the journal</h2>
        <Link to="/blog" className="text-link">
          All articles
        </Link>
      </div>
      <div className="journal-row">
        {posts.map((post) => (
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
    </section>
  );
}

function Partners() {
  const { data } = useApi(() => getPostsByType('partner'), []);
  const partners = data?.data ?? [];
  if (partners.length === 0) return null;

  return (
    <section className="section partners" aria-labelledby="partners-title">
      <h2 id="partners-title" className="caption">
        Makers we work with
      </h2>
      <ul>
        {partners.map((p) => (
          <li key={p.id}>
            <img src={p.featured} alt={p.title} loading="lazy" />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  useTitle('');
  return (
    <div className="wrap page page--home">
      <Hero />
      <OnView />
      <AboutBand />
      <LatestJournal />
      <Partners />
    </div>
  );
}
