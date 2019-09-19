const db = require("../services/db.service.js");

const SettingsController = () => {
  const getAll = async (req, res) => {
    try {
      const settings = await db.Setting.findAll({});
      return res.status(200).json({
        settings,
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const getByName = async (req, res) => {
    const { name } = req.body;
    try {
      const setting = await db.Setting.findOne({
        where: {
          name
        }
      });
      return res.status(200).json({
        setting,
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const updateOne = async (req, res) => {
    const { body } = req;
    try {
      const setting = await db.Setting.findOne({
        where: { name: body.name }
      });
      if (setting) {
        await setting.update({ value: body.value });
      } else {
        await db.Setting.create(body);
      }
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
    getAll,
    getByName,
    updateOne
  };
};
module.exports = SettingsController;
