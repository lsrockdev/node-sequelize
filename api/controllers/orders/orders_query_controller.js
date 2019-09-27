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
  const getOrdersByStatus = async (req, res) => {
    try {
      const statusValues = JSON.parse(req.query.status);
      const condition = {
        status: {
          [Sequelize.Op.in]: statusValues
        }
      };
      const orders = await db.Order.findAll({
        where: condition,
        include: [
          db.LineItem,
          db.Store,
          {
            model: db.Customer,
            include: [
              {
                model: db.UserLocation,
                where: { isActive: true },
                limit: 1,
                attributes: [
                  "address1",
                  "address2",
                  "address3",
                  "latitude",
                  "longitude"
                ],
                as: "addresses"
              }
            ],
            attributes: [
              "id",
              "email",
              "phone",
              "firstName",
              "userName",
              "gender"
            ]
          }
        ]
      });

      return res.status(200).json({
        orders,
        message: "Successfully returned Orders",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // store dashboard

  const getOrdersByStoreId = async (req, res) => {
    try {
      const storeId = req.query.storeId;
      const orders = await db.Order.findAll({
        where: { storeId },
        attributes: [
          "id",
          "status",
          "createdAt",
          "deliveredAt",
          "returnedAt",
          "pickupAt",
          "total",
          "penalty",
          "kegsDeliveredQty",
          "tapsDeliveredQty",
          "kegsReturnedQty",
          "tapsReturnedQty"
        ],
        include: [
          {
            model: db.Customer,
            attributes: ["email", "phone", "firstName", "lastName"]
          }
        ]
      });
      return res.status(200).json({
        orders,
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

  const getbyIdForDriver = async (req, res) => {
    try {
      const { id } = req.query;
      const order = await db.Order.findOne({
        where: { id },
        include: [
          {
            model: db.LineItem,
            include: [
              {
                model: db.Inventory,
                include: [
                  {
                    model: db.Size,
                    attributes: ["id", "name", "size", "description"]
                  },
                  {
                    model: db.Product,
                    attributes: ["id", "name", "description"]
                  },
                  {
                    model: db.Store,
                    attributes: ["id", "name"]
                  }
                ],
                attributes: ["id"]
              }
            ],
            attributes: ["id", "price", "qty"]
          },
          {
            model: db.Customer,
            include: [
              {
                model: db.UserLocation,
                where: { isActive: true },
                limit: 1,
                as: "addresses",
                attributes: [
                  "address1",
                  "address2",
                  "latitude",
                  "longitude",
                  "address3"
                ]
              }
            ],
            attributes: [
              "id",
              "firstName",
              "lastName",
              "userName",
              "phone",
              "secondaryContact",
              "secondaryContactName"
            ]
          }
        ],
        attributes: [
          "id",
          "status",
          "createdAt",
          "deliveredAt",
          "returnedAt",
          "pickupAt",
          "total",
          "penalty",
          "kegsDeliveredQty",
          "tapsDeliveredQty",
          "kegsReturnedQty",
          "tapsReturnedQty"
        ]
      });
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
        include: [
          db.LineItem,
          db.Driver,
          db.Store,
          {
            model: db.Customer,
            include: [
              {
                model: db.UserLocation,
                where: { isActive: true },
                limit: 1,
                attributes: [
                  "address1",
                  "address2",
                  "address3",
                  "latitude",
                  "longitude"
                ],
                as: "addresses"
              }
            ],
            attributes: [
              "id",
              "email",
              "phone",
              "firstName",
              "userName",
              "gender"
            ]
          }
        ]
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
                    model: db.Size
                  },
                  {
                    model: db.Product
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
    getOrdersByStatus,
    getDriverOrderHistory,
    getCustomerOrders,
    getOrdersByStoreId,
    getbyIdForDriver,
    getbyId
  };
};

module.exports = OrderQueryController;
