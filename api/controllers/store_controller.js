const Store = require("../../models").Store;
const Customer = require("../../models").Customer;
const StoreUser = require("../../models").StoreUser;

const UserLocation = require("../../models").UserLocation;
const LocationHelper = require("../helpers/location_helper");

const StoreController = () => {
  const getByCustomerId = async (req, res) => {
    customerId = req.token.id;
    try {
      const addresses = await UserLocation.findAll({
        where: {
          isActive: false || null,
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

      Store.hasMany(Customer, { foreignKey: "userId" });
      StoreUser.belongsTo(Store, { foreignKey: "userId" });

      const allStores = Store.findAll({
        where: {
          isDeleted: false || null
        },
        include: [StoreUser]
      });
      const availableStores = await allStores.filter(async store => {
        const distance = await LocationHelper().distanceBetweenLocations(
          activeAddress,
          store.StoreUser.address
        );
        if (distance > 20) {
          return store;
        }
      });

      if (availableStores.length == 0) {
        return res.status(200).json({
          message: `This address is currently out of range of all Tapster stores. We'll be coming to you soon!`,
          StatusCode: 0
        });
      }
      return res.status(200).json({
        stores,
        message: `Available stores count:${count}`,
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  return {
    getByCustomerId
  };
};

module.exports = StoreController;
