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
    models.StoreCode.hasMany(models.Store, {
      foreignKey: "uid",
      sourceKey: "code"
    });

    // associations can be defined here
  };
  return StoreCode;
};
