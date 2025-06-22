import mongoose from 'mongoose';

const prenotazioneSchema = new mongoose.Schema({
  campo: { type: mongoose.Schema.Types.ObjectId, ref: 'Campo' },
  giocatori: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  orario: String,
  data: Date
});

export default mongoose.model('Prenotazione', prenotazioneSchema);