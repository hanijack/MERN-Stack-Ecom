import handleAsyncError from "../middleware/handleAsyncError.js";
import { stripe } from "../server.js";

// Create Stripe PaymentIntent
export const processPayment = handleAsyncError(async (req, res) => {
  const { amount, currency = "usd" } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100), // Stripe expects amount in cents
      currency,
      metadata: { integration_check: "accept_a_payment" },
    });
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send Stripe Publishable Key
export const sendAPIKey = handleAsyncError(async (req, res) => {
  res.status(200).json({
    key: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});



