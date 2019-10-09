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
    const driverId = req.token.id;
    try {
      const statusValues = JSON.parse(req.query.status);
      const driverSlots = await db.DriverSlot.findAll({
        where: { driverId }
      });
      const slotIds = driverSlots.map(
        driverSlot => driverSlot.dataValues.slotId
      );

      const condition = {
        status: {
          [Sequelize.Op.in]: statusValues
          // slotId: { [Sequelize.Op.in]: slotIds }
        }
      };

      const orders = await db.Order.findAll({
        where: condition,
        include: [
          {
            model: db.LineItem,
            include: [
              {
                model: db.Inventory,
                include: [
                  {
                    model: db.Category,
                    attributes: ["name"]
                  }
                ],
                attributes: ["id"]
              }
            ],
            attributes: ["id"]
          },
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
        ],
        attributes: [
          "id",
          "status",
          "createdAt",
          "deliveredAt",
          "deliveryAddress",
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

      const driverOrders = orders.map(order => {
        const kegItems = order.dataValues.LineItems.filter(lineItem => {
          const kegCategories = ["Small Keg", "Large Keg"];
          return kegCategories.includes(lineItem.Inventory.Category.name);
        });
        const isKeg = kegItems.length > 0;
        order.dataValues = {
          ...order.dataValues,
          isKeg
        };
        return order;
      });

      return res.status(200).json({
        orders: orders,
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
      const beginDate = req.query.beginDate;
      const endDate = req.query.endDate;
      const status = req.query.status;

      const condition =
        status > 0
          ? {
              storeId,
              status,
              createdAt: {
                [Sequelize.Op.gte]: new Date(beginDate),
                [Sequelize.Op.lte]: new Date(endDate)
              }
            }
          : {
              storeId,
              createdAt: {
                [Sequelize.Op.gte]: new Date(beginDate),
                [Sequelize.Op.lte]: new Date(endDate)
              }
            };

      const orders = await db.Order.findAll({
        where: condition,
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

  const getbyIdForCustomer = async (req, res) => {
    const { id } = req.query;
    try {
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
          "deliveryAddress",
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

  const getbyIdForStore = async condition => {
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
                    model: db.Size,
                    attributes: ["id", "name", "size", "description"]
                  },
                  {
                    model: db.Product,
                    attributes: [
                      "id",
                      "name",
                      "description",
                      "price",
                      "depositFee"
                    ]
                  },
                  {
                    model: db.Store,
                    attributes: ["id", "name"]
                  },
                  {
                    model: db.Category,
                    attributes: ["id", "name", "deliveryFee"]
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
              "email",
              "secondaryContact",
              "secondaryContactName"
            ]
          },
          {
            model: db.Driver,
            attributes: ["id", "firstName", "lastName", "phone", "email"]
          }
        ],
        attributes: [
          "id",
          "status",
          "createdAt",
          "deliveredAt",
          "deliveryAddress",
          "returnedAt",
          "pickupAt",
          "total",
          "penalty",
          "deliveryFees",
          "kegsDeliveredQty",
          "tapsDeliveredQty",
          "kegsReturnedQty",
          "tapsReturnedQty"
        ]
      });
      return order;
    } catch (err) {
      console.log(err);
      throw new Error("Internal server error");
    }
  };

  const getAllBy = async condition => {
    try {
      return await db.Order.findAll({
        where: condition,
        include: [
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
          },
          {
            model: db.LineItem,
            include: [
              {
                model: db.Inventory,
                attributes: ["id", "price", "productId"],
                include: [
                  {
                    model: db.Product,
                    attributes: ["id", "categoryId"],
                    include: [
                      {
                        model: db.Category,
                        attributes: ["id", "name"]
                      }
                    ]
                  }
                ]
              }
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
                    model: db.Product,
                    include: [
                      {
                        model: db.Category
                      }
                    ]
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
          },
          {
            model: db.Driver
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
    getbyIdForCustomer,
    getbyIdForStore,
    getOneBy
  };
};

module.exports = OrderQueryController;
