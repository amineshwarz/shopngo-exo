import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY){
    throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe( process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-09-30.clover", //"2025-04-30.basil" si besoin
});

export default stripe;