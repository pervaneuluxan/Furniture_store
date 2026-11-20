import { useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

/** Scrolls to the top on every page change (but not on filter changes within a page). */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

/** Short confirmation shown after an action such as adding to the cart. */
export function Toast() {
  const { toast } = useToast();
  if (!toast) return null;
  return (
    <div className="toast" role="status" key={toast.id}>
      {toast.message}
      {toast.link && <Link to={toast.link.to}>{toast.link.label}</Link>}
    </div>
  );
}

/** Page heading with breadcrumbs and an optional lead paragraph. */
export function PageIntro({ title, lead, crumbs = [], children }) {
  const { t } = useLanguage();
  return (
    <header className="intro">
      <nav aria-label="Breadcrumb">
        <ol className="crumbs">
          <li>
            <Link to="/">{t('home_title', 'Home')}</Link>
          </li>
          {crumbs.map((crumb) => (
            <li key={crumb.label}>{crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : crumb.label}</li>
          ))}
        </ol>
      </nav>
      <h1 className="title">{title}</h1>
      {lead && <p className="lead">{lead}</p>}
      {children}
    </header>
  );
}

export function Loading() {
  return <p className="loading state">Loading…</p>;
}

export function LoadError() {
  return (
    <div className="state notice">
      <h2 className="heading">This couldn’t be loaded.</h2>
      <p className="caption">The store server didn’t respond. Check your connection and reload the page.</p>
    </div>
  );
}
