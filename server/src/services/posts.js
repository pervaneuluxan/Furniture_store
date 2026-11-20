import { priceInfo } from './pricing.js';

// Whitelisted sort orders. Clients pass the key, never raw SQL.
const SORTS = {
  default: 'p.position ASC, p.id ASC',
  newest: 'p.created_at DESC, p.id DESC',
  popular: 'p.views DESC, p.id ASC',
  price_asc: "CAST(json_extract(p.metas, '$.price') AS REAL) ASC, p.id ASC",
  price_desc: "CAST(json_extract(p.metas, '$.price') AS REAL) DESC, p.id ASC",
};
export const SORT_KEYS = Object.keys(SORTS);

function categoriesByPost(db, postIds) {
  const map = new Map(postIds.map((id) => [id, []]));
  if (postIds.length === 0) return map;

  const rows = db
    .prepare(
      `SELECT pc.post_id, c.id, c.slug, c.title
         FROM post_categories pc JOIN categories c ON c.id = pc.category_id
        WHERE pc.post_id IN (SELECT value FROM json_each(?))
        ORDER BY c.title`
    )
    .all(JSON.stringify(postIds));

  for (const { post_id, ...category } of rows) map.get(post_id).push(category);
  return map;
}

function toPost(row, categories = []) {
  const metas = JSON.parse(row.metas);
  const post = {
    id: row.id,
    type: row.type,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    featured: row.featured,
    author: row.author,
    author_image: row.author_image,
    date: row.created_at,
    views: row.views,
    metas,
    categories,
  };

  if (row.type === 'product') {
    const { unit_price, ...pricing } = priceInfo(metas);
    Object.assign(post, pricing, { stock: Number(metas.stock) || 0 });
  }
  return post;
}

function withCategories(db, rows) {
  const categories = categoriesByPost(db, rows.map((r) => r.id));
  return rows.map((row) => toPost(row, categories.get(row.id)));
}

export function listPosts(db, { type, limit, page, sort = 'default', category }) {
  const where = ['p.type = @type'];
  if (category) {
    where.push(`EXISTS (SELECT 1 FROM post_categories pc JOIN categories c ON c.id = pc.category_id
                        WHERE pc.post_id = p.id AND c.slug = @category)`);
  }
  const whereSql = where.join(' AND ');
  const params = { type, category, limit, offset: (page - 1) * limit };

  const { total } = db.prepare(`SELECT COUNT(*) AS total FROM posts p WHERE ${whereSql}`).get(params);
  const rows = db
    .prepare(`SELECT p.* FROM posts p WHERE ${whereSql} ORDER BY ${SORTS[sort]} LIMIT @limit OFFSET @offset`)
    .all(params);

  return { data: withCategories(db, rows), total, page, limit };
}

export function getPostBySlug(db, slug, { type, countView = false } = {}) {
  const row = type
    ? db.prepare('SELECT * FROM posts WHERE slug = ? AND type = ?').get(slug, type)
    : db.prepare("SELECT * FROM posts WHERE slug = ? AND type <> 'page'").get(slug);
  if (!row) return null;

  if (countView) {
    db.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').run(row.id);
    row.views += 1;
  }
  return withCategories(db, [row])[0];
}

export function getProductsByIds(db, ids) {
  const rows = db
    .prepare(
      `SELECT * FROM posts
        WHERE type = 'product' AND id IN (SELECT value FROM json_each(?))
        ORDER BY id`
    )
    .all(JSON.stringify(ids));
  return withCategories(db, rows);
}

export function listCategories(db, type) {
  return db.prepare('SELECT id, slug, title FROM categories WHERE type = ? ORDER BY title').all(type);
}
