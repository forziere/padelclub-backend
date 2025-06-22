import mongoose from 'mongoose';

const prenotazioneSchema = new mongoose.Schema({
  utente: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  campo: { type: mongoose.Schema.Types.ObjectId, ref: 'Campo' },
  data: { type: Date, required: true },
  pagato: { type: Boolean, default: false }
});

export default mongoose.model('Prenotazione', prenotazioneSchema);
