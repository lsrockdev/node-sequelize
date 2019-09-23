const Sequelize = require("sequelize");
const db = require("../../../api/services/db.service");
const OrderStatus = require("../../constant/enum").OrderStatus;

const OrderQueryController = () => {
  // customer app
  const getCustomerOrders = async (req, res) => {
    try {
      const customerId = req.token.id;
      return res.status(200).json({
        orders: await getAllBy({ customerId }),
        message: "Successfully returned Orders",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  // driver app
  const getNewOrders = async (req, res) => {
    try {
      const condition = {
        status: {
          [Sequelize.Op.in]: [
            OrderStatus.Keg_Ready,
            OrderStatus.ScheduledPickup
          ]
        }
      };
      return res.status(200).json({
        orders: await getAllBy(condition),
        message: "Successfully returned Orders",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const getDriverOrderHistory = async (req, res) => {
    try {
      query = req.query;
      const condition = {
        status: {
          [Sequelize.Op.in]: [
            OrderStatus.ClaimDeliver,
            OrderStatus.ClaimPickUp,
            OrderStatus.Declain,
            OrderStatus.Delivered,
            OrderStatus.DeliverFailed,
            OrderStatus.Pickup,
            OrderStatus.PickupFailed,
            OrderStatus.Returned
          ]
        },
        createdAt: {
          [Sequelize.Op.gte]: query.startDate
        },
        createdAt: {
          [Sequelize.Op.lte]: query.endDate
        },
        "$Driver.code$": query.code
      };
      return res.status(200).json({
        orders: await getAllBy(condition),
        message: "Successfully returned Orders",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
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
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const getAllBy = async condition => {
    try {
      return await db.Order.findAll({
        where: condition,
        include: [db.LineItem, db.Driver, db.Store, db.Customer]
      });
    } catch (err) {
      console.log(err);
      throw new Error("Internal server error");
    }
  };

  const getOneBy = async condition => {
    try {
      const order = await db.Order.findOne({
        where: condition,
        include: [
          {
            model: db.LineItem,
            include: [
              {
                model: db.Inventory,
                include: [
                  {
                    model: db.CategorySizes
                    // include: [
                    //   {
                    //     model: db.Size
                    //   }
                    // ]
                  }
                ]
              }
            ]
          },
          {
            model: db.Customer,
            include: [
              {
                model: db.UserLocation,
                where: { isActive: true },
                limit: 1,
                as: "addresses"
              }
            ]
          }
        ]
      });
      return order;
    } catch (err) {
      console.log(err);
      throw new Error("Internal server error");
    }
  };

  return {
    getNewOrders,
    getDriverOrderHistory,
    getCustomerOrders,
    getbyId
  };
};

module.exports = OrderQueryController;
