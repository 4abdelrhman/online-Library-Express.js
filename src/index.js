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
  res.send('Welcome to the Book API with Clerk Authentication!');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'This route is public and working fine.' });
});

app.use('/api/books', bookRoutes);

export default app;
