const Product = require("../../models").Product;
const Category = require("../../models").Category;
const CategorySize = require("../../models").CategorySize;
const Size = require("../../models").Size;
const Favorites = require("../../models").Favorites;

const Sequelize = require("sequelize");

const ProductController = () => {
  const getAll = async (req, res) => {
    try {
      const products = await Product.findAll({
        where: {
          isDeleted: false
        }
      });
      return res.status(200).json({
        products,
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const getByCategory = async (req, res) => {
    const { categoryId } = req.query;
    try {
      const products = await Product.findAll({
        where: {
          isDeleted: false,
          categoryId
        }
      });
      const productIds = products.map(product => product.id);
      const favorites = await Favorites.findAll({
        where: {
          productId: {[Sequelize.Op.in]: productIds},
          customerId: req.token.id,
        },
        include: [
          {
            model: Product,
          }
        ]
      });
      return res.status(200).json({
        products,
        favorites,
        message: "success",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const getById = async (req, res) => {
    const { id } = req.query;
    try {
      const product = await Product.findOne({
        where: {
          id
        },
        include: [
          {
            model: Category,
            include: [
              {
                model: CategorySize,
                include: [
                  {
                    model: Size
                  }
                ]
              }
            ]
          }
        ]
      });
      const isCustomerFavorite = await Favorites.count({ where: {productId: id, customerId: req.token.id}}) > 0;
      return res.status(200).json({
        product,
        isCustomerFavorite,
        message: "success",
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
      const product = await Product.create(body);
      return res.status(200).json({
        product: product,
        message: "Product Added Succesfully",
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
      await Product.update(body, { where: { id: body.id } });
      return res.status(200).json({
        message: "Your product successfully updated.",
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
      await Product.update({ isDeleted: 1 }, { where: { id } });
      return res.status(200).json({
        message: "Produtc Deleted Succesfully",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  return {
    getAll,
    getByCategory,
    getById,
    addOne,
    updateOne,
    deleteOne
  };
};
module.exports = ProductController;
