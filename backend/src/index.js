require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
const classifyRoutes = require('./routes/classify');
const customerRoutes = require('./routes/customers');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/classify', classifyRoutes);
app.use('/api/customers', customerRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'ReciclApp Backend', version: '1.0.0' });
});

// Error handler
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ReciclApp Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
