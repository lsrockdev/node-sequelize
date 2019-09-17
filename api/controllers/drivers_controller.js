const db = require("../services/db.service.js");

const DriversController = () => {
  const getAll = async (req, res) => {
    try {
      const drivers = await db.Driver.findAll({
        where: {
          isDeleted: false
        }
      });
      return res.status(200).json({
        drivers,
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const deleteOne = async (req, res) => {
    const { body } = req;
    try {
      const driver = await db.Driver.findOne({ where: { id: body.id } });
      await driver.update({ isDeleted: true });
      return res.status(200).json({
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const addOne = async (req, res) => {
    const { body } = req;
    try {
      const driver = await db.Driver.create(body);
      return res.status(200).json({
        driver: driver,
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const updateOne = async (req, res) => {
    const { body } = req;
    try {
      await db.Driver.update(body, { where: { id: body.id } });
      return res.status(200).json({
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  return {
    getAll,
    deleteOne,
    addOne,
    updateOne
  };
};

module.exports = DriversController;
