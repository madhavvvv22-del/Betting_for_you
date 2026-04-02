const Razorpay = require('razorpay');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Initialize Razorpay with the keys from environment variables
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        // Create an order for 1 INR (100 paise)
        const options = {
            amount: 100, // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: "receipt_order_" + Math.random().toString(36).substring(7),
        };

        const order = await razorpay.orders.create(options);

        // Return the required order details to the frontend
        res.status(200).json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
            key_id: process.env.RAZORPAY_KEY_ID // Send public key to frontend securely
        });
    } catch (error) {
        console.error("Razorpay Order Creation Error:", error);
        res.status(500).json({ message: 'Failed to create Razorpay order', error: error.message });
    }
}
