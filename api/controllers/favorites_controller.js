const Favorites = require("../../models").Favorites;
const Product = require("../../models").Product;
const Store = require("../../models").Store;
const Inventory = require("../../models").Inventory;
const Sequelize = require("sequelize");

const FavoritesController = () => {
  const getFavoriteProducts = async (req, res) => {
    const { storeIds } = req.body;
    const customerId = req.token.id;

    try {
      const favoriteProducts = await Favorites.findAll({
        where: { customerId },
        include: [
          {
            model: Product,
            include: [
              {
                model: Inventory,
                attributes: ["id", "price", "storeId"],
              }
            ]
          }
        ]
      });
      return res.status(200).json({
        favoriteProducts,
        message: "Favorite product read successful.",
        StatusCode: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
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
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  return {
    getFavoriteProducts,
    addorDeleteOne
  };
};

module.exports = FavoritesController;
