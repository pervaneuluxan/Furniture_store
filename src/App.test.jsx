import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import App from './App';
import { http } from './utils/Models';

const product = {
  id: 1,
  type: 'product',
  slug: 'round-cafe-table',
  title: 'Round Café Table',
  featured: '/a.jpg',
  excerpt: '',
  metas: { materials: 'Beech' },
  categories: [],
  price: 100,
  discount_price: 80,
  has_discount: true,
  stock: 3,
};

const responses = {
  '/menus/main': [{ id: 1, title: 'Shop', link: '/shop', subs: [] }],
  '/menus/footer': [{ id: 2, title: 'Help', link: '', subs: [{ id: 3, title: 'Cart', link: '/cart', subs: [] }] }],
  '/translations': { cart: 'Cart', total: 'Total' },
  '/posts': { data: [product], total: 1 },
  '/products': { data: [product], total: 1 },
};

beforeEach(() => {
  vi.spyOn(http, 'get').mockImplementation((url) =>
    Promise.resolve({ data: responses[url] ?? { data: [], total: 0 } })
  );
  window.scrollTo = vi.fn();
  window.localStorage.setItem('basket', JSON.stringify({ 1: 2 }));
});

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  window.history.pushState({}, '', '/');
});

test('renders menus from the API and counts cart items', async () => {
  render(<App />);

  const nav = await screen.findByRole('navigation', { name: 'Main' });
  expect(await within(nav).findByRole('link', { name: 'Shop' })).toHaveAttribute('href', '/shop');
  expect(await screen.findByRole('heading', { name: 'Help' })).toBeInTheDocument();
  expect(await screen.findByRole('link', { name: 'Cart, 2' })).toBeInTheDocument();
});

test('cart totals use the server’s sale price and quantities can change', async () => {
  window.history.pushState({}, '', '/cart');
  render(<App />);

  const summary = await screen.findByRole('complementary', { name: 'Order summary' });
  expect(await within(summary).findAllByText('$160')).not.toHaveLength(0);

  fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '3' } });
  expect(await within(summary).findAllByText('$240')).not.toHaveLength(0);
});

test('checkout sends the cart items and shows the confirmation', async () => {
  const post = vi.spyOn(http, 'post').mockResolvedValue({ data: { id: 7, total: 160, items: [] } });
  window.history.pushState({}, '', '/checkout');
  render(<App />);

  await screen.findByRole('complementary', { name: 'Order summary' });
  const fill = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fill('First name', 'Test');
  fill('Last name', 'Buyer');
  fill('Email', 'buyer@example.test');
  fill('Phone', '000');
  fill('Postcode', 'AZ1000');
  fireEvent.click(screen.getByRole('button', { name: 'Place order' }));

  expect(await screen.findByText(/Order 7 is confirmed/)).toBeInTheDocument();
  expect(post).toHaveBeenCalledWith('/orders', {
    customer: expect.objectContaining({ firstName: 'Test', postCode: 'AZ1000' }),
    items: [{ productId: 1, qty: 2 }],
  });
  expect(JSON.parse(window.localStorage.getItem('basket'))).toEqual({});
});
