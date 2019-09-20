const OrderStatus = {
  //Use for Customer
  AwaitingPayment: 0,
  Paid: 1,

  //Use for Store
  Keg_Ready: 2,
  ScheduledPickup: 3,

  // Use for Driver app
  ClaimDeliver: 4,
  ClaimPickUp: 5,
  Declain: 6,
  Delivered: 7,
  DeliverFailed: 8,
  Pickup: 9,
  PickupFailed: 10,
  Returned: 11
};

module.exports = {
  OrderStatus
};
