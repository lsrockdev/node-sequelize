const Category = require("../../models").Category;
const CategorySizes = require("../../models").CategorySizes;
const Size = require("../../models").Size;
const Product = require("../../models").Product;
const Inventory = require("../../models").Inventory;
const Sequelize = require("sequelize");

const CategoryController = () => {
  const getAll = async (req, res) => {
    try {
      const categories = await Category.findAll({
        where: {
          isDeleted: false,
          isActive: true
        },
        include: [
          {
            model: Size,
            attributes: ["id", "name", "size", "description"]
          },
          {
            model: Product,
            order: [["createdAt", "DESC"]],
            include: [
              {
                model: Inventory,
                attributes: ["id", "price", "storeId"],
                required: true,
                where: {
                  storeId: { [Sequelize.Op.in]: JSON.parse(req.query.storeIds) }
                }
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
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const getAllNoProducts = async (req, res) => {
    try {
      const categories = await Category.findAll({
        where: {
          isDeleted: false,
          isActive: true
        },
        include: [
          {
            model: Size,
            attributes: ["id", "name", "size", "description"]
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
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const addOne = async (req, res) => {
    const { body } = req;
    try {
      const sizeIds = body.sizeIds;
      delete body.sizeIds;
      const category = await Category.create(body);
      const categorySizes = sizeIds.map(sizeId => {
        return {
          sizeId: sizeId,
          categoryId: category.id
        };
      });
      await CategorySizes.bulkCreate(categorySizes);
      return res.status(200).json({
        message: "Your category successfully saved.",
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
      const category = await Category.findOne({
        where: {
          id: body.id
        }
      });
      await updateSizes(category.id, body.sizeIds);
      delete body.sizeIds;
      await category.update(body);
      return res.status(200).json({
        message: "Your category successfully updated.",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const deleteOne = async (req, res) => {
    const { id } = req.body;
    try {
      await Category.update({ isDeleted: true }, { where: { id } });
      return res.status(200).json({
        message: "Your category successfully deleted.",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const checkIsCategoryAssigned = async (req, res) => {
    const { id } = req.body;
    try {
      const category = await Category.findOne({
        where: {
          id
        },
        include: [
          {
            model: Size,
            attributes: ["id", "name", "size", "description"]
          },
          {
            model: Product,
            limit: 20,
            order: [["createdAt", "DESC"]]
          }
        ]
      });
      if (!category) {
        return res.status(200).json({
          message: "Unable to delete your selected category.",
          StatusCode: 0
        });
      }
      let message = `Your Deleted category ${category.name} is Reference to `;
      let isAssigned = false;
      if (category.Sizes && category.Sizes.length > 0) {
        message += "Category Sizes, ";
        isAssigned = true;
      }
      if (category.deliveryFee) {
        message += "Delivery Fees, ";
        isAssigned = true;
      }
      if (category.Products && category.Products.length > 0) {
        message += "Products, ";
        isAssigned = true;
      }
      if (isAssigned) {
        return res.status(200).json({
          message: (message +=
            "If you want to delete all references,Click on 'Continue' or click on 'Cancel' prevent deletion."),
          StatusCode: 1
        });
      } else {
        return res.status(200).json({
          message: "",
          StatusCode: 0
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const updateSizes = async (categoryId, sizeIds) => {
    try {
      await CategorySizes.destroy({
        where: { categoryId }
      });
      const categorySizes = sizeIds.map(sizeId => {
        return { sizeId, categoryId };
      });
      await CategorySizes.bulkCreate(categorySizes);
      return true;
    } catch (err) {
      throw err;
    }
  };

  return {
    getAll,
    getAllNoProducts,
    addOne,
    updateOne,
    deleteOne,
    checkIsCategoryAssigned
  };
};
module.exports = CategoryController;
