import { Router } from 'express';
import { HttpError } from '../errors.js';
import { createOrder } from '../services/orders.js';
import { validateFields } from '../validation.js';

export function formsRouter(db) {
  const router = Router();

  // POST /api/contact { name, email, phone, message }
  router.post('/contact', (req, res) => {
    const msg = validateFields(req.body, {
      name: { required: true, max: 120 },
      email: { required: true, max: 200, email: true },
      phone: { required: true, max: 40 },
      message: { required: true, max: 5000 },
    });
    const { lastInsertRowid } = db
      .prepare('INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)')
      .run(msg.name, msg.email, msg.phone, msg.message);
    res.status(201).json({ id: Number(lastInsertRowid) });
  });

  // POST /api/orders { customer: {...}, items: [{ productId, qty }] }
  router.post('/orders', (req, res) => {
    const customer = validateFields(req.body?.customer, {
      firstName: { required: true, max: 80 },
      lastName: { required: true, max: 80 },
      email: { required: true, max: 200, email: true },
      phone: { required: true, max: 40 },
      country: { required: true, max: 80 },
      company: { max: 120 },
      postCode: { required: true, max: 20 },
    });

    const items = req.body?.items;
    if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
      throw new HttpError(422, '"items" must be a non-empty list of { productId, qty }');
    }
    const seen = new Set();
    const cleanItems = items.map((item, i) => {
      const productId = Number(item?.productId);
      const qty = Number(item?.qty);
      if (!Number.isInteger(productId) || productId < 1 || !Number.isInteger(qty) || qty < 1 || qty > 999) {
        throw new HttpError(422, `items[${i}] needs a positive integer productId and qty (1–999)`);
      }
      if (seen.has(productId)) throw new HttpError(422, `Product ${productId} appears more than once`);
      seen.add(productId);
      return { productId, qty };
    });

    res.status(201).json(createOrder(db, customer, cleanItems));
  });

  return router;
}
