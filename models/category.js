"use strict";
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      catgUrlImagePath: DataTypes.STRING,
      isDeleted: DataTypes.BOOLEAN,
      imageGuid: DataTypes.STRING,
      IsForFrattapStore: DataTypes.BOOLEAN,
      isMaster: DataTypes.BOOLEAN,
      categoryOrder: DataTypes.BOOLEAN,
      deliveryFee: DataTypes.INTEGER
    },
    {}
  );
  Category.associate = function(models) {
    // associations can be defined here
    Category.hasMany(models.CatergorySizes, { foreignKey: "categoryId" });
    Category.hasMany(models.Product, {
      foreignKey: "id",
      targetKey: "productId"
    });
  };

  return Category;
};
