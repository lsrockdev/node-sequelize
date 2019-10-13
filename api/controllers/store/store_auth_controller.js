const models = require("../../../models");
const codeController = require("../code_controller");
const Sequelize = require("sequelize");
const authService = require("../../services/auth.service");
const bcryptService = require("../../services/bcrypt.service");

const StoreAuthController = () => {
  const register = async (req, res) => {
    const { body } = req;
    try {
      const existingCode = await codeController().getByCode(body.uid);
      if (!existingCode) {
        return res.status(401).json({ message: "Tapster Code doesn't Exist." });
      }
      if (existingCode.Stores.length > 0) {
        return res.status(401).json({ message: "Tapster Code already used." });
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
        return res.status(402).json({
          message: `${body.email.toLowerCase()} or ${
            body.phone
          } was already used in other accounts`
        });
      }
      const storeUser = await models.StoreUser.create({
        email: body.email.toLowerCase(),
        password: bcryptService().password(body),
        phone: body.phone
      });

      delete body.email;
      delete body.password;
      delete body.phone;
      await models.Store.create({
        ...body,
        userId: storeUser.id
      });

      const createdUser = await models.StoreUser.findOne({
        where: {
          id: storeUser.id
        },
        include: [
          {
            model: models.Store
          }
        ]
      });

      const token = authService().issue({ id: createdUser.id });
      return res.status(200).json({
        message: "Successfully Registered",
        StatusCode: 1,
        storeUser: createdUser,
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

  const migrate1 = async (req, res) => {
    try {
      const storeUsers = await models.StoreUser.findAll();
      for (var i = 0; i < storeUsers.length; i++) {
        const storeUser = storeUsers[i];
        const encryptPw = bcryptService().password({
          password: storeUser.dataValues.password
        });
        await storeUser.update({ password: encryptPw });
        console.log(`success- ${storeUser.dataValues.password}`, i);
      }
      return res.status(200).json({ message: "success" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const migrate2 = async (req, res) => {
    try {
      const stores = await models.Store.findAll();
      for (var i = 0; i < stores.length; i++) {
        const store = stores[i];
        const address = await models.StoreLocation.findOne({
          where: {
            storeId: store.dataValues.id
          },
          attributes: ["address1", "city", "zipCode", "latitude", "longitude"]
        });

        await store.update({
          address: address.dataValues
        });

        console.log(`success- ${address.dataValues}`, i);
      }
      return res.status(200).json({ message: "success" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  return {
    register,
    login,
    migrate2
  };
};

module.exports = StoreAuthController;
