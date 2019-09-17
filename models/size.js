"use strict";
module.exports = (sequelize, DataTypes) => {
  const Size = sequelize.define(
    "Size",
    {
      name: DataTypes.STRING,
      size: DataTypes.STRING,
      description: DataTypes.STRING,
      isDeleted: DataTypes.BOOLEAN
    },
    {}
  );
  Size.associate = function(models) {
    Size.belongsToMany(models.Category, {
      through: models.CategorySizes,
      foreignKey: "sizeId"
    });
    // associations can be defined here
  };
  return Size;
};
