var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const dayjs = require("dayjs");

const db = require("../services/db.service.js");

const SlotController = () => {
  const getDriverBlockedSlots = async (req, res) => {
    let driverId = parseInt(req.query.driverId);
    let requestedDate = dayjs(req.query.day);

    try {
      const slots = await db.Slot.findAll({
        where: startsOnDay(requestedDate),
        include: [{ model: db.DriverSlot, where: { driverId: driverId } }]
      });

      return res.status(200).json({
        slots: slots,
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const deleteAllDriverSlots = async (req, res) => {
    const { driverId, day } = req.body;
    const requestedDate = dayjs(day);

    try {
      const slots = await db.DriverSlot.destroy({
        where: { driverId: driverId },
        include: [{ model: db.Slot, where: startsOnDay(requestedDate) }]
      });

      return res.status(200).json({
        slots: slots,
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const addDriverToSlots = async (req, res) => {
    // TODO: create slot(s) for a given start-->end range of hours, driver and day
    const { driverId, start, end } = req.body;
    // const requestedDate = dayjs(day);

    try {
      const slots = await db.Slot({
        where: {
          start: {
            [Op.and]: [
              { [Op.gte]: dayjs(start).toDate() },
              { [Op.lt]: dayjs(end).toDate() }
            ]
          }
        }
      });

      // loop through and create driverSlots for each slot:
      for (let slot of slots) {
        db.DriverSlot.create({
          driverId,
          slotId
        });
      }
      const slots = await db.Slot({
        where: { start: { $between: [start, end] } }
      });

      return res.status(200).json({
        slots: slots,
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const deleteBlockedSlot = async (req, res) => {
    let driverId = parseInt(req.query.driverId);
    let slotId = dayjs(req.query.slotId);

    try {
      const slots = await DriverSlot.destroy({
        where: { driverId: driverId },
        include: [{ model: db.Slot, where: { id: slotId } }]
      });

      return res.status(200).json({
        slots: slots,
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  function startsOnDay(day) {
    let requestedDate = dayjs(day);
    let nextDate = requestedDate.add(1, "day");
    let dateFormat = "YYYY-MM-DD";
    let conditions = {
      start: {
        [Op.and]: [
          { [Op.gte]: requestedDate.format(dateFormat) },
          { [Op.lt]: nextDate.format(dateFormat) }
        ]
      }
    };
    return conditions;
  }

  return {
    getDriverBlockedSlots,
    deleteAllDriverSlots,
    addDriverToSlots
  };
};

module.exports = SlotController;
