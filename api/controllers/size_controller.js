const Size = require("../../models").Size;
const CategorySizes = require("../../models").CategorySizes;

const SizeController = () => {
  const getAllByCategoryId = async (req, res) => {
    const { categoryId } = req.query;
    try {
      const categorySizes = await CategorySizes.findAll({
        where: {
          isDeleted: false,
          categoryId
        },
        include: [Size]
      });
      const sizes = categorySizes.map(categorySize => categorySize.Size);
      return res.status(200).json({
        sizes,
        message: `Sizes count is: ${sizes.length}`,
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const getAll = async (req, res) => {
    try {
      const sizes = await Size.findAll({
        where: {
          isDeleted: false
        }
      });
      return res.status(200).json({
        sizes,
        message: `Sizes count is: ${sizes.length}`,
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
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
      return res.status(500).json({ message: "Internal server error" });
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
      return res.status(500).json({ message: "Internal server error" });
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
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  return {
    getAll,
    getAllByCategoryId,
    addOne,
    updateOne,
    deleteOne
  };
};

module.exports = SizeController;
