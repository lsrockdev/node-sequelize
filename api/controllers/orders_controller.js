const getCurrentUser = require("../helpers/current_user_helper");

const OrdersController = () => {
  const placeOrder = async (req, res) => {
    // const { body } = req.body;
    // const customerId = req.token.id;
    // const currentUser = await getCurrentUser("Customer", customerId);
    return res.status(200).json({
      Message: "testing",
      StatusCode: 1
    });
  };

  return { placeOrder };
};

module.exports = OrdersController;
