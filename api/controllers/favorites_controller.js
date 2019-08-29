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

  const addOne = async (req, res) => {
    const { body } = req;
    const customerId = req.token.id;
    try {
      await Favorites.create({
        customerId,
        ...body
      });
      return res.status(200).json({
        message: "Favorite Product Added Succesfully",
        StatusCode: 1,
        IsUpdate: 1
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

  return {
    getAll,
    addOne
  };
};

module.exports = FavoritesController;
