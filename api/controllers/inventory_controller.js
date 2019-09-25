const db = require("../../models");

const InventoryController = () => {
  const getAllByStoreId = async storeId => {
    try {
      const inventories = await db.Inventory.findAll({
        where: { storeId },
        include: [db.Product, db.Category, db.Size],
        attributes: ["id", "price"]
      });
      return inventories;
    } catch (err) {
      console.log(err);
      throw new Error("Internal server error");
    }
  };

  const getOneById = async id => {
    try {
      const inventory = await db.Inventory.findOne({
        where: { id }
      });
      return inventory;
    } catch (err) {
      console.log(err);
      throw new Error("Internal server error");
    }
  };

  const addOne = async data => {
    try {
      const inventory = await db.Inventory.create({
        ...data,
        isActive: true
      });
      return inventory;
    } catch (err) {
      console.log(err);
      throw new Error("Internal server error");
    }
  };

  const updateOne = async id => {};

  const deleteOne = async id => {};

  return {
    getAllByStoreId,
    getOneById,
    addOne,
    updateOne,
    deleteOne
  };
};

module.exports = InventoryController;
