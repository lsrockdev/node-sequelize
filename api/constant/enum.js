const OrderStatus = {
  NEW: 0,
  ORDER_IN_PROCESS: 1,
  KEG_READY: 2, // Store
  ASSIGNED2DRIVER4DELIVERY: 3, // Driver   ClaimOrderforDeliver
  DELIVERED: 4, //Driver

  SCHEDULED4PICKUP: 5, // ~Customer  SchedulePickUp
  ASSIGNED2DRIVER4PICKUP: 6, // Driver  ClaimOrderforPickUp
  RETURNED: 7, //Driver

  PARTIALPICKUP: 8, //Driver
  PICKUPFAILED: 9, //Driver
  DELIVERYFAILED: 10
};

const OrderFailedStatus = {
  NONE: 0,
  DELIVERFAILED: 1,
  PICKUPFAILED: 2
};
module.exports = {
  OrderStatus,
  OrderFailedStatus
};
