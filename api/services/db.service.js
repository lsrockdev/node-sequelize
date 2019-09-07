const db = {};

// All models in the database go here:
db.Order = require("../../models").Order;
db.LineItem = require("../../models").LineItem;
db.Store = require("../../models").Store;
db.StoreUser = require("../../models").StoreUser;
db.Favorites = require("../../models").Favorites;
db.Product = require("../../models").Product;
db.Inventory = require("../../models").Inventory;
db.Customer = require("../../models").Customer;
db.UserLocation = require("../../models").UserLocation;
db.Category = require("../../models").Category;
db.Size = require("../../models").Size;
db.CatergorySizes = require("../../models").CatergorySizes;
db.Cart = require("../../models").Cart;

module.exports = db;
