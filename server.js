import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import userRoutes from './routes/user.routes.js';
import campoRoutes from './routes/campo.routes.js';

import './models/User.js';
import './models/Campo.js';
import './models/Torneo.js';
import './models/Prenotazione.js';
import './models/Notifica.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/utenti', userRoutes);
app.use('/api/campi', campoRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('✅ Connesso a MongoDB');
  const Torneo = (await import('./models/Torneo.js')).default;
  const esiste = await Torneo.findOne({ nome: "Tutti contro tutti" });
  if (!esiste) {
    const nuovoTorneo = new Torneo({
      nome: "Tutti contro tutti",
      data: new Date(),
      stato: "aperto",
      punti: { vittoria: 3, sconfitta: 1 }
    });
    await nuovoTorneo.save();
    console.log('🏆 Torneo inizializzato');
  }
  app.listen(PORT, () => console.log(`🚀 Server su porta ${PORT}`));
}).catch(err => console.error('❌ Errore DB:', err));