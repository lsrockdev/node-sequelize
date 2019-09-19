const StoreCode = require("../../models").StoreCode;
const Store = require("../../models").Store;
const Sequelize = require("sequelize");
const db = require("../../models");
const OrderStatus = require("../constant/enum").OrderStatus;

const Order = require("../../models").Order;
const LineItem = require("../../models").LineItem;

const OrderQueryController = () => {
  const getNewOrders = async (req, res) => {
    try {
      console.log(OrderStatus);
      const condition = {
        status: {
          [Sequelize.Op.in]: [
            OrderStatus.KEG_READY,
            OrderStatus.SCHEDULED4PICKUP
          ]
        }
      };
      return res.status(200).json({
        orders: await this.getAllBy(condition),
        message: "Successfully returned Orders",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const getbyId = async (req, res) => {
    try {
      const { id } = req.query;
      const order = await getOneBy({ id });
      return res.status(200).json({
        order,
        message: "Successfully returned Orders",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const getAllBy = async condition => {
    console.log(condition);
    try {
      return await db.Order.findAll({
        where: {
          status: {
            [Sequelize.Op.in]: [
              OrderStatus.KEG_READY,
              OrderStatus.SCHEDULED4PICKUP
            ]
          }
        },
        include: [db.LineItem]
      });
    } catch (err) {
      console.log(err);
      throw new Error("Internal server error");
    }
  };

  const getOneBy = async condition => {
    try {
      return await db.Order.findOne({
        where: condition,
        include: [LineItem]
      });
    } catch (err) {
      console.log(err);
      throw new Error("Internal server error");
    }
  };

  return {
    getNewOrders,
    getbyId
  };
};

module.exports = OrderQueryController;
