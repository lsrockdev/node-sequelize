const Customer = require("../../models").Customer;
const UserLocation = require("../../models").UserLocation;
const Store = require("../../models").Store;
const StoreUser = require("../../models").StoreUser;
const getCurrentUser = require("../helpers/current_user_helper");
const LocationHelper = require("../helpers/location_helper");
const storeQueryController = require("./store/store_query_controller");
var _ = require("lodash");

const CustomerController = () => {
  const updateCustomerAddress = async (req, res) => {
    const { body } = req;

    let address = await UserLocation.findOne({ where:{id: body.id} });

    if (address.customerId !== req.token.id) {
      return res.status(400).json({message: 'Customer does not own address.'});
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
      const details = await UserLocation.findOne({ where:{id: body.id} });
      const stores = await getStoresByLocation(details);
      return res.status(200).json({
        message: "Successfully set active address address",
        address: body.id,
        stores,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
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
      return res.status(500).json({ message: "Internal server error" });
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
      return res.status(500).json({ message: "Internal server error" });
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
          message: `There was a problem deleting address with id ${body.id}`
        });
      }
      return res.status(200).json({
        message: `Successfully deleted address with id ${body.id}`
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
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

const getStoresByLocation = async address => {
  StoreUser.hasOne(Store, { foreignKey: "userId" });
  Store.belongsTo(StoreUser, { foreignKey: "userId" });
  const allStores = await Store.findAll({
    where: {
      isDeleted: false
    },
    include: [StoreUser]
  });
  const availableStores = [];
  for (const store of allStores) {
    const distance = await LocationHelper().distanceBetweenLocations(
      address,
      store.address
    );
    if (distance != null && distance < 20) {
      availableStores.push(store);
    }
  }

  if (availableStores.length == 0) {
    return {
      message: `This address is currently out of range of all Tapster stores. We'll be coming to you soon!`,
      StatusCode: 0
    };
  }
  return {
    stores: availableStores,
    message: `Available stores count:${availableStores.length}`,
    StatusCode: 1
  };
};