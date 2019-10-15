const Store = require("../../../models").Store;
const StoreCode = require("../../../models").StoreCode;

const StoreUser = require("../../../models").StoreUser;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const request = require("request-promise-native");

// At some point can replace Store, StoreUser, and UserLocation references with db.Store, db.StoreUser, etc:
const db = require("../../services/db.service.js");

const StoreUpdateController = () => {
  const addOne = async (req, res) => {
    const { body } = req;
    try {
      const store = await Store.create(body);
      return res.status(200).json({
        store: store,
        message: "Store Added Succesfully",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const updateOne = async (req, res) => {
    const { body } = req;
    try {
      await Store.update(body, { where: { id: body.id } });
      return res.status(200).json({
        message: "Your store successfully updated.",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const deleteOne = async (req, res) => {
    const { body } = req;
    try {
      const store = await Store.findOne({ where: { id: body.id } });
      await store.update({ isDeleted: true });
      await StoreCode.destroy({
        where: { code: store.uid }
      });
      return res.status(200).json({
        message: "Store Deleted Succesfully",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const stripeConnectOath = async (req, res) => {
    try {
      // Lookup store by tapster code:
      const store = await Store.findOne({ where: { uid: req.query.state } });

      // Post the authorization code to Stripe to complete the Express onboarding flow
      const expressAuthorized = await request.post({
        uri: "https://connect.stripe.com/oauth/token",
        form: {
          grant_type: "authorization_code",
          client_id: process.env.STRIPE_CLIENT_ID,
          client_secret: process.env.STRIPE_SECRET_KEY,
          code: req.query.code
        },
        json: true
      });

      if (expressAuthorized.error) {
        throw expressAuthorized.error;
      }

      // Update the model and store the Stripe account ID in the datastore:
      // this Stripe account ID will be used to issue payouts to the store
      await store.update({ stripeToken: expressAuthorized.stripe_user_id });

      // Redirect to the store dashboard
      res.redirect("https://tapsterstore.herokuapp.com/");
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  return {
    addOne,
    updateOne,
    deleteOne,
    stripeConnectOath
  };
};

module.exports = StoreUpdateController;
