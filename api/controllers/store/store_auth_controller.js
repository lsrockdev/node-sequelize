const models = require("../../../models");
const codeController = require("../code_controller");

const StoreAuthController = () => {
  const register = async (req, res) => {
    const { body } = req;
    const address = body.address;
    delete body.address;
    try {
      const existingCode = await codeController.getByCode(body.code);
      if (!existingCode) {
        return res.status(401).json(`Tapster Code doesn't Exist.`);
      }
      if (existingCode.Store) {
        return res.status(402).json(`Tapster Code already used.`);
      }

      const existing = await models.Store.findOne({
        where: {
          [Sequelize.Op.or]: [
            { email: body.email.toLowerCase() },
            { phone: body.phone }
          ]
        }
      });
      if (!!existing) {
        return res.status(400).json({
          message: `${body.email.toLowerCase()} or ${body.phone} or ${
            body.uid
          } was already used in other accounts`
        });
      }
      const store = await models.Store.create({
        ...body,
        email: body.email.toLowerCase(),
        password: bcryptService().password(body)
      });
      delete store.password;
      const token = authService().issue({ id: customer.id });
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
