import express from 'express';
import Campo from '../models/Campo.js';
import auth from '../middleware/auth.js';
import checkAdmin from '../middleware/checkAdmin.js';

const router = express.Router();

// Solo admin: crea un nuovo campo
router.post('/', auth, checkAdmin, async (req, res) => {
  const { nome, orariDisponibili, costo } = req.body;
  const campo = new Campo({ nome, orariDisponibili, costo });
  await campo.save();
  res.status(201).json(campo);
});

// Tutti possono vedere i campi
router.get('/', async (req, res) => {
  const campi = await Campo.find();
  res.json(campi);
});

export default router;