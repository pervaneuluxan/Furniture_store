import { HttpError } from '../errors.js';
import { priceInfo } from './pricing.js';

/**
 * Places an order. Prices and stock come from the database, never from the
 * client, and stock is reduced in the same transaction as the order insert.
 */
export function createOrder(db, customer, items) {
  const findProduct = db.prepare("SELECT id, title, metas FROM posts WHERE id = ? AND type = 'product'");
  const updateStock = db.prepare("UPDATE posts SET metas = json_set(metas, '$.stock', ?) WHERE id = ?");
  const insertOrder = db.prepare(`
    INSERT INTO orders (first_name, last_name, email, phone, country, company, post_code, total)
    VALUES (@firstName, @lastName, @email, @phone, @country, @company, @postCode, @total)
  `);
  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, title, unit_price, qty, line_total)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  return db.transaction(() => {
    const lines = items.map(({ productId, qty }) => {
      const product = findProduct.get(productId);
      if (!product) throw new HttpError(422, `Product ${productId} does not exist`);

      const metas = JSON.parse(product.metas);
      const stock = Number(metas.stock) || 0;
      if (qty > stock) {
        throw new HttpError(409, `Only ${stock} of "${product.title}" left in stock`, {
          productId,
          available: stock,
        });
      }

      const { unit_price } = priceInfo(metas);
      return {
        productId,
        title: product.title,
        unitPrice: unit_price,
        qty,
        lineTotal: Math.round(unit_price * qty * 100) / 100,
        remaining: stock - qty,
      };
    });

    const total = Math.round(lines.reduce((sum, l) => sum + l.lineTotal, 0) * 100) / 100;
    const { lastInsertRowid: orderId } = insertOrder.run({ ...customer, total });

    for (const line of lines) {
      insertItem.run(orderId, line.productId, line.title, line.unitPrice, line.qty, line.lineTotal);
      updateStock.run(line.remaining, line.productId);
    }

    return {
      id: Number(orderId),
      total,
      items: lines.map(({ remaining, ...line }) => line),
    };
  })();
}
