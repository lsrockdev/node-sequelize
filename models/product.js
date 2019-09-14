"use strict";
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      isActive: DataTypes.BOOLEAN,
      isDeleted: DataTypes.BOOLEAN,
      imageUrl: DataTypes.STRING,
      imageGuide: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      isKeg: DataTypes.BOOLEAN,
      depositFee: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      storeId: DataTypes.INTEGER
    },
    {}
  );
  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsTo(models.Category, {
      foreignKey: "id",
      sourceKey: "categoryId"
    });
    Product.belongsToMany(models.Store, { through: models.Inventory });
    Product.belongsTo(models.Favorites, {
      foreignKey: "id"
    });
    Product.hasMany(models.Favorites);
  };
  return Product;
};
