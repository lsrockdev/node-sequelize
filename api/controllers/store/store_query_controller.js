const Store = require("../../../models").Store;
const Customer = require("../../../models").Customer;
const StoreUser = require("../../../models").StoreUser;

const UserLocation = require("../../../models").UserLocation;
const LocationHelper = require("../../helpers/location_helper");
const cartController = require("../cart_controller");

// At some point can replace Store, StoreUser, and UserLocation references with db.Store, db.StoreUser, etc:
const db = require("../../services/db.service.js");

const StoreQueryController = () => {
  const getByCustomerId = async (req, res) => {
    const customerId = req.token.id;
    try {
      const addresses = await UserLocation.findAll({
        where: {
          isActive: true,
          customerId: customerId
        }
      });
      if (addresses.length == 0) {
        return res.status(200).json({
          message: `Currently there is no active Address.Please try again`,
          StatusCode: 0
        });
      }
      const activeAddress = addresses[0];

      return res.status(200).json(await getStoresByLocation(activeAddress));
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const getByLocation = async (req, res) => {
    const { address } = req.body;
    return res.status(200).json(await getStoresByLocation(address));
  };

  const checkAddressWithInStoresRange = async (req, res) => {
    const { address } = req.body;
    const customerId = req.token.id;
    const storesRes = await getStoresByLocation(address);
    const activeStore = cartController().getActiveStore(customerId);

    if (storesRes.status != 1) {
      return res.status(200).json(storesRes);
    }
    if (activeStore == null) {
      return res.status(200).json({
        message: "",
        StatusCode: 1, //success
        stores: stores
      });
    }

    if (storesRes.stores.map(store => store.id).include(activeStore.id)) {
      return res.status(200).json({
        message: "",
        StatusCode: 1 //success
      });
    }
    return res.status(200).json({
      message: `This address is out of the delivery range of ${activeStore.name} store. 
                Please empty your cart and choose a store within delivery range.`,
      StatusCode: 3 //success
    });
  };

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
      console.log("store address", store.address);

      const distance = await LocationHelper().distanceBetweenLocations(
        address,
        store.address
      );
      console.log("distance", distance);
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

  const getAll = async (req, res) => {
    try {
      const stores = await Store.findAll({
        where: {
          isDeleted: false
        }
      });
      return res.status(200).json({
        stores,
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const getById = async (req, res) => {
    const { id } = req.body;
    try {
      const store = await Store.findOne({
        where: {
          id
        }
      });
      return res.status(200).json({
        store,
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const getOrdersByStoreId = async (req, res) => {
    const { storeId } = req.body;
    try {
      const orders = await db.Order.findAll({
        where: {
          storeId
        }
      });
      return res.status(200).json({
        orders,
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  return {
    getByCustomerId,
    getByLocation,
    checkAddressWithInStoresRange,
    getAll,
    getById,
    getOrdersByStoreId
  };
};

module.exports = StoreQueryController;
