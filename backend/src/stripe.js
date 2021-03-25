const Stripe = require('stripe');

const stripeConfig = new Stripe(process.env.STRIPE_SECRET || '', {
    apiVersion: '2020-08-27'
});

module.exports = stripeConfig