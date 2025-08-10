import 'dotenv/config';

export const ENV = {
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  ARCJET_KEY: process.env.ARCJET_KEY,
};
