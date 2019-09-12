const Customer = require("../../models").Customer;
const UserLocation = require("../../models").UserLocation;
const getCurrentUser = require("../helpers/current_user_helper");
var _ = require("lodash");

const CustomerController = () => {
  const updateCustomerAddress = async (req, res) => {
    const { body } = req;

    let address = await UserLocation.findOne({ where:{id: body.id} });

    if (address.customerId !== req.token.id) {
      return res.status(400).json({msg: 'Customer does not own address.'});
    }

    // Whitelist allowable attributes:
    const filteredAttributes = _.pick(body, [
      "address1",
      "address2",
      "address3",
      "longitude",
      "latitude"
    ]);

    await address.update(filteredAttributes);

    address = await UserLocation.findOne({ where:{id: address.id} });

    return res.status(200).json({
      address,
      isvalid: true,
      message: "Successfully address customer",
    });
  };

  const setActiveCustomerAddress = async (req, res) => {
    const { body } = req;
    const customerId = req.token.id;
    try {
      await UserLocation.update({
        isActive: false,
      }, {
        where: {
          customerId: customerId,
        },
      });
      await UserLocation.update({
        isActive: true,
      }, {
        where: {
          customerId: customerId,
          id: body.id,
        },
      });
      return res.status(200).json({
        message: "Successfully set active address address",
        address: body.id
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const addCustomerAddress = async (req, res) => {
    const { body } = req;
    const customerId = req.token.id;
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
      await UserLocation.update({
        isActive: false,
      }, {
        where: {
          customerId: customerId,
        },
      });
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

  const deleteCustomerAddress = async (req, res) => {
    const { body } = req;
    customerId = req.token.id;
    // const currentUser = await getCurrentUser("Customer", customerId);

    try {
      const dbOperation = await UserLocation.destroy({
        where: {
          id: body.id,
          customerId: customerId
        }
      });

      if (!dbOperation) {
        return res.status(400).json({
          msg: `There was a problem deleting address with id ${body.id}`
        });
      }
      return res.status(200).json({
        message: `Successfully deleted address with id ${body.id}`
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  return {
    updateCustomerAddress,
    setActiveCustomerAddress,
    addCustomerAddress,
    getCustomerAddresses,
    deleteCustomerAddress
  };
};

module.exports = CustomerController;
