const Favorites = require("../../models").Favorites;
const Category = require("../../models").Category;
const Customer = require("../../models").Customer;

Customer.hasMany(Favorites, { foreignKey: "customerId" });
Favorites.belongsTo(Customer, { foreignKey: "customerId" });

Category.hasMany(Favorites, { foreignKey: "categoryId" });
Favorites.belongsTo(Category, { foreignKey: "categoryId" });

const FavoritesController = () => {
  const getAll = async (req, res) => {
    const favoriteProducts = await Favorites.findAll({
      where: {
        deleted: false || null
      },
      include: [Customer, Favorites]
    });
    return res.status(200).json({
      favoriteProducts,
      message: "Favorite product read successful.",
      StatusCode: 1
    });
  };

  const addorDeleteOne = async (req, res) => {
    const { body } = req;
    const customerId = req.token.id;
    const data = { ...body, customerId };
    console.log(data);
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
    getAll,
    addorDeleteOne
  };
};

module.exports = FavoritesController;
