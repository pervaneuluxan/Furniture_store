// Cart state is just { items: { [productId]: qty } }. Product details and prices
// always come from the API; see buildCartLines. Kept free of React so it can be
// tested on its own, and moved into a Redux Toolkit slice unchanged if needed.

export const MAX_QTY = 999;

export const initialCartState = { items: {} };

const clampQty = (qty) => Math.min(Math.max(Math.floor(Number(qty)) || 0, 0), MAX_QTY);

/** Keeps only positive integer quantities keyed by numeric-looking ids. */
export function sanitizeItems(items) {
  const clean = {};
  if (!items || typeof items !== 'object') return clean;
  for (const [id, qty] of Object.entries(items)) {
    const value = clampQty(qty);
    if (/^\d+$/.test(id) && value > 0) clean[id] = value;
  }
  return clean;
}

export function cartReducer(state, action) {
  switch (action.type) {
    case 'added': {
      const id = String(action.productId);
      const qty = clampQty(action.qty ?? 1) || 1;
      return { items: { ...state.items, [id]: clampQty((state.items[id] ?? 0) + qty) } };
    }
    case 'quantitySet': {
      const id = String(action.productId);
      const qty = clampQty(action.qty);
      if (!(id in state.items) || qty < 1) return state;
      return { items: { ...state.items, [id]: qty } };
    }
    case 'removed': {
      const id = String(action.productId);
      if (!(id in state.items)) return state;
      const { [id]: _removed, ...rest } = state.items;
      return { items: rest };
    }
    case 'cleared':
      return initialCartState;
    case 'replaced':
      return { items: sanitizeItems(action.items) };
    default:
      throw new Error(`Unknown cart action: ${action.type}`);
  }
}

const roundMoney = (n) => Math.round(n * 100) / 100;

/**
 * Joins stored quantities with product data from the API. Quantities are capped
 * at the current stock; products that no longer exist are dropped.
 */
export function buildCartLines(items, products) {
  const lines = products
    .filter((p) => items[p.id] !== undefined)
    .map((p) => {
      const qty = Math.min(items[p.id], Math.max(p.stock, 1));
      const unitPrice = p.has_discount ? p.discount_price : p.price;
      return {
        id: p.id,
        title: p.title,
        featured: p.featured,
        link: p.slug,
        metas: p.metas,
        has_discount: p.has_discount,
        price: p.price,
        discount_price: p.discount_price,
        unit_price: unitPrice,
        stock: p.stock,
        qty,
        sum: roundMoney(unitPrice * qty),
      };
    });

  return {
    lines,
    total: roundMoney(lines.reduce((sum, line) => sum + line.sum, 0)),
    count: lines.reduce((sum, line) => sum + line.qty, 0),
  };
}
