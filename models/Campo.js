import mongoose from 'mongoose';

const campoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Il nome del campo è obbligatorio'],
    trim: true,
    unique: true
  },
  orariDisponibili: [{
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato orario non valido (HH:MM)']
  }],
  costo: {
    type: Number,
    required: [true, 'Il costo è obbligatorio'],
    min: [0, 'Il costo non può essere negativo']
  }
}, {
  timestamps: true
});

export default mongoose.model('Campo', campoSchema);
