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
  CategorySizes.associate = function(models) {
    CategorySizes.belongsTo(models.Category, { foreignKey: "categoryId" });
    CategorySizes.belongsTo(models.Size, { foreignKey: "sizeId" });

    // associations can be defined here
  };
  return CategorySizes;
};
