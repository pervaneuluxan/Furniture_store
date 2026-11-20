import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import * as seed from './seed-data.js';

const schema = fs.readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'schema.sql'),
  'utf8'
);

/**
 * Opens (or creates) the SQLite database, applies the schema and fills an
 * empty database with starter content. Pass ':memory:' for a throwaway DB.
 */
export function openDatabase(dbPath) {
  if (dbPath !== ':memory:') fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(schema);

  const { count } = db.prepare('SELECT COUNT(*) AS count FROM posts').get();
  if (count === 0) seedDatabase(db);

  return db;
}

export function seedDatabase(db) {
  const insertPost = db.prepare(`
    INSERT INTO posts (type, slug, title, excerpt, content, featured, author, author_image, metas, views, position, created_at)
    VALUES (@type, @slug, @title, @excerpt, @content, @featured, @author, @author_image, @metas, @views, @position,
            COALESCE(@created_at, datetime('now')))
  `);
  const insertCategory = db.prepare('INSERT INTO categories (type, slug, title) VALUES (?, ?, ?)');
  const linkCategory = db.prepare(`
    INSERT INTO post_categories (post_id, category_id)
    SELECT ?, id FROM categories WHERE type = ? AND slug = ?
  `);
  const insertMenu = db.prepare(
    'INSERT INTO menu_items (location, parent_id, title, link, position) VALUES (?, ?, ?, ?, ?)'
  );
  const insertTranslation = db.prepare('INSERT INTO translations (lang, key, value) VALUES (?, ?, ?)');

  const addPost = (type, post, position) => {
    const { lastInsertRowid } = insertPost.run({
      type,
      slug: post.slug ?? `${type}-${position + 1}`,
      title: post.title,
      excerpt: post.excerpt ?? '',
      content: post.content ?? '',
      featured: post.featured ?? null,
      author: post.author ?? null,
      author_image: post.author_image ?? null,
      metas: JSON.stringify(post.metas ?? {}),
      views: post.views ?? 0,
      position,
      created_at: post.created_at ?? null,
    });
    for (const slug of post.categories ?? []) linkCategory.run(lastInsertRowid, type, slug);
  };

  db.transaction(() => {
    seed.productCategories.forEach((c) => insertCategory.run('product', c.slug, c.title));
    seed.blogCategories.forEach((c) => insertCategory.run('blog', c.slug, c.title));

    seed.pages.forEach((p, i) => addPost('page', p, i));
    seed.products.forEach((p, i) => addPost('product', p, i));
    seed.blogPosts.forEach((p, i) => addPost('blog', p, i));

    const positions = {};
    for (const { type, ...post } of seed.simplePosts) {
      positions[type] = (positions[type] ?? -1) + 1;
      addPost(type, post, positions[type]);
    }

    for (const [location, items] of Object.entries(seed.menus)) {
      items.forEach((item, i) => {
        const { lastInsertRowid } = insertMenu.run(location, null, item.title, item.link, i);
        (item.children ?? []).forEach((child, j) =>
          insertMenu.run(location, lastInsertRowid, child.title, child.link, j)
        );
      });
    }

    for (const [lang, entries] of Object.entries(seed.translations)) {
      for (const [key, value] of Object.entries(entries)) insertTranslation.run(lang, key, value);
    }
  })();
}
