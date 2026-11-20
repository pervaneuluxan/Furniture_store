import assert from 'node:assert/strict';
import { beforeEach, describe, test } from 'node:test';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { openDatabase } from '../src/db/index.js';
import { priceInfo } from '../src/services/pricing.js';

let db;
let api;

beforeEach(() => {
  db = openDatabase(':memory:');
  api = request(createApp(db));
});

const customer = {
  firstName: 'Test',
  lastName: 'Buyer',
  email: 'buyer@example.test',
  phone: '000',
  country: 'AZ',
  company: '',
  postCode: 'AZ1000',
};

describe('content', () => {
  test('lists products with pagination and computed prices', async () => {
    const res = await api.get('/api/posts?type=product&limit=4&page=2').expect(200);
    assert.equal(res.body.total, 14);
    assert.equal(res.body.data.length, 4);
    const product = res.body.data[0];
    for (const key of ['id', 'slug', 'title', 'featured', 'metas', 'categories', 'price', 'discount_price', 'has_discount', 'stock']) {
      assert.ok(key in product, `missing ${key}`);
    }
  });

  test('filters by category and sorts by popularity', async () => {
    const res = await api.get('/api/posts?type=product&category=tables&sort=popular').expect(200);
    assert.ok(res.body.data.length > 0);
    assert.ok(res.body.data.every((p) => p.categories.some((c) => c.slug === 'tables')));
    const views = res.body.data.map((p) => p.views);
    assert.deepEqual(views, [...views].sort((a, b) => b - a));
  });

  test('rejects unknown types and raw SQL sort orders', async () => {
    await api.get('/api/posts?type=users').expect(400);
    await api.get('/api/posts?type=product&sort=p.view%20DESC').expect(400);
    await api.get('/api/posts?type=product&limit=0').expect(400);
  });

  test('gets a post by slug and counts the view', async () => {
    const before = await api.get('/api/posts/round-cafe-table').expect(200);
    const after = await api.get('/api/posts/round-cafe-table').expect(200);
    assert.equal(after.body.views, before.body.views + 1);
    await api.get('/api/posts/does-not-exist').expect(404);
  });

  test('pages are only reachable through /pages', async () => {
    const res = await api.get('/api/pages/contact').expect(200);
    assert.equal(res.body.metas.map.zoom, 15);
    await api.get('/api/posts/contact').expect(404);
  });

  test('looks up cart products by id', async () => {
    const [first, second] = db.prepare("SELECT id FROM posts WHERE type = 'product' ORDER BY id LIMIT 2").all();
    const res = await api.get(`/api/products?ids=${second.id},${first.id},${second.id},9999`).expect(200);
    assert.deepEqual(res.body.data.map((p) => p.id), [first.id, second.id]);
    assert.equal(res.body.total, 2);
    await api.get('/api/products?ids=1;DROP').expect(400);
  });

  test('menus, categories and translations', async () => {
    const footer = await api.get('/api/menus/footer').expect(200);
    assert.ok(footer.body[0].subs.length > 0);
    const cats = await api.get('/api/categories?type=blog').expect(200);
    assert.ok(cats.body.some((c) => c.slug === 'design'));
    const en = await api.get('/api/translations?lang=en').expect(200);
    assert.equal(en.body.add_to_cart, 'Add to cart');
    const fallback = await api.get('/api/translations?lang=xx').expect(200);
    assert.equal(fallback.body.home_title, 'Ana səhifə');
  });
});

describe('contact form', () => {
  test('stores a valid message', async () => {
    await api
      .post('/api/contact')
      .send({ name: 'A', email: 'a@example.test', phone: '1', message: 'Hi' })
      .expect(201);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM contact_messages').get().n, 1);
  });

  test('reports every invalid field', async () => {
    const res = await api.post('/api/contact').send({ email: 'nope' }).expect(422);
    assert.deepEqual(Object.keys(res.body.details).sort(), ['email', 'message', 'name', 'phone']);
  });
});

describe('orders', () => {
  const product = () => db.prepare("SELECT id, metas FROM posts WHERE slug = 'round-cafe-table'").get();

  test('prices the order on the server and reduces stock', async () => {
    const { id, metas } = product();
    const { stock, price } = JSON.parse(metas);
    const res = await api
      .post('/api/orders')
      .send({ customer, items: [{ productId: id, qty: 2 }] })
      .expect(201);

    const expectedUnit = priceInfo(JSON.parse(metas)).unit_price;
    assert.ok(expectedUnit < price, 'seed product should be discounted');
    assert.equal(res.body.total, expectedUnit * 2);
    assert.equal(JSON.parse(product().metas).stock, stock - 2);
  });

  test('refuses more than the stock and leaves stock untouched', async () => {
    const { id, metas } = product();
    const { stock } = JSON.parse(metas);
    await api
      .post('/api/orders')
      .send({ customer, items: [{ productId: id, qty: stock + 1 }] })
      .expect(409);
    assert.equal(JSON.parse(product().metas).stock, stock);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM orders').get().n, 0);
  });

  test('validates customer and items', async () => {
    await api.post('/api/orders').send({ customer, items: [] }).expect(422);
    await api.post('/api/orders').send({ customer: {}, items: [{ productId: 1, qty: 1 }] }).expect(422);
    await api.post('/api/orders').send({ customer, items: [{ productId: 9999, qty: 1 }] }).expect(422);
    await api.post('/api/orders').send({ customer, items: [{ productId: 1, qty: 1.5 }] }).expect(422);
  });
});

describe('pricing', () => {
  const now = new Date('2026-06-15T12:00:00Z');

  test('applies a discount only inside its date range, end date inclusive', () => {
    const metas = { price: 100, discount: 25, discount_start_date: '2026-06-01', discount_end_date: '2026-06-15' };
    assert.deepEqual(priceInfo(metas, now), { price: 100, discount_price: 75, has_discount: true, unit_price: 75 });
    assert.equal(priceInfo({ ...metas, discount_end_date: '2026-06-14' }, now).has_discount, false);
    assert.equal(priceInfo({ ...metas, discount_start_date: null }, now).has_discount, false);
  });
});

test('unknown routes return JSON 404', async () => {
  const res = await api.get('/api/nope').expect(404);
  assert.match(res.body.error, /No route/);
});
