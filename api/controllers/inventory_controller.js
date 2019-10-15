const db = require("../../models");

const InventoryController = () => {
  const getAllByStoreId = async storeId => {
    try {
      const inventories = await db.Inventory.findAll({
        where: { storeId, isDeleted: false },
        include: [db.Product, db.Category, db.Size],
        attributes: ["id", "price", "quantity"],
        order: [["id", "DESC"]]
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
        where: { id, isDeleted: false }
      });
      return inventory;
    } catch (err) {
      console.log(err);
      throw new Error("Internal server error");
    }
  };

  const getOne = async condition => {
    try {
      const inventory = await db.Inventory.findOne({
        where: condition
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

  const updateOne = async data => {
    try {
      const inventory = await db.Inventory.findOne({
        where: {
          id: data.id
        }
      });
      await inventory.update(data);
      return inventory;
    } catch (err) {
      console.log(err);
      throw new Error("Internal server error");
    }
  };

  const deleteOne = async id => {
    try {
      await db.Inventory.update({ isDeleted: 1 }, { where: { id } });
      return true;
    } catch (err) {
      console.log(err);
      throw new Error("Internal server error");
    }
  };

  return {
    getAllByStoreId,
    getOneById,
    getOne,
    addOne,
    updateOne,
    deleteOne
  };
};

module.exports = InventoryController;
