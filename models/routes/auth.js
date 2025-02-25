const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Segreto per JWT (in ambiente di produzione, utilizzare variabili d'ambiente)
const JWT_SECRET = "la_tua_chiave_segreta";

// Registrazione
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Controlla se l'utente esiste già
    const existingUser = await User.findOne({ email });
    if(existingUser) {
      return res.status(400).json({ message: "Email già registrata" });
    }
    
    // Cripta la password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    res.status(201).json({ message: "Utente registrato con successo" });
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: "Errore lato server" });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Trova l'utente
    const user = await User.findOne({ email });
    if(!user) {
      return res.status(400).json({ message: "Credenziali errate" });
    }
    
    // Verifica la password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(400).json({ message: "Credenziali errate" });
    }
    
    // Crea il token JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token, message: "Login effettuato con successo" });
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: "Errore lato server" });
  }
});

module.exports = router;
