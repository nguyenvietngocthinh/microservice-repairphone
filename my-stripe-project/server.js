const express = require('express');
const stripe = require('stripe')('your-stripe-secret-key'); // Thay 'your-stripe-secret-key' bằng khóa bí mật của bạn từ Stripe
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/create-checkout-session', async (req, res) => {
    const { totalPayment } = req.body;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'vnd',
                product_data: {
                    name: 'Product Payment',
                },
                unit_amount: totalPayment,
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: 'http://localhost:3000/success.html',
        cancel_url: 'http://localhost:3000/cancel.html',
    });

    res.json({ id: session.id });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
