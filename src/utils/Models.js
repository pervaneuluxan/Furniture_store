// Thin client for the store REST API (see server/README.md). Every function
// returns the axios response, so callers read the payload from `res.data`.
import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

const currentLang = () => window.localStorage.getItem('default_lang') || 'en';

/** Lists posts of one type: product, blog, slide, partner, gallery, ... → { data, total } */
export const getPostsByType = (type, { limit, page, sort, category } = {}) =>
  http.get('/posts', { params: { type, limit, page, sort, category } });

/** A single product or blog post by its slug. */
export const getPostBySlug = (slug) => http.get(`/posts/${encodeURIComponent(slug)}`);

/** A static page (about, cart, checkout, contact, ...) by its slug. */
export const getPage = (slug) => http.get(`/pages/${encodeURIComponent(slug)}`);

/** A navigation menu: "main" or "footer". Items carry nested `subs`. */
export const getMenu = (location) => http.get(`/menus/${encodeURIComponent(location)}`);

/** Categories for "product" or "blog". */
export const getCategories = (type) => http.get('/categories', { params: { type } });

/** UI strings for the selected language as { key: text }. */
export const getTranslate = () => http.get('/translations', { params: { lang: currentLang() } });

/** Products by id (cart and wishlist) → { data, total } */
export const getBasket = (ids) => http.get('/products', { params: { ids } });

export const sendContactMessage = ({ name, email, phone, message }) =>
  http.post('/contact', { name, email, phone, message });

/** items: [{ productId, qty }]. The server prices the order and checks stock. */
export const placeOrder = (customer, items) => http.post('/orders', { customer, items });

/** The server's error message for a failed request, or a generic fallback. */
export const apiErrorMessage = (error) =>
  error?.response?.data?.error || 'Something went wrong. Please try again.';
