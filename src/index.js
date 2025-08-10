import express from 'express';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import bookRoutes from './routes/books.route.js';
import { ensureUserExists } from './middleware/ensureUserExists.middleware.js';

const app = express();

app.use(express.json());
app.use(clerkMiddleware());

app.use('/', (req, res) => {
  res.send('Welcome to the Book API with Clerk Authentication!');
});

app.use('/api', requireAuth(), ensureUserExists);

app.use('/api/books', bookRoutes);

connectDB()
  .then(() => {
    app.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection failed', err);
    process.exit(1);
  });
