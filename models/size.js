'use strict';
module.exports = (sequelize, DataTypes) => {
  const Size = sequelize.define('Size', {
    name: DataTypes.STRING,
    size_: DataTypes.STRING,
    description: DataTypes.INTEGER,
    isDeleted: DataTypes.INTEGER
  }, {});
  Size.associate = function(models) {
    // associations can be defined here
  };
  return Size;
};