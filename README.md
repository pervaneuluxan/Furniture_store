# Depot Furniture Store

A furniture shop with a React 19 frontend (Vite, React Router 7) and an
Express 5 + SQLite REST API.

```
├── index.html, src/        frontend (React)
│   ├── pages/              one component per route
│   ├── components/         header, footer, product card, shared pieces
│   ├── styles/             global.css (design tokens), layout.css, pages.css
│   └── utils/Models.js     every API call the frontend makes
├── public/assets/images/   product and editorial photos
└── server/                 backend (Express + SQLite)
    ├── src/app.js          app setup: middleware and routers
    ├── src/routes/         HTTP endpoints
    ├── src/services/       queries, pricing and order logic
    ├── src/db/             schema, starter content, reset script
    └── test/               API tests
```

## Getting started

Requires Node.js 20.19 or newer.

```bash
npm install
```

```bash
npm run dev
```

`npm install` also installs the server's dependencies. `npm run dev` starts the
API on http://localhost:4000 and the site on http://localhost:3000. Vite
forwards `/api` requests to the API, so no CORS setup is needed in development.

The first API start creates `server/data/store.db` with starter content. To
throw away local changes (orders, messages, stock) and start again:

```bash
npm run seed --prefix server
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | API and site together, with reload on change |
| `npm run build` | Production build of the site into `dist/` |
| `npm run server` | API only, without reload |
| `npm test` | Frontend tests (Vitest) and API tests (`node:test`) |

## Configuration

| Variable | Where | Default |
| --- | --- | --- |
| `VITE_API_URL` | `.env` (frontend, build time) | `/api` |
| `PORT` | API | `4000` |
| `DB_PATH` | API | `server/data/store.db` |
| `CORS_ORIGINS` | API, comma-separated | `http://localhost:3000` |

## API

All responses are JSON. Errors look like `{ "error": "...", "details": {...} }`.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/posts?type=&limit=&page=&sort=&category=` | List content → `{ data, total, page, limit }` |
| GET | `/api/posts/:slug` | One product or blog post (counts a view) |
| GET | `/api/pages/:slug` | Page content: `about`, `cart`, `wishlist`, `checkout`, `blog`, `gallery`, `shop`, `contact`, `empty-cart` |
| GET | `/api/products?ids=1,2` | Products for the cart or wishlist → `{ data, total }` |
| GET | `/api/categories?type=product\|blog` | Categories |
| GET | `/api/menus/main\|footer` | Menu items with nested `subs` |
| GET | `/api/translations?lang=az\|en` | UI strings `{ key: text }` |
| POST | `/api/contact` | `{ name, email, phone, message }` → `201 { id }` |
| POST | `/api/orders` | `{ customer, items: [{ productId, qty }] }` → `201 { id, total, items }` |

- `type`: `product`, `blog`, `slide`, `partner`, `gallery`, `about-tab`,
  `testimonial`, `team-member`, `address`.
- `sort`: `default`, `newest`, `popular`, `price_asc`, `price_desc`.
- Products include `price`, `discount_price`, `has_discount` and `stock`,
  worked out on the server from `metas` (discounts apply between
  `discount_start_date` and `discount_end_date`, both inclusive).
- Orders are priced on the server and reduce stock in the same transaction; an
  order for more than the stock returns `409`.
- `customer` needs `firstName`, `lastName`, `email`, `phone`, `country`,
  `postCode`; `company` is optional.
