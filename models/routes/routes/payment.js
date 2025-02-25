const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe('la_tua_chiave_segreta_stripe');

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body; // L'importo in centesimi
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      // Puoi aggiungere metadati o configurare ulteriormente il PaymentIntent
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante la creazione del pagamento" });
  }
});

module.exports = router;
