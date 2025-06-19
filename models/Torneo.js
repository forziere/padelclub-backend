import mongoose from 'mongoose';

const torneoSchema = new mongoose.Schema({
  nome: String,
  data: Date,
  partecipanti: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  vincitore: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stato: { type: String, default: 'aperto' },
  punti: {
    vittoria: { type: Number, default: 3 },
    sconfitta: { type: Number, default: 1 }
  }
});

export default mongoose.model('Torneo', torneoSchema);
