import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import userRoutes from './routes/user.routes.js';
import campoRoutes from './routes/campo.routes.js';
import torneoRoutes from './routes/torneo.routes.js';
import prenotazioneRoutes from './routes/prenotazione.routes.js';
import notificaRoutes from './routes/notifica.routes.js';

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
app.use('/api/tornei', torneoRoutes);
app.use('/api/prenotazioni', prenotazioneRoutes);
app.use('/api/notifiche', notificaRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('? Connesso a MongoDB');
  const Torneo = (await import('./models/Torneo.js')).default;
  const torneoEsistente = await Torneo.findOne({ nome: "Tutti contro tutti" });
  if (!torneoEsistente) {
    const nuovoTorneo = new Torneo({
      nome: "Tutti contro tutti",
      data: new Date(),
      stato: "aperto",
      punti: { vittoria: 3, sconfitta: 1 }
    });
    await nuovoTorneo.save();
    console.log('?? Torneo "Tutti contro tutti" creato con sistema punti 3/1');
  }
  app.listen(PORT, () => console.log(`?? Server avviato su porta ${PORT}`));
}).catch((err) => {
  console.error('? Errore connessione MongoDB:', err);
});
