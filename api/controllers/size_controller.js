const Size = require("../../models").Size;

const SizeController = () => {
  const getAll = async (req, res) => {
    try {
      const sizes = await Size.findAll({
        where: {
          isDeleted: false || null
        }
      });
      return res.status(200).json({
        sizes,
        message: `Sizes count is: ${sizes.length}`,
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const addOne = async (req, res) => {
    const { body } = req;
    try {
      const size = await Size.create(body);
      return res.status(200).json({
        size,
        message: "size added Successfully",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const deleteOne = async (req, res) => {
    const { sizeId } = req.body;
    try {
      await Cart.update({ isDeleted: true }, { where: { id: sizeId } });
      return res.status(200).json({
        message: "Size Deleted Successfully",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  return {
    getAll,
    addOne,
    deleteOne
  };
};

module.exports = SizeController;
