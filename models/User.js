import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Il nome è obbligatorio'],
    trim: true,
    minlength: [2, 'Il nome deve essere di almeno 2 caratteri'],
    maxlength: [50, 'Il nome non può superare 50 caratteri']
  },
  email: {
    type: String,
    required: [true, 'L\'email è obbligatoria'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email non valida']
  },
  passwordHash: {
    type: String,
    required: [true, 'La password è obbligatoria']
  },
  credit: {
    type: Number,
    default: 0,
    min: [0, 'Il credito non può essere negativo']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indici per performance
userSchema.index({ email: 1 });
userSchema.index({ isAdmin: 1 });

export default mongoose.model('User', userSchema);
