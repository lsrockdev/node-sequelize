"use strict";
module.exports = (sequelize, DataTypes) => {
  const Favorites = sequelize.define(
    "Favorites",
    {
      productId: DataTypes.INTEGER,
      customerId: DataTypes.INTEGER
    },
    {}
  );
  Favorites.associate = function(models) {
    Favorites.belongsTo(models.Product, {
      foreignKey: "productId"
    });
  };
  return Favorites;
};
