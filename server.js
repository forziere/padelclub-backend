import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import helmet from 'helmet';

// Import configurazioni
import connectDB from './config/db.js';

// Import routes
import userRoutes from './routes/user.routes.js';
import campoRoutes from './routes/campo.routes.js';
import prenotazioneRoutes from './routes/prenotazione.routes.js';
import torneoRoutes from './routes/torneo.routes.js';

// Import modelli per inizializzazione
import Torneo from './models/Torneo.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/utenti', userRoutes);
app.use('/api/campi', campoRoutes);
app.use('/api/prenotazioni', prenotazioneRoutes);
app.use('/api/tornei', torneoRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint non trovato' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Errore globale:', error);
  res.status(500).json({ 
    error: 'Errore interno del server',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

// Avvio server
async function startServer() {
  try {
    // Connessione database
    await connectDB();
    
    // Inizializzazione torneo predefinito
    const torneoEsistente = await Torneo.findOne({ nome: "Tutti contro tutti" });
    if (!torneoEsistente) {
      const nuovoTorneo = new Torneo({
        nome: "Tutti contro tutti",
        data: new Date(),
        stato: "aperto",
        punti: { vittoria: 3, sconfitta: 1 }
      });
      await nuovoTorneo.save();
      console.log('🏆 Torneo predefinito inizializzato');
    }
    
    // Avvio server
    app.listen(PORT, () => {
      console.log(`🚀 Server avviato sulla porta ${PORT}`);
      console.log(`📱 Health check: http://localhost:${PORT}/health`);
    });
    
  } catch (error) {
    console.error('❌ Errore avvio server:', error);
    process.exit(1);
  }
}

startServer();
