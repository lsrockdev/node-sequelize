const Favorites = require("../../models").Favorites;

const FavoritesController = () => {
  const getAll = async (req, res) => {
    return res.status(200).json({
      message: "testing",
      StatusCode: 1
    });
  };

  const addOne = async (req, res) => {
    return res.status(200).json({
      message: "testing",
      StatusCode: 1
    });
  };

  return {
    getAll,
    addOne
  };
};

module.exports = FavoritesController;
