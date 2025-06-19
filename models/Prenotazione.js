import mongoose from 'mongoose';

const prenotazioneSchema = new mongoose.Schema({
  campo: { type: mongoose.Schema.Types.ObjectId, ref: 'Campo' },
  data: String,
  orario: String,
  giocatori: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

export default mongoose.model('Prenotazione', prenotazioneSchema);
