const db = require("../services/db.service.js");
const Sequelize = require("sequelize");

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
      return res.status(500).json({ message: "Internal server error" });
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
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const addOne = async (req, res) => {
    const { body } = req;
    try {
      const existing = await db.Driver.findOne({
        where: {
          [Sequelize.Op.or]: [
            { email: body.email.toLowerCase() },
            { phone: body.phone }
          ],
          isDeleted: false
        }
      });
      if (!!existing) {
        return res.status(400).json({
          message: `${body.email.toLowerCase()} or ${
            body.phone
          } was already used in other accounts`
        });
      }
      const driver = await db.Driver.create(body);
      return res.status(200).json({
        driver: driver,
        message: "success",
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
      await db.Driver.update(body, { where: { id: body.id } });
      return res.status(200).json({
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
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
