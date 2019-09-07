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
      storeId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      isKeg: DataTypes.BOOLEAN,
      depositFee: DataTypes.INTEGER,
      deliveryFee: DataTypes.INTEGER,
      price: DataTypes.INTEGER
    },
    {}
  );
  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsTo(models.Category, {
      foreignKey: "id",
      sourceKey: "categoryId"
    });
    Product.hasMany(models.LineItem);
    Product.belongsToMany(models.Order, { through: models.LineItem });
    Product.belongsToMany(models.Store, { through: models.Inventory });
  };
  return Product;
};
