const express = require('express');
const next = require('next');
const { parse } = require('url');
const connectDB = require('./src/backend/config/db');
const adminRoutes = require('./src/backend/routes/adminRoutes');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
connectDB();
app.prepare().then(() => {
  const server = express();
 
  
  server.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    return handle(req, res, parsedUrl);
  });

  server.listen(port, () => {
    console.log(`🚀 Ready on http://localhost:${port} [${dev ? 'development' : 'production'}]`);
  });
});
