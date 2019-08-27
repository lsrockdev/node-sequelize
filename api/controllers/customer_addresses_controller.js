const Customer = require("../../models").Customer;
const UserLocation = require("../../models").UserLocation;
const getCurrentUser = require("../helpers/current_user_helper");
var _ = require("lodash");

const CustomerController = () => {
  const addCustomerAddress = async (req, res) => {
    const { body } = req;
    customerId = req.token.id;
    // const currentUser = await getCurrentUser("Customer", customerId);

    try {
      // Whitelist allowable attributes:
      const filteredAttributes = _.pick(body, [
        "address1",
        "address2",
        "address3",
        "type",
        "latitude",
        "longitude",
        "isActive",
        "stateId"
      ]);

      console.log(filteredAttributes);

      const address = await UserLocation.create({
        ...filteredAttributes,
        customerId: customerId
      });

      return res.status(200).json({
        message: "Successfully added address",
        address: address
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const getCustomerAddresses = async (req, res) => {
    const { body } = req;
    customerId = req.token.id;
    // const currentUser = await getCurrentUser("Customer", customerId);

    try {
      const addresses = await UserLocation.findAll({
        where: {
          isActive: true,
          customerId: customerId
        }
      });

      return res.status(200).json({
        message: "Successfully retrieved addresses",
        addresses: addresses
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  return {
    addCustomerAddress,
    getCustomerAddresses
  };
};

module.exports = CustomerController;
