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

  const updateOne = async (req, res) => {
    const { body } = req;
    try {
      size = await Size.findOne({
        where: {
          id: body.id
        }
      });
      await size.update(body);
      return res.status(200).json({
        size,
        message: "Updated Successfully",
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
      await Size.update({ isDeleted: true }, { where: { id: sizeId } });
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
    updateOne,
    deleteOne
  };
};

module.exports = SizeController;
