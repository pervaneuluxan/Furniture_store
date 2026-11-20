PRAGMA foreign_keys = ON;

-- Every piece of site content (products, blog posts, slides, pages, team
-- members, ...) is a post. `type` says what it is; type-specific fields such as
-- price or stock live in the `metas` JSON object.
CREATE TABLE IF NOT EXISTS posts (
  id           INTEGER PRIMARY KEY,
  type         TEXT    NOT NULL,
  slug         TEXT    NOT NULL UNIQUE,
  title        TEXT    NOT NULL,
  excerpt      TEXT    NOT NULL DEFAULT '',
  content      TEXT    NOT NULL DEFAULT '',
  featured     TEXT,
  author       TEXT,
  author_image TEXT,
  metas        TEXT    NOT NULL DEFAULT '{}' CHECK (json_valid(metas)),
  views        INTEGER NOT NULL DEFAULT 0,
  position     INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts (type, position);

CREATE TABLE IF NOT EXISTS categories (
  id    INTEGER PRIMARY KEY,
  type  TEXT NOT NULL,
  slug  TEXT NOT NULL,
  title TEXT NOT NULL,
  UNIQUE (type, slug)
);

CREATE TABLE IF NOT EXISTS post_categories (
  post_id     INTEGER NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

CREATE TABLE IF NOT EXISTS menu_items (
  id        INTEGER PRIMARY KEY,
  location  TEXT    NOT NULL,
  parent_id INTEGER REFERENCES menu_items (id) ON DELETE CASCADE,
  title     TEXT    NOT NULL,
  link      TEXT    NOT NULL DEFAULT '',
  position  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS translations (
  lang  TEXT NOT NULL,
  key   TEXT NOT NULL,
  value TEXT NOT NULL,
  PRIMARY KEY (lang, key)
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id         INTEGER PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT NOT NULL,
  message    TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id         INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name  TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT NOT NULL,
  country    TEXT NOT NULL,
  company    TEXT NOT NULL DEFAULT '',
  post_code  TEXT NOT NULL,
  total      REAL NOT NULL,
  status     TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  order_id   INTEGER NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES posts (id),
  title      TEXT    NOT NULL,
  unit_price REAL    NOT NULL,
  qty        INTEGER NOT NULL CHECK (qty > 0),
  line_total REAL    NOT NULL,
  PRIMARY KEY (order_id, product_id)
);
