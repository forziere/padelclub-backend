import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  credit: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false }
});

export default mongoose.model('User', userSchema);