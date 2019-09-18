const StoreUser = require("../../models").StoreUser;
const bcryptService = require("../services/bcrypt.service");
const authService = require("../services/auth.service");

const DriverController = () => {
  const authenticate = async (req, res) => {
    const body = req.body;
    const code = body.code,
      password = body.password;
    try {
      let driver = await StoreUser.findOne({
        where: {
          code,
          isActive: true,
          roleId: 2
        }
      });
      if (!driver) {
        return res.status(400).json({ msg: "Bad Request: Driver not found" });
      }
      if (bcryptService().comparePassword(password, driver.password)) {
        const token = authService().issue({ id: driver.id });
        return res.status(200).json({
          message: "Login Success",
          StatusCode: 1,
          driver,
          token
        });
      }
      return res.status(401).json({ msg: "Unauthorized" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const signUp = async (req, res) => {
    try {
      return res.status(200).json({
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  return {
    authenticate,
    signUp
  };
};

module.exports = DriverController;
