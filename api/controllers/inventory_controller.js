const db = require("../../models").sequelize;

const InventoryController = () => {
  const getAll = async () => {
    // try {
    //   const codes = await StoreCode.findAll({
    //     include: [
    //       {
    //         model: Store
    //       }
    //     ]
    //   });
    //   return codes;
    // } catch (err) {
    //   console.log(err);
    //   throw new Error("Internal server error");
    // }
  };

  const addOne = async () => {};

  const updateOne = async id => {};

  const deleteOne = async id => {};

  return {
    getAll,
    addOne,
    updateOne,
    deleteOne
  };
};

module.exports = InventoryController;
