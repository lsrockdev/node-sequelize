const StoreCode = require("../../models").StoreCode;
const Store = require("../../models").Store;

const db = require("../../models").sequelize;

const CodeController = () => {
  const getAll = async () => {
    try {
      const codes = await StoreCode.findAll({
        include: [
          {
            model: Store
          }
        ]
      });
      return codes;
    } catch (err) {
      console.log(err);
      throw new Error("Internal server error");
    }
  };

  const createOne = async () => {
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
      return storeCode;
    } catch (err) {
      console.log(err);
      throw new Error("Internal server error");
    }
  };

  const deleteOne = async id => {
    try {
      await StoreCode.destroy({
        where: { id }
      });
      return true;
    } catch (err) {
      console.log(err);
      throw new Error("Internal server error");
    }
  };

  const getByCode = async code => {
    try {
      const code = await StoreCode.findOne({
        where: { code },
        include: [
          {
            model: Store
          }
        ]
      });
      return code;
    } catch (err) {
      console.log(err);
      throw new Error("Internal server error");
    }
  };

  return {
    getAll,
    createOne,
    deleteOne,
    getByCode
  };
};

module.exports = CodeController;
