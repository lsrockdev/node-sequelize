const Customer = require("../../models").Customer;
const authService = require("../services/auth.service");
const bcryptService = require("../services/bcrypt.service");
const otpService = require("../services/otp.service");
const BrainTreeHelper = require("../helpers/braintree_helper");
const getCurrentUser = require("../helpers/current_user_helper");
const UserLocation = require("../../models").UserLocation;
var _ = require("lodash");

const CustomerController = () => {
  const register = async (req, res) => {
    const { body } = req;
    try {
      const existing = await Customer.findOne({
        where: {
          email: body.email.toLowerCase()
        }
      });
      if (!!existing) {
        return res
          .status(400)
          .json({ msg: `${body.email.toLowerCase()} is already registered` });
      }
      await Customer.create({
        email: body.email.toLowerCase(),
        password: bcryptService().password(body),
        address: body.address
      });
      var customer = await Customer.findOne({
        where: {
          email: body.email.toLowerCase()
        }
      });
      delete customer.password;
      console.log(customer);
      const token = authService().issue({ id: customer.id });
      return res.status(200).json({
        message: "Successfully Registered",
        StatusCode: 1,
        customer,
        token
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const login = async (req, res) => {
    const { password } = req.body;
    const email = req.body.email.toLowerCase();
    if (email && password) {
      try {
        let customer = await Customer.findOne({
          where: {
            email: email
          }
        });
        if (!customer) {
          return res.status(400).json({ msg: "Bad Request: User not found" });
        }
        if (bcryptService().comparePassword(password, customer.password)) {
          const token = authService().issue({ id: customer.id });
          return res.status(200).json({
            message: "Login Success",
            StatusCode: 1,
            customer,
            token
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

  const generateBraintreeToken = async (req, res) => {
    const customerId = req.token.id;
    const currentUser = await getCurrentUser("Customer", customerId);
    const brainTreeResponse = await BrainTreeHelper().generateBraintreeToken(
      currentUser.braintreeCustomerId
    );
    if (brainTreeResponse.err) {
      return res
        .status(500)
        .json({ StatusCode: 0, err: brainTreeResponse.err });
    }
    return res.status(200).json({
      BraintreeToken: brainTreeResponse.response.clientToken,
      Message: "Token generated",
      StatusCode: 1
    });
  };

  const updateProfile = async (req, res) => {
    const { body } = req;
    customerId = req.token.id;
    const currentUser = await getCurrentUser("Customer", customerId);

    // Whitelist allowable attributes:
    const filteredAttributes = _.pick(body, [
      "phone",
      "firstName",
      "lastName",
      "userName",
      "address",
      "gender",
      "secondaryContact",
      "secondaryContactName",
      "stateId",
      "dob"
    ]);

    // Check for password
    if (body.password) {
      filteredAttributes.password = bcryptService().password(body);
    }

    // Check for email - only update if different from current email:
    if (
      body.email &&
      body.email.toLowerCase() !== currentUser.email.toLowerCase()
    ) {
      const email = body.email.toLowerCase();

      // Make sure new email is unique in the db:
      const existing = await Customer.findOne({
        where: {
          email: email
        }
      });
      if (!!existing) {
        return res.status(400).json({ msg: `${email} is already registered` });
      } else {
        // valid unique email:
        filteredAttributes.email = email;
      }
    }

    await currentUser.update(filteredAttributes);

    return res.status(200).json({
      isvalid: true,
      message: "Successfully updated customer",
      customer: currentUser
    });
  };

  const getCustomerProfile = async (req, res) => {
    customerId = req.token.id;
    const currentUser = await getCurrentUser("Customer", customerId);

    try {
      const addresses = await UserLocation.findAll({
        where: {
          isActive: true,
          customerId: customerId
        }
      });

      return res.status(200).json({
        message: "Successfully retrieved customer profile",
        customer: currentUser,
        addresses: addresses
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const createOtp = async (req, res) => {
    const customer = await Customer.findOne({
      where: {
        email: req.body.email.toLowerCase(),
        phone: req.body.phone
      }
    });

    if (!customer)
      res.status(404).json({ msg: "No user found for that email/phone." });

    try {
      await otpService().create("Customer", customer.id);
      return res.status(200).json({
        message: "Successfully sent One Time Password (OTP) code!",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  return {
    register,
    login,
    validate,
    updateProfile,
    getCustomerProfile,
    generateBraintreeToken,
    createOtp
  };
};

module.exports = CustomerController;
