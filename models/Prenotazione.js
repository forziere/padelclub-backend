import mongoose from 'mongoose';

const prenotazioneSchema = new mongoose.Schema({
  campo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campo',
    required: [true, 'Il campo è obbligatorio']
  },
  giocatori: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  orario: {
    type: String,
    required: [true, 'L\'orario è obbligatorio'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato orario non valido (HH:MM)']
  },
  data: {
    type: Date,
    required: [true, 'La data è obbligatoria'],
    validate: {
      validator: function(value) {
        return value >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Non puoi prenotare nel passato'
    }
  },
  stato: {
    type: String,
    enum: ['attiva', 'completata', 'cancellata'],
    default: 'attiva'
  }
}, {
  timestamps: true
});

// Indice per evitare doppie prenotazioni
prenotazioneSchema.index({ campo: 1, data: 1, orario: 1 }, { unique: true });

export default mongoose.model('Prenotazione', prenotazioneSchema);
