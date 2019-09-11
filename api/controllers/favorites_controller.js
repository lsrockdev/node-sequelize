const Favorites = require("../../models").Favorites;
const Product = require("../../models").Product;
const Store = require("../../models").Store;
const Sequelize = require("sequelize");

const FavoritesController = () => {
  const getFavoriteProducts = async (req, res) => {
    const { body } = req;
    try {
      const favoriteProducts = await Favorites.findAll({
        include: [Store],
        where: {
          storeId: {
            [Sequelize.Op.in]: body.StoreIds
          }
        }
      });
      return res.status(200).json({
        favoriteProducts,
        message: "Favorite product read successful.",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  const addorDeleteOne = async (req, res) => {
    const { productId } = req.body;
    const customerId = req.token.id;
    const data = { productId, customerId };
    try {
      const existing = await Favorites.findOne({ where: data });
      if (existing) {
        await Favorites.destroy({ where: data });
        return res.status(200).json({
          message: "Favorite Product Deleted Succesfully",
          StatusCode: 1,
          IsUpdate: 2
        });
      } else {
        await Favorites.create(data);
        return res.status(200).json({
          message: "Favorite Product Added Succesfully",
          StatusCode: 1,
          IsUpdate: 1
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  return {
    getFavoriteProducts,
    addorDeleteOne
  };
};

module.exports = FavoritesController;
