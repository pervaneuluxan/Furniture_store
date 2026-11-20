import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { useGlobalContext } from '../../utils/CartContext';
import { getMenu } from '../../utils/Models';
import Logo from '../Logo';

const FALLBACK_MENU = [
  { id: 'shop', title: 'Shop', link: '/shop' },
  { id: 'gallery', title: 'Gallery', link: '/gallery' },
  { id: 'journal', title: 'Journal', link: '/blog' },
  { id: 'about', title: 'About', link: '/about' },
  { id: 'visit', title: 'Visit', link: '/contact' },
];

// Older databases store the gallery as /galery and include a Home item.
const normaliseMenu = (items) =>
  items
    .filter((item) => item.link !== '/')
    .map((item) => ({ ...item, link: item.link === '/galery' ? '/gallery' : item.link }));

export default function Header() {
  const { cartCount, wishlistIds, lang, setLang, t } = useGlobalContext();
  const [menu, setMenu] = useState(FALLBACK_MENU);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    getMenu('main')
      .then((res) => res.data.length && setMenu(normaliseMenu(res.data)))
      .catch(() => {});
  }, []);

  // Close the mobile menu after navigating.
  useEffect(() => setOpen(false), [location.pathname, location.search]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const navClass = ({ isActive }) => (isActive ? 'active' : undefined);
  const savedLabel = t('saved_pieces', 'Saved');

  return (
    <header className="site-header">
      <div className="wrap">
        <Link to="/" className="wordmark" aria-label="Depot, home">
          <Logo />
        </Link>

        <nav className="main-nav" aria-label="Main">
          {menu.map((item) => (
            <NavLink key={item.id} to={item.link} className={navClass}>
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className="header-tools">
          <Link to="/wishlist" className="saved-link">
            {savedLabel} {wishlistIds.length > 0 && <span className="count">{wishlistIds.length}</span>}
          </Link>
          <Link to="/cart" className="cart-link" aria-label={`${t('cart', 'Cart')}, ${cartCount}`}>
            {t('cart', 'Cart')}
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Language"
          >
            <option value="az">AZ</option>
            <option value="en">EN</option>
          </select>
          <button
            type="button"
            className="plain-button menu-button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <div id="mobile-nav" className="mobile-nav" hidden={!open}>
        <ul>
          {menu.map((item) => (
            <li key={item.id}>
              <NavLink to={item.link}>{item.title}</NavLink>
            </li>
          ))}
        </ul>
        <ul className="secondary">
          <li>
            <Link to="/wishlist">
              {savedLabel} ({wishlistIds.length})
            </Link>
          </li>
          <li>
            <select
              className="input"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Language"
            >
              <option value="az">Azərbaycanca</option>
              <option value="en">English</option>
            </select>
          </li>
        </ul>
      </div>
    </header>
  );
}
