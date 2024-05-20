require('dotenv').config()

const express = require('express');
const app = express();
const cors = require("cors")

app.use(express.json());

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
)

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/create-checkout-session', async (req, res) => {
    try {
        const totalPayment = req.body.totalPayment;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [{
                price_data: {
                    currency: "vnd",
                    product_data: {
                        name: "Total Payment",
                    },
                    unit_amount: totalPayment * 1000, // Convert sang đơn vị cents
                },
                quantity: 1, // Chỉ cần một mặt hàng với số tiền tổng cần thanh toán
            }],
            success_url: `http://127.0.0.1:5500/html/success.html`,
            cancel_url: `http://127.0.0.1:5500/html/cancel.html`,
        });
        
        res.json({url: session.url});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


app.listen(3000)