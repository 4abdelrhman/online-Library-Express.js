import express from 'express';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import bookRoutes from './routes/books.route.js';
import { ensureUserExists } from './middleware/ensureUserExists.middleware.js';

const app = express();

app.use(express.json());
app.use(clerkMiddleware());

app.use('/api', requireAuth(), ensureUserExists);

app.use('/api/books', bookRoutes);

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
  connectDB();
});
