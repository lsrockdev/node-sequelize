const Customer = require("../../models").Customer;

const getCurrentUser = async (model, id) => {
  let currentUser;
  switch (model) {
    case "Customer":
      currentUser = await Customer.findOne({
        where: {
          id: id
        }
      });
      break;
    case "Driver":
      // coming soon
      break;
    case "Admin":
      // coming soon
      break;
    default:
      throw new Error(
        "User Model Not Specified. Try passing 'Customer', 'Driver', etc."
      );
  }

  if (!currentUser) {
    throw new Error("Couldn't find user");
  }

  return currentUser;
};

module.exports = getCurrentUser;
