// const express = require('express')
// require('dotenv').config();
// const next = require('next');
// const { parse } = require('url');
// // const connectDB = require('./src/backend/config/db');
// // const adminRoutes = require('./src/backend/routes/adminRoutes');

// const port =  3000;  // Default to port 3000 if no PORT is specified
// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();
// // connectDB();

// app.prepare().then(() => {
//   const server = express();

//   // Log the port number when the server is ready
//   console.log(`Server is starting on port ${port}...`);

//   server.all('*', (req, res) => {
//     const parsedUrl = parse(req.url, true);
//     return handle(req, res, parsedUrl);
//   });

//   server.listen(port, () => {
//     console.log(`🚀 Ready on http://localhost:${port} [${dev ? 'development' : 'production'}]`);
//   });
// });


import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import connectDB from '@/backend/config/db'
const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
 
app.prepare().then(() => {
  connectDB();
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(port)
 
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})