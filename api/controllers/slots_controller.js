var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const dayjs = require("dayjs");

const db = require("../services/db.service.js");

const SlotController = () => {
  const getAllSlotsForDay = async (req, res) => {
    let requestedDate = dayjs(req.query.day);
    try {
      const slots = await db.Slot.findAll({
        where: startsOnDay(requestedDate),
        attributes: [
          "id",
          "start",
          "finish",
          "isMaxedOut",
          "isSelectable",
          "maxDeliveriesAllowed"
        ],
        include: [
          {
            model: db.Driver,
            attributes: ["id", "email", "phone", "firstName", "lastName"]
          }
        ]
      });

      const slotsMap = slots.map(slot => {
        let driver =
          slot.dataValues.Drivers.length > 0
            ? slot.dataValues.Drivers[0]
            : null;
        delete slot.dataValues.Drivers;
        delete driver.DriverSlot;
        return {
          ...slot.dataValues,
          driver
        };
      });

      return res.status(200).json({
        slots: slotsMap,
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const getDriverBlockedSlots = async (req, res) => {
    if (!req.query.driverId && !req.query.day) {
      return res.status(200).json({
        slots: [],
        message: "success",
        StatusCode: 1
      });
    }
    let driverId = parseInt(req.query.driverId);
    let requestedDate = dayjs(req.query.day);

    try {
      const slots = await db.Slot.findAll({
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
    const dtFormat = "YYYY-MM-DD HH:mm:ss";
    const driverId = req.body.driverId;
    const start = dayjs(req.body.start).format(dtFormat);
    const finish = dayjs(req.body.finish).format(dtFormat);

    try {
      const slot = await db.Slot.create({ start, finish });
      const driverSlot = await db.DriverSlot.create({
        driverId: driverId,
        slotId: slot.id
      });
      return res.status(200).json({
        driverSlot,
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const deleteBlockedSlot = async (req, res) => {
    let driverId = req.body.driverId;
    let slotId = dayjs(req.query.slotId);

    try {
      const slots = await db.DriverSlot.destroy({
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
    deleteBlockedSlot,
    addDriverToSlots,
    getAllSlotsForDay
  };
};

module.exports = SlotController;
