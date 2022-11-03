const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_TEST);
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("api is running");
});

app.post("/payment", cors(), async (req, res) => {
  let { amount, id } = req.body;
  console.log({ body: req.body });
  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "INR",
      description: "Fresh! fruits and vegtables",
      payment_method: id,
      confirm: true,
    });
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    res.json({
      payment: payment,
      message: "Payment successful",
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      error: error,
      message: "Payment failed",
      success: false,
    });
  }
});
const PORT = process.env.PORT;
app.listen(PORT || 6000, () => {
  console.log(`Sever is listening on port ${PORT}`);
});
