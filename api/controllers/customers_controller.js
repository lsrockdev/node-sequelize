const Customer = require("../models/customer");
const authService = require("../services/auth.service");
const bcryptService = require("../services/bcrypt.service");

const CustomerController = () => {
  const register = async (req, res) => {
    const { body } = req;
    try {
      const existing = await Customer.findOne({
        where: {
          email: body.email
        }
      });
      if (!!existing) {
        return res
          .status(400)
          .json({ msg: `${body.email} is already registered` });
      }
      await Customer.create({
        email: body.email,
        password: body.password
      });
      const customer = await Customer.findOne({
        where: {
          email: body.email
        }
      });
      customer.token = authService().issue({ id: customer.id });
      return res.status(200).json({
        message: "Successfully Registered",
        StatusCode: 1,
        customer
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const login = async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
      try {
        const customer = await Customer.findOne({
          where: {
            email
          }
        });
        if (!customer) {
          return res.status(400).json({ msg: "Bad Request: User not found" });
        }
        if (bcryptService().comparePassword(password, customer.password)) {
          customer.token = authService().issue({ id: customer.id });
          return res.status(200).json({
            message: "Successfully Registered",
            StatusCode: 1,
            ...customer
          });
        }
        return res.status(401).json({ msg: "Unauthorized" });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal server error" });
      }
    }

    return res
      .status(400)
      .json({ msg: "Bad Request: Email or password is wrong" });
  };

  const validate = (req, res) => {
    const { token } = req.body;
    authService().verify(token, err => {
      if (err) {
        return res.status(401).json({ isvalid: false, err: "Invalid Token!" });
      }

      return res.status(200).json({ isvalid: true });
    });
  };

  return {
    register,
    login,
    validate
  };
};

module.exports = CustomerController;
