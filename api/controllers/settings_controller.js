const db = require("../services/db.service.js");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const dayjs = require("dayjs");

const SettingsController = () => {
  const getAll = async (req, res) => {
    try {
      const settings = await db.Setting.findAll({});
      return res.status(200).json({
        settings,
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const getByName = async (req, res) => {
    const { name } = req.body;
    try {
      const setting = await db.Setting.findOne({
        where: {
          name
        }
      });
      return res.status(200).json({
        setting,
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
      const setting = await db.Setting.findOne({
        where: { name: body.name }
      });
      if (setting) {
        await setting.update({ value: body.value });
      } else {
        await db.Setting.create(body);
      }

      // Update and check each slot if updating maxDeliveriesAllowed:
      if (body.name === "maxDeliveriesAllowed") {
        const maxDeliveriesAllowed = body.value;
        await updateAndCheckMaxForEachSlot(maxDeliveriesAllowed);
      }

      return res.status(200).json({
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  async function updateAndCheckMaxForEachSlot(maxDeliveriesAllowed) {
    let requestedDate = dayjs(Date.now()).toDate();
    // let requestedDate = "2019-09-27 10:55:44"; // for testing

    const slots = await db.Slot.findAll({
      where: {
        start: {
          [Op.gte]: requestedDate
        }
      }
    });

    for (let slot of slots) {
      // Disallow more deliveries for the Slot if maxDeliveriesAllowed has been reached
      let deliveriesCount = await db.Order.count({
        where: { slotId: slot.id }
      });

      if (deliveriesCount >= maxDeliveriesAllowed) {
        await db.Slot.update(
          { isMaxedOut: true, isSelectable: false, maxDeliveriesAllowed },
          { where: { id: slot.id } }
        );
      } else {
        // Update maxDeliveries Allowed for the slot:
        await slot.update({ maxDeliveriesAllowed, isMaxedOut: false });
      }
    }
  }

  return {
    getAll,
    getByName,
    updateOne
  };
};
module.exports = SettingsController;
