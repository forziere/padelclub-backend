import mongoose from 'mongoose';

const torneoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Il nome del torneo è obbligatorio'],
    trim: true
  },
  data: {
    type: Date,
    required: [true, 'La data è obbligatoria']
  },
  partecipanti: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  vincitore: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  stato: {
    type: String,
    enum: ['aperto', 'in_corso', 'completato', 'cancellato'],
    default: 'aperto'
  },
  punti: {
    vittoria: {
      type: Number,
      default: 3,
      min: [0, 'I punti vittoria non possono essere negativi']
    },
    sconfitta: {
      type: Number,
      default: 1,
      min: [0, 'I punti sconfitta non possono essere negativi']
    }
  }
}, {
  timestamps: true
});

export default mongoose.model('Torneo', torneoSchema);
