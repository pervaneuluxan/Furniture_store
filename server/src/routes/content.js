import { Router } from 'express';
import { HttpError, notFound } from '../errors.js';
import { getPostBySlug, getProductsByIds, listCategories, listPosts, SORT_KEYS } from '../services/posts.js';
import { idList, intParam } from '../validation.js';

const POST_TYPES = [
  'product',
  'blog',
  'slide',
  'partner',
  'gallery',
  'about-tab',
  'testimonial',
  'team-member',
  'address',
];
const CATEGORY_TYPES = ['product', 'blog'];

export function contentRouter(db) {
  const router = Router();

  // GET /api/posts?type=product&limit=8&page=1&sort=popular&category=chairs
  router.get('/posts', (req, res) => {
    const { type, sort = 'default', category } = req.query;
    if (!POST_TYPES.includes(type)) {
      throw new HttpError(400, `"type" must be one of: ${POST_TYPES.join(', ')}`);
    }
    if (!SORT_KEYS.includes(sort)) {
      throw new HttpError(400, `"sort" must be one of: ${SORT_KEYS.join(', ')}`);
    }
    res.json(
      listPosts(db, {
        type,
        sort,
        category: category || undefined,
        limit: intParam(req.query.limit, { name: 'limit', max: 100, fallback: 100 }),
        page: intParam(req.query.page, { name: 'page', fallback: 1 }),
      })
    );
  });

  // GET /api/posts/:slug — a single product, blog post, ... (counts a view)
  router.get('/posts/:slug', (req, res) => {
    const post = getPostBySlug(db, req.params.slug, { countView: true });
    if (!post) throw notFound('Post');
    res.json(post);
  });

  // GET /api/pages/:slug — static page content (titles, banners, intro text)
  router.get('/pages/:slug', (req, res) => {
    const page = getPostBySlug(db, req.params.slug, { type: 'page' });
    if (!page) throw notFound('Page');
    res.json(page);
  });

  // GET /api/products?ids=1,2,3 — products in the cart or wishlist
  router.get('/products', (req, res) => {
    const data = getProductsByIds(db, idList(req.query.ids));
    res.json({ data, total: data.length });
  });

  // GET /api/categories?type=product
  router.get('/categories', (req, res) => {
    const { type } = req.query;
    if (!CATEGORY_TYPES.includes(type)) {
      throw new HttpError(400, `"type" must be one of: ${CATEGORY_TYPES.join(', ')}`);
    }
    res.json(listCategories(db, type));
  });

  return router;
}
