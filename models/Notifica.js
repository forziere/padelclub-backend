import mongoose from 'mongoose';

const notificaSchema = new mongoose.Schema({
  utenteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utente è obbligatorio']
  },
  messaggio: {
    type: String,
    required: [true, 'Il messaggio è obbligatorio'],
    maxlength: [500, 'Il messaggio non può superare 500 caratteri']
  },
  letta: {
    type: Boolean,
    default: false
  },
  tipo: {
    type: String,
    enum: ['info', 'avviso', 'errore', 'successo'],
    default: 'info'
  },
  data: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indici per performance
notificaSchema.index({ utenteId: 1, letta: 1 });
notificaSchema.index({ data: -1 });

export default mongoose.model('Notifica', notificaSchema);
