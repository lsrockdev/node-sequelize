const Category = require("../../models").Category;
const CatergorySizes = require("../../models").CatergorySizes;
const Size = require("../../models").Size;

const CategoryController = () => {
  const getAll = async (req, res) => {
    try {
      Category.hasMany(CatergorySizes, { foreignKey: "categoryId" });
      CatergorySizes.belongsTo(Category, { foreignKey: "categoryId" });

      Size.hasOne(CatergorySizes, { foreignKey: "sizeId" });
      CatergorySizes.belongsTo(Size, { foreignKey: "sizeId" });
      const categories = await Category.findAll({
        where: {
          isDeleted: false || null,
          isActive: true
        },
        include: [
          {
            model: CatergorySizes,
            include: [
              {
                model: Size
              }
            ]
          }
        ]
      });
      return res.status(200).json({
        categories,
        message: "Get Categories Succesfully",
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
      const sizeIds = body.categorySizes;
      delete body.categorySizes;
      const category = await Category.create(body);
      const categorySizes = sizeIds.map(sizeId => {
        return {
          sizeId: sizeId,
          categoryId: category.id
        };
      });
      await CatergorySizes.bulkCreate(categorySizes);
      return res.status(200).json({
        message: "Your category successfully saved.",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const updateOne = async (req, res) => {
    return res.status(200).json({
      message: "Your category successfully updated.",
      StatusCode: 1
    });
  };

  const deleteOne = async (req, res) => {
    return res.status(200).json({
      message: "Your category successfully deleted.",
      StatusCode: 1
    });
  };

  return { getAll, addOne, updateOne, deleteOne };
};
module.exports = CategoryController;
