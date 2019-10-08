const Store = require("../../../models").Store;
const StoreCode = require("../../../models").StoreCode;

const StoreUser = require("../../../models").StoreUser;

// At some point can replace Store, StoreUser, and UserLocation references with db.Store, db.StoreUser, etc:
const db = require("../../services/db.service.js");

const StoreUpdateController = () => {
  const addOne = async (req, res) => {
    const { body } = req;
    try {
      const store = await Store.create(body);
      return res.status(200).json({
        store: store,
        message: "Store Added Succesfully",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const updateOne = async (req, res) => {
    const { body } = req;
    try {
      await Store.update(body, { where: { id: body.id } });
      return res.status(200).json({
        message: "Your store successfully updated.",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const deleteOne = async (req, res) => {
    const { body } = req;
    try {
      const store = await Store.findOne({ where: { id: body.id } });
      await store.update({ isDeleted: true });
      await StoreCode.destroy({
        where: { code: store.uid }
      });
      return res.status(200).json({
        message: "Store Deleted Succesfully",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  return {
    addOne,
    updateOne,
    deleteOne
  };
};

module.exports = StoreUpdateController;
