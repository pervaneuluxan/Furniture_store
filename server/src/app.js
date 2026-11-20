import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import { errorHandler, notFoundHandler } from './errors.js';
import { contentRouter } from './routes/content.js';
import { formsRouter } from './routes/forms.js';
import { siteRouter } from './routes/site.js';

export function createApp(db) {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: config.corsOrigins }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api', contentRouter(db));
  app.use('/api', siteRouter(db));
  app.use('/api', formsRouter(db));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
