const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const stripeController = async (req, res) => {
  const { purchase, total_amount, shipping_fee } = req.body

  //! Always create a function to calculate the final price since the values on the frontend can be manipulated
  const calculateOrderAmount = () => {
    return total_amount + shipping_fee
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(),
    currency: 'inr',
  })
  console.log(paymentIntent)
  res.json({ clientSecret: paymentIntent.client_secret })
}

module.exports = stripeController
