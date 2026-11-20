import { render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import App from './App';
import { http } from './utils/Models';

const product = {
  id: 1,
  slug: 'oak-lounge-chair',
  title: 'Oak Lounge Chair',
  featured: '/a.jpg',
  excerpt: '',
  metas: {},
  categories: [],
  price: 100,
  discount_price: 80,
  has_discount: true,
  stock: 3,
};

const responses = {
  '/menus/main': [{ id: 1, title: 'Shop', link: '/shop', subs: [] }],
  '/menus/footer': [{ id: 2, title: 'Help', link: '', subs: [{ id: 3, title: 'Cart', link: '/cart', subs: [] }] }],
  '/translations': { home_title: 'Home' },
  '/posts': { data: [product], total: 1 },
  '/products': { data: [product], total: 1 },
};

beforeEach(() => {
  vi.spyOn(http, 'get').mockImplementation((url) =>
    Promise.resolve({ data: responses[url] ?? { data: [], total: 0 } })
  );
  window.localStorage.setItem('basket', JSON.stringify({ 1: 2 }));
});

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

test('renders menus from the API and prices the cart with server prices', async () => {
  render(<App />);

  const nav = await screen.findByRole('navigation');
  expect(await within(nav).findByRole('link', { name: 'Shop' })).toHaveAttribute('href', '/shop');
  expect(await screen.findByRole('heading', { name: 'Help' })).toBeInTheDocument();

  // 2 × discounted price of 80
  expect(await screen.findByRole('link', { name: /Cart.*\$\s*160/ })).toBeInTheDocument();
  expect(http.get).toHaveBeenCalledWith('/products', { params: { ids: '1' } });
});
