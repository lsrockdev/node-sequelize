"use strict";

module.exports = (sequelize, DataTypes) => {
  const StoreCode = sequelize.define(
    "StoreCode",
    {
      code: DataTypes.STRING
    },
    {}
  );
  StoreCode.associate = function(models) {
    // associations can be defined here
  };
  return StoreCode;
};
