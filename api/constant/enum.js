const OrderStatus = {
  AwaitingPayment: 0,
  Paid: 1,
  Keg_Ready: 2, // Store
  ClaimDeliver: 3, // Driver   ClaimOrderforDeliver
  DELIVERED: 4, //Driver

  SCHEDULED4PICKUP: 5, // ~Customer  SchedulePickUp
  ClaimPickUp: 6, // Driver  ClaimOrderforPickUp
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
