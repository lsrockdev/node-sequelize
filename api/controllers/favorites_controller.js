const Favorites = require("../../models").Favorites;

const FavoritesController = () => {
  const getAll = async (req, res) => {
    return res.status(200).json({
      message: "testing",
      StatusCode: 1
    });
  };

  const addOne = async (req, res) => {
    const { body } = req;
    try {
      const favorite = await Favorites.create(body);
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
