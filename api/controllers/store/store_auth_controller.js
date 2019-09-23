const models = require("../../../models");
const codeController = require("../code_controller");
const Sequelize = require("sequelize");
const authService = require("../../services/auth.service");
const bcryptService = require("../../services/bcrypt.service");

const StoreAuthController = () => {
  const register = async (req, res) => {
    const { body } = req;
    const address = body.address;
    delete body.address;
    try {
      const existingCode = await codeController().getByCode(body.uid);
      if (!existingCode) {
        return res.status(401).json(`Tapster Code doesn't Exist.`);
      }
      if (existingCode.Stores.length > 0) {
        return res.status(402).json(`Tapster Code already used.`);
      }

      const existing = await models.StoreUser.findOne({
        where: {
          [Sequelize.Op.or]: [
            { email: body.email.toLowerCase() },
            { phone: body.phone }
          ]
        }
      });
      if (!!existing) {
        return res.status(400).json({
          message: `${body.email.toLowerCase()} or ${
            body.phone
          } was already used in other accounts`
        });
      }
      const storeUser = await models.StoreUser.create({
        email: body.email.toLowerCase(),
        password: bcryptService().password(body)
      });

      delete body.email;
      delete body.password;
      const store = await models.Store.create({
        ...body,
        userId: storeUser.id
      });

      const token = authService().issue({ id: store.id });
      return res.status(200).json({
        message: "Successfully Registered",
        StatusCode: 1,
        store,
        token
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const login = async (req, res) => {
    const { password } = req.body;
    const email = req.body.email.toLowerCase();
    if (email && password) {
      try {
        let storeUser = await models.StoreUser.findOne({
          where: {
            email: email
          },
          include: [
            {
              model: models.Store
            }
          ]
        });
        if (!storeUser) {
          return res
            .status(400)
            .json({ message: "Bad Request: User not found" });
        }
        if (bcryptService().comparePassword(password, storeUser.password)) {
          const token = authService().issue({ id: storeUser.id });
          return res.status(200).json({
            message: "Login Success",
            StatusCode: 1,
            storeUser,
            token
          });
        }
        return res.status(401).json({ message: "Unauthorized" });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    return res
      .status(400)
      .json({ message: "Bad Request: Email or password is wrong" });
  };

  return {
    register,
    login
  };
};

module.exports = StoreAuthController;
