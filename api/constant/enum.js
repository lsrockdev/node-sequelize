const OrderStatus = {
  Paid: 0,

  ClaimDeliver: 1,
  ClaimPickUp: 2,

  Delivered: 3,
  Pickup: 4,

  DeliverFailed: 5,
  PickupFailed: 6,
  Returned: 7
};

module.exports = {
  OrderStatus
};
