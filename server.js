const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware per la gestione dei dati JSON e del CORS
app.use(express.json());
app.use(cors());

// Rotta per i file statici (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Connessione al database (esempio con MongoDB)
mongoose.connect('mongodb://localhost:27017/mio_ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connesso'))
.catch(err => console.error('Errore di connessione:', err));

// Importa e utilizza le rotte
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const productsRoutes = require('./routes/products');
app.use('/api/products', productsRoutes);

const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

// Avvio del server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server in esecuzione sulla porta ${PORT}`));
