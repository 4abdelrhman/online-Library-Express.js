import express from 'express';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import bookRoutes from './routes/books.route.js';

connectDB().catch((err) => {
  console.error('DB connection failed', err);
});

const app = express();

app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Book API</title>
      <style>
        body {
          margin: 0;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          background-color: #f9f9f9;
          font-family: Arial, sans-serif;
        }
        img {
          width: 100px;
          height: 100px;
          margin-bottom: 20px;
        }
        h1 {
          color: #333;
        }
      </style>
    </head>
    <body>
      <img src="https://cdn-icons-png.flaticon.com/512/29/29302.png" alt="Book Icon" />
      <h1>Welcome to Book API</h1>
    </body>
    </html>
  `);
});

app.get('/api/test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Book API</title>
      <style>
        body {
          margin: 0;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          background-color: #f9f9f9;
          font-family: Arial, sans-serif;
        }
        img {
          width: 100px;
          height: 100px;
          margin-bottom: 20px;
        }
        h1 {
          color: #333;
        }
      </style>
    </head>
    <body>
      <img src="https://cdn-icons-png.flaticon.com/512/29/29302.png" alt="Book Icon" />
      <h1>This route is public and working fine.</h1>
    </body>
    </html>
  `);
});

app.use('/api/books', bookRoutes);

export default app;
