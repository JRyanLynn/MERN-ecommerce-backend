const stripeAPI = require('stripe')(process.env.STRIPE_KEY);

module.exports = stripeAPI;


