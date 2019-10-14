const Driver = require("../../models").Driver;
const bcryptService = require("../services/bcrypt.service");
const authService = require("../services/auth.service");

const DriverAuthController = () => {
  const authenticate = async (req, res) => {
    const body = req.body;
    const code = body.code,
      password = body.password;
    try {
      let driver = await Driver.findOne({
        where: {
          code,
          isActive: true
        }
      });
      if (!driver) {
        return res
          .status(400)
          .json({ message: "Bad Request: Driver not found" });
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
      return res.status(401).json({ message: "Unauthorized" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const signUp = async (req, res) => {
    const body = req.body;
    const code = body.code;
    try {
      let driver = await Driver.findOne({
        where: {
          code,
          isDeleted: false
        }
      });
      if (!driver) {
        return res
          .status(404)
          .json({ message: "Bad Request: can't find the code" });
      }
      if (driver.isActive) {
        return res.status(404).json({ message: "This code was already used" });
      }
      await driver.update({
        password: bcryptService().password(body),
        isActive: true
      });
      const token = authService().issue({ id: driver.id });
      return res.status(200).json({
        message: "signUp Success",
        StatusCode: 1,
        driver,
        token
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const getProfile = async (req, res) => {
    const { code } = req.query;
    try {
      let driver = await Driver.findOne({
        where: {
          code,
          isDeleted: false
        }
      });
      if (!driver) {
        return res
          .status(401)
          .json({ message: "Bad Request: Driver not found" });
      }
      return res.status(200).json({
        message: "Profile get Successfully",
        StatusCode: 1,
        driver
      });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const updateProfile = async (req, res) => {
    const { body } = req;
    try {
      let user = await Driver.findOne({
        where: {
          code: body.code
        }
      });
      if (!user) {
        return res.status(400).json({ message: "Bad Request: User not found" });
      }
      await user.update(body);
      return res.status(200).json({
        message: "Profile updated Successfully",
        StatusCode: 1,
        user
      });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const migrate1 = async (req, res) => {
    try {
      const drivers = await Driver.findAll();
      for (var i = 0; i < drivers.length; i++) {
        const driver = drivers[i];
        const encryptPw = bcryptService().password({
          password: driver.dataValues.password
        });
        await driver.update({ password: encryptPw });
        console.log(`success- ${driver.dataValues.password}`, i);
      }
      return res.status(200).json({ message: "success" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  return {
    authenticate,
    signUp,
    getProfile,
    updateProfile,
    migrate1
  };
};

module.exports = DriverAuthController;
