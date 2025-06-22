import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connessione a MongoDB riuscita');
  } catch (error) {
    console.error('❌ Connessione MongoDB fallita:', error);
    process.exit(1);
  }
};

export default connectDB;