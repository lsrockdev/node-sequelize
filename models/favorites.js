"use strict";
module.exports = (sequelize, DataTypes) => {
  const Favorites = sequelize.define(
    "Favorites",
    {
      productId: DataTypes.INTEGER,
      customerId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER
    },
    {}
  );
  Favorites.associate = function(models) {
    // associations can be defined here
  };
  return Favorites;
};
