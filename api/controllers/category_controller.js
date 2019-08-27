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

  return { getAll };
};
module.exports = CategoryController;
