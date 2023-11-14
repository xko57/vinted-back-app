const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/vinted-app").then(() => {
  console.log("Successful connection to database");
});

cloudinary.config({
  cloud_name: "dovg6lerq",
  api_key: "854678481371676",
  api_secret: "vxpqCGVsVQE04PYEM5zzWiSgRlA",
});

app.use(cors());
app.use(express.json());

const offerRoute = require("./routes/offer");
const userRoute = require("./routes/user");
const paymentRoute = require("./routes/payments");

app.use(offerRoute);
app.use(userRoute);
app.use(paymentRoute);

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

app.listen(3000, () => {
  console.log("Server started");
});
