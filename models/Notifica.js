import mongoose from 'mongoose';

const notificaSchema = new mongoose.Schema({
  utenteId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messaggio: String,
  letta: { type: Boolean, default: false },
  data: { type: Date, default: Date.now }
});

export default mongoose.model('Notifica', notificaSchema);
