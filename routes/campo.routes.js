import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import checkAdmin from '../middleware/checkAdmin.js';

const router = express.Router();

// Validatori
const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Nome deve essere tra 2 e 50 caratteri'),
  body('email').isEmail().normalizeEmail().withMessage('Email non valida'),
  body('password').isLength({ min: 6 }).withMessage('Password deve essere di almeno 6 caratteri')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email non valida'),
  body('password').notEmpty().withMessage('Password obbligatoria')
];

// Registrazione
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    
    // Controlla se utente esiste già
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email già registrata' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Crea utente
    const user = new User({
      name,
      email,
      passwordHash
    });
    
    await user.save();
    
    // Genera token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'Utente creato con successo',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credit: user.credit,
        isAdmin: user.isAdmin
      }
    });
    
  } catch (error) {
    console.error('Errore registrazione:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email già registrata' });
    }
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// Login
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    // Trova utente
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(400).json({ error: 'Credenziali non valide' });
    }
    
    // Verifica password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Credenziali non valide' });
    }
    
    // Genera token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login effettuato con successo',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credit: user.credit,
        isAdmin: user.isAdmin
      }
    });
    
  } catch (error) {
    console.error('Errore login:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// Profilo utente
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Errore recupero profilo:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// Lista utenti (solo admin)
router.get('/', auth, checkAdmin, async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('-passwordHash');
    res.json(users);
  } catch (error) {
    console.error('Errore recupero utenti:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// Aggiorna credito utente (solo admin)
router.patch('/:id/credit', auth, checkAdmin, async (req, res) => {
  try {
    const { credit } = req.body;
    
    if (typeof credit !== 'number' || credit < 0) {
      return res.status(400).json({ error: 'Credito deve essere un numero positivo' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { credit },
      { new: true, select: '-passwordHash' }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }
    
    res.json({ message: 'Credito aggiornato', user });
  } catch (error) {
    console.error('Errore aggiornamento credito:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

export default router;
