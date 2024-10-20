const stripe = Stripe('your-publishable-key'); // Replace with your Stripe public key
const elements = stripe.elements();
const card = elements.create('card');
card.mount('#card-element');


const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const { paymentIntent, error } = await stripe.createPaymentIntent({
    amount: document.getElementById('amount').value * 100,
    currency: 'usd',
  });

  if (error) {
    document.getElementById('card-errors').textContent = error.message;
  } else {
    alert('Thank you for your donation!');
  }
});
