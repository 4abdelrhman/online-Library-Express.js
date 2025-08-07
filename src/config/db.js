import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`DataBase Connected Successfully ${conn.connection.host}`);
  } catch (error) {
    console.log('Error connecting in the DataBase', error);
    process.exit(1);
  }
};
