import { useEffect, useRef, useState } from 'react';
import { LoadError, Loading, PageIntro } from '../components/layout/Chrome';
import { useApi, useTitle } from '../utils/hooks';
import { getPage, getPostsByType } from '../utils/Models';

export default function Gallery() {
  const page = useApi(() => getPage('gallery'), []);
  const images = useApi(() => getPostsByType('gallery'), []);
  const [open, setOpen] = useState(null);
  const dialog = useRef(null);
  useTitle(page.data?.title || 'Gallery');

  const items = images.data?.data ?? [];

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open !== null && !el.open) el.showModal();
    if (open === null && el.open) el.close();
  }, [open]);

  const step = (delta) => setOpen((i) => (i + delta + items.length) % items.length);

  return (
    <div className="wrap page">
      <PageIntro title={page.data?.title || 'Gallery'} lead={page.data?.content} />

      {images.error ? (
        <LoadError />
      ) : images.loading ? (
        <Loading />
      ) : (
        <ul className="gallery">
          {items.map((item, i) => (
            <li key={item.id}>
              <button type="button" className="plain-button" onClick={() => setOpen(i)}>
                <img src={item.featured} alt={item.title} loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialog}
        className="lightbox"
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === dialog.current && setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1);
          if (e.key === 'ArrowLeft') step(-1);
        }}
      >
        {open !== null && items[open] && (
          <>
            <img src={items[open].featured} alt={items[open].title} />
            <div className="lightbox-bar">
              <button type="button" className="plain-button" onClick={() => step(-1)}>
                Previous
              </button>
              <span className="count">
                {open + 1} of {items.length}
              </span>
              <button type="button" className="plain-button" onClick={() => step(1)}>
                Next
              </button>
              <button type="button" className="plain-button" onClick={() => setOpen(null)} autoFocus>
                Close
              </button>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
