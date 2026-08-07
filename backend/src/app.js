const express = require('express');
const helmet = require('helmet');
const sessionRoutes = require('./modules/session/sessionRoutes');
const customerRoutes = require('./modules/customer/customerRoutes');
const classificationRoutes = require('./modules/classification/classificationRoutes');
const errorHandler = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false }));

  // Routes
  app.use('/api/sessions', sessionRoutes);
  app.use('/api/customers', customerRoutes);
  app.use('/api/classify', classificationRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada', code: 'NOT_FOUND' });
  });

  // Error handler
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
