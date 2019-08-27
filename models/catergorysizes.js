'use strict';
module.exports = (sequelize, DataTypes) => {
  const CatergorySizes = sequelize.define('CatergorySizes', {
    isDeleted: DataTypes.BOOLEAN,
    sizeId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {});
  CatergorySizes.associate = function(models) {
    // associations can be defined here
  };
  return CatergorySizes;
};