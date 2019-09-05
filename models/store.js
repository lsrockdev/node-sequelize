"use strict";
module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define(
    "Store",
    {
      name: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      logo: DataTypes.STRING,
      taxPercentage: DataTypes.DOUBLE,
      WebsiteUrl: DataTypes.STRING,
      numberOfDays: DataTypes.INTEGER,
      uid: DataTypes.STRING,
      description: DataTypes.STRING,
      isDeleted: DataTypes.BOOLEAN,
      IsFrattapStore: DataTypes.BOOLEAN,
      userId: DataTypes.INTEGER,
      address: {
        type: DataTypes.TEXT,
        get: function() {
          return JSON.parse(this.getDataValue("address"));
        },
        set: function(value) {
          this.setDataValue("address", JSON.stringify(value));
        }
      }
    },
    {}
  );
  Store.associate = function(models) {
    // associations can be defined here
    Store.hasMany(models.Order, {
      foreignKey: "id",
      targetKey: "storeId"
    });
  };
  return Store;
};
