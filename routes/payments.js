const express = require("express");
const router = express.Router();

const stripe = require("stripe")(
  "sk_test_51OCSQqLiLx0j5jpb4bRzyAFocPqDUkgw66dSfIkuJz3duqfs0eIRVwJPsaPBrxqlerpDPWUg9FvCkhxpwKwnpriU007TJA1DCW"
);

router.post("/payment", async (req, res) => {
  try {
    //console.log(req.body);
    // Je récupère le token reçu depuis le front
    const stripeToken = req.body.stripeToken;
    // Je fais une requête à stripe pour créer une transaction
    const responseFromStripe = await stripe.charges.create({
      amount: req.body.price * 100,
      currency: "eur",
      description: req.body.title,
      source: stripeToken,
    });
    // Si le paiement s'est bien passé, on met à jour l'offre et on renvoie au front le fait que tout s'est bien passé

    console.log(responseFromStripe);
    res.json({ status: responseFromStripe.status });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
