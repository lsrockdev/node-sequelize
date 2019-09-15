const StoreCode = require("../../models").StoreCode;
const Store = require("../../models").Store;

const db = require("../../models").sequelize;

const CodeController = () => {
  const getAll = async (req, res) => {
    try {
      const storeCodes = await db.query(`select c.id, c.code, s.id as store_id, s.name as store_name
      from StoreCodes c left join Stores s on c.code = s.uid`);
      return res.status(200).json({
        storeCodes: storeCodes[0],
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const createOne = async (req, res) => {
    try {
      const maxId = await StoreCode.max("id");
      let code;
      if (maxId) {
        let lastCode = await StoreCode.findOne({
          where: {
            id: maxId
          }
        });
        const codeNum = parseInt(lastCode.code.substring(7)) + 1;
        code = "FRTPSTR" + codeNum.toString();
      } else {
        code = "FRTPSTR5000";
      }
      let storeCode = await StoreCode.create({ code });
      return res.status(200).json({
        storeCode: storeCode,
        message: "Code Added Succesfully",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const deleteOne = async (req, res) => {
    const { id } = req.body;
    try {
      await StoreCode.destroy({
        where: { id }
      });
      return res.status(200).json({
        message: "StoreCode Deleted Succesfully",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  return {
    getAll,
    createOne,
    deleteOne
  };
};

module.exports = CodeController;
