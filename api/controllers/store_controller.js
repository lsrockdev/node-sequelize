const Store = require("../../models").Store;

const StoreController = () => {
  const getByCustomerId = async (req, res) => {
    const id = req.user.id;
    console.log(id);
    try {
      const stores = await Store.findAll({
        where: {
          isDeleted: false || null,
          userId: id
        }
      });
      const count = stores ? stores.length : 0;
      return res.status(200).json({
        stores,
        message: `Available stores count:${count}`,
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  return {
    getByCustomerId
  };
};

module.exports = StoreController;
