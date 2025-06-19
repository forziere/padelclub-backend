import mongoose from 'mongoose';

const campoSchema = new mongoose.Schema({
  nome: String,
  orariDisponibili: [String],
  costo: Number
});

export default mongoose.model('Campo', campoSchema);
