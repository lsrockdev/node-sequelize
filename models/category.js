'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    catgUrlImagePath: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN,
    imageGuid: DataTypes.STRING,
    IsForFrattapStore: DataTypes.BOOLEAN,
    isMaster: DataTypes.BOOLEAN,
    categoryOrder: DataTypes.BOOLEAN
  }, {});
  Category.associate = function(models) {
    // associations can be defined here
  };
  return Category;
};