const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = "la_tua_chiave_segreta"; // Utilizza variabili d'ambiente in produzione

// Rotta di registrazione
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email già registrata" });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Utente registrato con successo" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore lato server" });
  }
});

// Rotta di login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Credenziali errate" });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Credenziali errate" });
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, message: "Login effettuato con successo" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore lato server" });
  }
});

module.exports = router;
