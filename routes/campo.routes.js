import express from 'express';
import { body, validationResult } from 'express-validator';
import Campo from '../models/Campo.js';
import auth from '../middleware/auth.js';
import checkAdmin from '../middleware/checkAdmin.js';

const router = express.Router();

// Validatori
const campoValidation = [
  body('nome').trim().isLength({ min: 2, max: 50 }).withMessage('Nome deve essere tra 2 e 50 caratteri'),
  body('orariDisponibili').isArray({ min: 1 }).withMessage('Deve esserci almeno un orario disponibile'),
  body('orariDisponibili.*').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Formato orario non valido (HH:MM)'),
  body('costo').isNumeric().isFloat({ min: 0 }).withMessage('Il costo deve essere un numero positivo')
];

// Crea un nuovo campo (solo admin)
router.post('/', auth, checkAdmin, campoValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, orariDisponibili, costo } = req.body;
    
    // Verifica che il nome non esista già
    const campoEsistente = await Campo.findOne({ nome });
    if (campoEsistente) {
      return res.status(400).json({ error: 'Esiste già un campo con questo nome' });
    }
    
    const campo = new Campo({ nome, orariDisponibili, costo });
    await campo.save();
    
    res.status(201).json({
      message: 'Campo creato con successo',
      campo
    });
    
  } catch (error) {
    console.error('Errore creazione campo:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Nome campo già esistente' });
    }
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// Lista tutti i campi
router.get('/', async (req, res) => {
  try {
    const campi = await Campo.find().sort({ nome: 1 });
    res.json(campi);
  } catch (error) {
    console.error('Errore recupero campi:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// Ottieni un campo specifico
router.get('/:id', async (req, res) => {
  try {
    const campo = await Campo.findById(req.params.id);
    if (!campo) {
      return res.status(404).json({ error: 'Campo non trovato' });
    }
    res.json(campo);
  } catch (error) {
    console.error('Errore recupero campo:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// Aggiorna un campo (solo admin)
router.put('/:id', auth, checkAdmin, campoValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, orariDisponibili, costo } = req.body;
    
    const campo = await Campo.findByIdAndUpdate(
      req.params.id,
      { nome, orariDisponibili, costo },
      { new: true, runValidators: true }
    );
    
    if (!campo) {
      return res.status(404).json({ error: 'Campo non trovato' });
    }
    
    res.json({
      message: 'Campo aggiornato con successo',
      campo
    });
    
  } catch (error) {
    console.error('Errore aggiornamento campo:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Nome campo già esistente' });
    }
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// Elimina un campo (solo admin)
router.delete('/:id', auth, checkAdmin, async (req, res) => {
  try {
    const campo = await Campo.findByIdAndDelete(req.params.id);
    
    if (!campo) {
      return res.status(404).json({ error: 'Campo non trovato' });
    }
    
    res.json({ message: 'Campo eliminato con successo' });
    
  } catch (error) {
    console.error('Errore eliminazione campo:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

export default router;
