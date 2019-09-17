"use strict";
module.exports = (sequelize, DataTypes) => {
  const CategorySizes = sequelize.define(
    "CategorySizes",
    {
      isDeleted: DataTypes.BOOLEAN,
      sizeId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER
    },
    {}
  );
  CategorySizes.associate = function(models) {};
  return CategorySizes;
};
