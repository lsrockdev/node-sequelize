'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favorites = sequelize.define('Favorites', {
    productName: DataTypes.STRING,
    customerId: DataTypes.STRING,
    categoryId: DataTypes.STRING
  }, {});
  Favorites.associate = function(models) {
    // associations can be defined here
  };
  return Favorites;
};