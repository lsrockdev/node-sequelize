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
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      IsFrattapStore: DataTypes.BOOLEAN,
      userId: DataTypes.INTEGER,
      stripeToken: DataTypes.STRING,
      address: {
        type: DataTypes.TEXT,
        get: function() {
          return JSON.parse(this.getDataValue("address"));
        },
        set: function(value) {
          return this.setDataValue("address", JSON.stringify(value));
        }
      }
    },
    {}
  );
  Store.associate = function(models) {
    // associations can be defined here
    Store.hasMany(models.Order);
    Store.belongsToMany(models.Product, { through: models.Inventory });
    Store.hasMany(models.Inventory, { foreignKey: "storeId" });
    Store.belongsTo(models.StoreCode, { foreignKey: "id" });
    Store.belongsTo(models.StoreUser, { foreignKey: "userId" });
  };
  return Store;
};
