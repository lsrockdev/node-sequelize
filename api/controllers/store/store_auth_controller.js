const models = require("../../../models");

const StoreAuthController = () => {
  const register = async (req, res) => {
    const { body } = req;
    try {
      return res.status(200).json({
        message: "Store Registered successfully",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const login = async (req, res) => {
    const { body } = req;
    try {
      return res.status(200).json({
        message: "Login Successful",
        StatusCode: 1
      });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  return {
    register,
    login
  };
};

module.exports = StoreAuthController;
