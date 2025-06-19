import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import Campo from '../models/Campo.js';
import Prenotazione from '../models/Prenotazione.js';

const router = express.Router();

// Registrazione
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ error: 'Email già registrata' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, credit: 0.10 });
    await user.save();
    res.status(201).json({ message: 'Registrazione completata' });
  } catch (err) {
    res.status(500).json({ error: 'Errore server' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });

    const match = await user.verifyPassword(password);
    if (!match) return res.status(401).json({ error: 'Password errata' });

    // Primo accesso ? detrazione 0.10€
    if (!user.hasLoggedIn) {
      if (user.credit >= 0.10) {
        user.credit -= 0.10;
        user.hasLoggedIn = true;
        await user.save();
      } else {
        return res.status(403).json({ error: 'Credito insufficiente per primo login' });
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        credit: user.credit
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Errore login' });
  }
});

// Dati utente
router.get('/:id', auth, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Utente non trovato' });
  res.json(user);
});

// Ricarica credito
router.post('/:id/ricarica', auth, async (req, res) => {
  const { importo } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Utente non trovato' });
  user.credit += importo;
  await user.save();
  res.json({ success: true, nuovoCredito: user.credit });
});

// Prenotazione campo
router.post('/:id/prenota', auth, async (req, res) => {
  const { campoId, data, orario } = req.body;
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });
    if (user.credit < 0.10) return res.status(403).json({ error: 'Credito insufficiente' });

    const campo = await Campo.findById(campoId);
    if (!campo || !campo.orariDisponibili.includes(orario)) {
      return res.status(400).json({ error: 'Campo o orario non valido' });
    }

    const esiste = await Prenotazione.findOne({ campo: campoId, data, orario });
    if (esiste) return res.status(400).json({ error: 'Orario già prenotato' });

    const prenotazione = new Prenotazione({ campo: campoId, data, orario, giocatori: [userId] });
    await prenotazione.save();
    user.credit -= 0.10;
    await user.save();
    res.status(201).json({ success: true, prenotazione });
  } catch (err) {
    res.status(500).json({ error: 'Errore prenotazione' });
  }
});

export default router;
