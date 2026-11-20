import { describe, expect, test } from 'vitest';
import { buildCartLines, cartReducer, initialCartState, MAX_QTY, sanitizeItems } from './cartReducer';

const run = (...actions) => actions.reduce(cartReducer, initialCartState);

describe('cartReducer', () => {
  test('adding the same product again increases its quantity', () => {
    const state = run({ type: 'added', productId: 4 }, { type: 'added', productId: 4, qty: 2 });
    expect(state.items).toEqual({ 4: 3 });
  });

  test('quantities are whole numbers within limits', () => {
    expect(run({ type: 'added', productId: 1, qty: 'abc' }).items).toEqual({ 1: 1 });
    expect(run({ type: 'added', productId: 1, qty: 2.7 }).items).toEqual({ 1: 2 });
    expect(run({ type: 'added', productId: 1, qty: 5000 }).items).toEqual({ 1: MAX_QTY });
  });

  test('setting a quantity only applies to products in the cart and ignores zero', () => {
    const state = run({ type: 'added', productId: 1 }, { type: 'quantitySet', productId: 1, qty: 4 });
    expect(state.items).toEqual({ 1: 4 });
    expect(cartReducer(state, { type: 'quantitySet', productId: 1, qty: 0 })).toBe(state);
    expect(cartReducer(state, { type: 'quantitySet', productId: 9, qty: 2 })).toBe(state);
  });

  test('remove, clear and replace', () => {
    const state = run({ type: 'added', productId: 1 }, { type: 'added', productId: 2 });
    expect(cartReducer(state, { type: 'removed', productId: 1 }).items).toEqual({ 2: 1 });
    expect(cartReducer(state, { type: 'cleared' })).toEqual(initialCartState);
    expect(cartReducer(state, { type: 'replaced', items: { 7: 2, x: 1, 8: -1 } }).items).toEqual({ 7: 2 });
  });

  test('unknown actions are a programming error', () => {
    expect(() => cartReducer(initialCartState, { type: 'nope' })).toThrow('Unknown cart action');
  });
});

describe('buildCartLines', () => {
  const products = [
    { id: 1, title: 'A', slug: 'a', price: 100, discount_price: 80, has_discount: true, stock: 2 },
    { id: 2, title: 'B', slug: 'b', price: 25.5, discount_price: 25.5, has_discount: false, stock: 10 },
  ];

  test('uses sale prices, caps at stock and totals the lines', () => {
    const { lines, total, count } = buildCartLines({ 1: 5, 2: 2 }, products);
    expect(lines.map((l) => [l.id, l.qty, l.sum])).toEqual([
      [1, 2, 160],
      [2, 2, 51],
    ]);
    expect(total).toBe(211);
    expect(count).toBe(4);
  });

  test('drops products that are not in the cart', () => {
    expect(buildCartLines({ 2: 1 }, products).lines.map((l) => l.id)).toEqual([2]);
  });
});

test('sanitizeItems ignores malformed storage', () => {
  expect(sanitizeItems(null)).toEqual({});
  expect(sanitizeItems('oops')).toEqual({});
  expect(sanitizeItems({ 3: '2', 4: 0 })).toEqual({ 3: 2 });
});
