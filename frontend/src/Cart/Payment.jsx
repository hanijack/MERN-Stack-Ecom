import React, { useState } from 'react';
import '../CartStyles/Payment.css'
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CheckoutPath from './CheckoutPath';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || window.STRIPE_PUBLISHABLE_KEY);

function StripePaymentForm({ orderItem, user, shippingInfo }) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const completePayment = async (amount) => {
    setLoading(true);
    try {
      // Get Stripe publishable key (for fallback)
      const { data: keyData } = await axios.get('/api/v1/getKey');
      // Create PaymentIntent on backend
      const { data: paymentData } = await axios.post('/api/v1/payment/process', { amount, currency: 'usd' });
      const clientSecret = paymentData.clientSecret;
      if (!stripe || !elements) {
        toast.error('Stripe has not loaded', { position: 'top-center', autoClose: 3000 });
        setLoading(false);
        return;
      }
      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user.name,
            email: user.email,
            phone: shippingInfo.phoneNumber,
          },
        },
      });
      if (error) {
        toast.error(error.message, { position: 'top-center', autoClose: 3000 });
        setLoading(false);
        return;
      }
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        navigate(`/paymentSuccess?reference=${paymentIntent.id}`);
      } else {
        toast.error('Payment failed', { position: 'top-center', autoClose: 3000 });
      }
    } catch (error) {
      toast.error(error.message, { position: 'top-center', autoClose: 3000 });
    }
    setLoading(false);
  };

  return (
    <form
      className="payment-form"
      onSubmit={e => {
        e.preventDefault();
        completePayment(orderItem.total);
      }}
    >
      <CardElement className="stripe-card-element" options={{ style: { base: { fontSize: '16px' } } }} />
      <button className="payment-btn" type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Pay ($${orderItem.total})`}
      </button>
    </form>
  );
}

function Payment() {
  const orderItem = JSON.parse(sessionStorage.getItem('orderItem'));
  const { user } = useSelector(state => state.user);
  const { shippingInfo } = useSelector(state => state.cart);
  const [greenTheme, setGreenTheme] = useState(false);

  return (
    <>
      <PageTitle title="Payment Processing" />
      <Navbar />
      <CheckoutPath activePath={2} />
      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
        <button
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            border: 'none',
            background: greenTheme ? '#388e3c' : '#6c757d',
            color: 'white',
            cursor: 'pointer',
            marginBottom: '1rem',
            fontWeight: 'bold',
            transition: 'background 0.3s',
          }}
          onClick={() => setGreenTheme(t => !t)}
        >
          {greenTheme ? 'Switch to Default Theme' : 'Switch to Green Theme'}
        </button>
      </div>
      <div className={`payment-container${greenTheme ? ' green-theme' : ''}`}>
        <Link to="/order/confirm" className='payment-go-back'>Go Back</Link>
        <Elements stripe={stripePromise}>
          <StripePaymentForm orderItem={orderItem} user={user} shippingInfo={shippingInfo} />
        </Elements>
      </div>
      <Footer />
    </>
  );
}

export default Payment;
