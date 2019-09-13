const StoreUser = require("../../models").StoreUser;
const authService = require("../services/auth.service");
const bcryptService = require("../services/bcrypt.service");

const AdminController = () => {
  const login = async (req, res) => {
    const { password } = req.body;
    const email = req.body.email.toLowerCase();
    if (email && password) {
      try {
        let user = await StoreUser.findOne({
          where: {
            email: email,
            roleId: 1
          }
        });
        if (!user) {
          return res.status(400).json({ msg: "Bad Request: User not found" });
        }
        if (bcryptService().comparePassword(password, user.password)) {
          const token = authService().issue({ id: user.id });
          return res.status(200).json({
            message: "Login Success",
            StatusCode: 1,
            user,
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

  const update = async (req, res) => {
    const { body } = req;
    try {
      let user = await StoreUser.findOne({
        where: {
          id: body.id
        }
      });
      if (!user) {
        return res.status(400).json({ msg: "Bad Request: User not found" });
      }
      await user.update(body);
      return res.status(200).json({
        message: "Profile updated Successfully",
        StatusCode: 1,
        user
      });
    } catch (err) {
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  return {
    login,
    update
  };
};
module.exports = AdminController;
