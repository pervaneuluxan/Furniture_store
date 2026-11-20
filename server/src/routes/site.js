import { Router } from 'express';
import { config } from '../config.js';
import { notFound } from '../errors.js';

export function siteRouter(db) {
  const router = Router();

  // GET /api/menus/main | /api/menus/footer — items with nested `subs`
  router.get('/menus/:location', (req, res) => {
    const rows = db
      .prepare(
        'SELECT id, parent_id, title, link FROM menu_items WHERE location = ? ORDER BY parent_id IS NOT NULL, position, id'
      )
      .all(req.params.location);
    if (rows.length === 0) throw notFound('Menu');

    const byId = new Map();
    const menu = [];
    for (const { id, parent_id, title, link } of rows) {
      const item = { id, title, link, subs: [] };
      byId.set(id, item);
      if (parent_id === null) menu.push(item);
      else byId.get(parent_id)?.subs.push(item);
    }
    res.json(menu);
  });

  // GET /api/translations?lang=en — UI strings as a { key: text } object
  router.get('/translations', (req, res) => {
    const lang = config.supportedLangs.includes(req.query.lang) ? req.query.lang : config.defaultLang;
    const rows = db.prepare('SELECT key, value FROM translations WHERE lang = ?').all(lang);
    res.json(Object.fromEntries(rows.map((r) => [r.key, r.value])));
  });

  return router;
}
