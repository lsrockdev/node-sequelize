require("dotenv").config(); // Allows access to .env vars throughout entire app
var _ = require("lodash");
var repl = require("repl");
const environment = process.env.NODE_ENV;

var replServer = repl.start({
  prompt: "Tapster Node Console> "
});

// Sequelize Database Models:
// const {
//   Category,
//   CategorySizes,
//   Size,
//   Store,
//   Product,
//   Order,
//   LineItem,
//   Customer,
//   Cart,
//   Inventory
// } = require("./services/db.service.js");

const db = require("./services/db.service.js");

// replServer.context.Category = Category;
// replServer.context.CategorySizes = CategorySizes;
// replServer.context.Size = Size;
// replServer.context.Store = Store;
// replServer.context.Product = Product;
// replServer.context.Order = Order;
// replServer.context.LineItem = LineItem;
// replServer.context.Customer = Customer;
// replServer.context.Cart = Cart;
// replServer.context.Inventory = Inventory;
replServer.context.db = db;
replServer.context._ = _;

// Product.belongsTo(Category);

// Product.findAll().then(prod => console.log(prod));

// Product.findOne({ where: { id: 1 } }).then(prod => console.log(prod.category));
// Product.belongsTo(Category, { foreignKey: "categoryId" });

// const p1 = await Product.findOne({ where: { id: 1 }, include: [Category] });
// p1.Category.name

// cat = await Category.findOne({ where: { id: 1 }, include: [Product] });
// _.first(cat.Products).name;

// const o = await Order.findAll({include: [Product]})
// o[0].Products
// const o = await Order.findAll({include: [{model: Product, as: "Products", through: {attributes: ["orderId", "productId"]}}]});
// o1 = await Order.findOne({ where: { id: 1 }, include: [LineItem] });

// li = await LineItem.findOne({ where: { id: 1 }, include: [Order] });

// getProducts(), setProducts(), addProduct(), addProducts() to Order
// getOrders(), setOrders(), addOrder(), and addOrders() to Products
