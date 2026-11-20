import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { expect, test } from 'vitest';
import Hero from './Hero';

const slides = [
  { id: 1, title: 'New season collection', excerpt: 'One', featured: '/1.png' },
  { id: 2, title: 'Crafted to last', excerpt: 'Two', featured: '/2.png' },
];

const renderHero = () =>
  render(
    <MemoryRouter>
      <Hero slides={slides} />
    </MemoryRouter>
  );

test('shows the first slide with its words spaced', () => {
  renderHero();
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('New season collection');
});

test('moves between slides with the buttons and the progress steps', () => {
  renderHero();
  fireEvent.click(screen.getByRole('button', { name: 'Next slide' }));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Crafted to last');

  fireEvent.click(screen.getByRole('button', { name: 'New season collection' }));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('New season collection');
});

test('advances when the progress line finishes, unless paused', () => {
  const { container } = renderHero();
  fireEvent.animationEnd(container.querySelector('.hero-step-fill'));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Crafted to last');

  fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
  expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
  expect(container.querySelector('.hero')).toHaveAttribute('data-paused', 'true');
});
