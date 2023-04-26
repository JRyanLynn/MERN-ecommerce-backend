//double check this route if error is thrown
const stripeAPI = require('stripe')(process.env.STRIPE_KEY);

async function createCheckoutSession (req, res) {
    //redirect when order finished
    const domainUrl = process.env.WEB_APP_URL;
    const {line_items, customer_email} = req.body;
    //check that req body has product line items and email
    if (!line_items || !customer_email) {
        return res.status(400).json({error: 'Missing required checkout information'});
    }
    //Adding CSP header
     res.set('Content-Security-Policy', 'script-src https://connect-js.stripe.com https://js.stripe.com; frame-src https://connect-js.stripe.com; style-src unsafe-inline');

    //create a checkout session
    let session;

    try {
        session = await stripeAPI.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            customer_email,
            //make sure to create this route on front end
            success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domainUrl}/canceled`,
            shipping_address_collection: {allowed_countries: ['US']}
        });
        res.status(200).json({sessionId: session.id})
    } catch (error) {
        console.log(error);
        res.status(400).json({error: 'Error: unable to create session'});
    }
}

module.exports = createCheckoutSession;
