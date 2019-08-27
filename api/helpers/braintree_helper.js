var braintree = require("braintree");
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config.js")[env];

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "your_merchant_id",
  publicKey: "your_public_key",
  privateKey: "your_private_key"
});

const BraintreeHelper = () => {
  const generateBraintreeToken = async braintreeCustomerId => {
    return new Promise(resolve => {
      if (braintreeCustomerId) {
        gateway.clientToken.generate(
          {
            customerId: braintreeCustomerId
          },
          function(err, response) {
            resolve({ err, response });
          }
        );
      } else {
        gateway.clientToken.generate({}, function(err, response) {
          resolve({ err, response });
        });
      }
    });
  };
  return {
    generateBraintreeToken
  };
};

module.exports = BraintreeHelper;
