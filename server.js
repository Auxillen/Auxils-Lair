require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = "https://api-m.paypal.com"; // Live PayPal API (use sandbox for testing)

let verifiedPayments = new Set(); // Store verified transaction IDs

// Create Stripe Checkout Session
app.post("/create-checkout-session", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Gaming Merchandise",
                        },
                        unit_amount: 500, // 5 USD
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "https://your-website.com/loader.html?orderID={CHECKOUT_SESSION_ID}",
            cancel_url: "https://your-website.com/cancel",
        });
        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Generate PayPal Access Token
async function getPayPalAccessToken() {
    const response = await fetch(\`\${PAYPAL_API}/v1/oauth2/token\`, {
        method: "POST",
        headers: {
            "Authorization": \`Basic \${Buffer.from(\`\${PAYPAL_CLIENT_ID}:\${PAYPAL_SECRET}\`).toString("base64")}\`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials"
    });
    const data = await response.json();
    return data.access_token;
}

// Verify PayPal Payment
async function verifyPayPalPayment(orderID) {
    const accessToken = await getPayPalAccessToken();
    const response = await fetch(\`\${PAYPAL_API}/v2/checkout/orders/\${orderID}\`, {
        method: "GET",
        headers: {
            "Authorization": \`Bearer \${accessToken}\`,
            "Content-Type": "application/json"
        }
    });

    const orderData = await response.json();
    if (orderData.status === "COMPLETED") {
        verifiedPayments.add(orderID);
        return true;
    }
    return false;
}

// API Route to Confirm PayPal Payment
app.post("/verify-payment", async (req, res) => {
    const { orderID } = req.body;
    if (!orderID) return res.status(400).json({ error: "No order ID provided." });

    const isValid = await verifyPayPalPayment(orderID);
    if (isValid) {
        return res.json({ success: true });
    } else {
        return res.status(400).json({ error: "Payment not verified." });
    }
});

// API Route to Check Payment Access
app.get("/check-access/:orderID", (req, res) => {
    const { orderID } = req.params;
    if (verifiedPayments.has(orderID)) {
        return res.json({ access: true });
    } else {
        return res.status(403).json({ access: false });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
