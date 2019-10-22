var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const dayjs = require("dayjs");

const db = require("../services/db.service.js");
const sequelize = require("../../models").sequelize;

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

  const getDriverBlockedSlots = async (req, res) => {
    if (!req.query.driverId) {
      return res.status(200).json({
        slots: [],
        message: "success",
        StatusCode: 1
      });
    }
    let driverId = parseInt(req.query.driverId);
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
      const slots = await db.Slot.findAll({
        where: startsOnDay(requestedDate)
      });
      const slotIds = slots.map(slot => slot.dataValues.id);
      await db.DriverSlot.destroy({
        where: {
          driverId,
          slotId: slotIds
        }
      });

      await sequelize.query(`update Slots s set isSelectable = false 
          where (select count(*) as num from DriverSlots where slotId = s.id) = 0
          and s.id in ('${slotIds.join("', '")}')`);

      return res.status(200).json({
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
      const slots = await db.Slot.findAll({
        where: {
          start: { [Op.gte]: start },
          finish: { [Op.lte]: finish }
        }
      });
      const driverSlots = slots.map(slot => ({
        driverId,
        slotId: slot.dataValues.id
      }));
      await db.DriverSlot.bulkCreate(driverSlots);
      await db.Slot.update(
        {
          isSelectable: true
        },
        {
          where: {
            start: { [Op.gte]: start },
            finish: { [Op.lte]: finish }
          }
        }
      );
      return res.status(200).json({
        driverSlots,
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

  async function startsOnDay(day) {
    const orderLagMinutes = await db.Setting.findOne({ where: { name: "orderLagMinutes" } });
    let requestedDate = dayjs(day).add(orderLagMinutes.value || 0, "minutes");
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
