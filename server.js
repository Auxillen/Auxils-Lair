const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("your-stripe-secret-key-here");

const app = express();
app.use(cors());
app.use(express.json());

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
            unit_amount: 1999,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://your-website.com/success",
      cancel_url: "https://your-website.com/cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
