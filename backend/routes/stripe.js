const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_KEY);
require('dotenv').config();

const router = express.Router();

//grabs cart from cart items component

router.post('/create-checkout-session', async (req, res) => {
  const cartItems = req.body.cartItems;
  const lineItems = cartItems.map((item) => {
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          images: [item.img],
        },
        unit_amount: parseFloat(item.price) * 100,
      },
      quantity: item.count,
    };
  });


  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'required',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA'],
    },
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.WEB_APP_URL}/checkout-success`,
    cancel_url: `${process.env.WEB_APP_URL}/cart`,
  });

  res.send({url: session.url});
});


module.exports = router;

