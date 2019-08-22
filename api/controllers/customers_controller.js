const Customer = require("../models/customer");
const authService = require("../services/auth.service");
const bcryptService = require("../services/bcrypt.service");

const CustomerController = () => {
  const register = async (req, res) => {
    const { body } = req;
    try {
      const customer = await Customer.create({
        email: body.email,
        password: body.password
      });
      const token = authService().issue({ id: customer.id });
      return res.status(200).json({ token, customer });
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
        if (!user) {
          return res.status(400).json({ msg: "Bad Request: User not found" });
        }
        if (bcryptService().comparePassword(password, user.password)) {
          const token = authService().issue({ id: user.id });
          return res.status(200).json({ token, user });
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
