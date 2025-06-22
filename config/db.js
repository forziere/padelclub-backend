import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log(`✅ MongoDB connesso: ${conn.connection.host}`);
    
    // Event listeners per monitoraggio connessione
    mongoose.connection.on('error', (err) => {
      console.error('❌ Errore MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnesso');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 Connessione MongoDB chiusa');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Errore connessione MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;
