const router = require('express').Router();
const express = require('express');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);

const Order = require('../models/Order');

router.post('/create-checkout-session', async (req, res) => {
  const cartItems = req.body.cartItems;

  // Calculate the total amount of the order
  const orderTotal = cartItems.reduce((total, item) => {
    return total + parseFloat(item.price) * item.count;
  }, 0);

  // Determine the shipping amount based on the order total
  let shippingAmount = 0;
  if (orderTotal < 50) {
    shippingAmount = 1500; // $15 in cents
  }

  const lineItems = cartItems.map((item) => {
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          images: [item.img],
        },
        unit_amount: Math.round(parseFloat(item.price) * 100),
      },
      quantity: item.count,
    };
  });

  // Add a shipping line item with the calculated shipping amount
  if (shippingAmount > 0) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Shipping',
        },
        unit_amount: shippingAmount,
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'required',
    shipping_address_collection: {
      allowed_countries: ['US'],
    },
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.WEB_APP_URL}/checkout-success`,
    cancel_url: `${process.env.WEB_APP_URL}/cart`,
  });

  res.send({ url: session.url });
});

module.exports = router;
