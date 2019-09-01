# Tapster Server

Node/Express API for Tapster apps and dashboards

## Dev Setup:

- Create a `.env` file in the root of the project
  it should contain the following:

```
NODE_ENV=development
DB_NAME=tapster
DB_USER=root
DB_PASS=yourpassword
TWILIO_SID=yourtwiliosid
TWILIO_AUTH_TOKEN=yourtwilioauthtoken
```

- Make sure mysql server is running locally.
- Download and use [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) to manage and browse your local db server
- Create a schema (database) called `tapster`
- Run migrations to update the schema: `npx sequelize-cli db:migrate`
- `npm run dev` to start the server and make sure it runs with no errors.

## Node console:

To run the node console with access to db, run:
`node api/console.js`

To return all records from the Products table:
`Product.findAll().then(p => console.log(p))`

OR

`const prod = await Product.findOne({ where: { id: 1 }, include: [Category] });`

## Heroku deploy:

- Deploy:
  `git push heroku master`

- Run database migrations:
  `heroku run npx sequelize-cli db:migrate`

## Sequelize ORM CLI commands:

Install sequelize-cli:
`npm install --save-dev sequelize-cli`

or globally:
`npm install -g sequelize-cli`

### Creating migrations/models:

`sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string`

### Apply migrations:

`sequelize db:migrate`

### Undo last migration:

`sequelize db:migrate:undo`

### Seed the database:

`sequelize db:seed:all`

### Creating model associations inside the models:

#### Examples:

For `Product.js`:

Inside the `Product.associate = function(models) {` block in the model:

```
Product.belongsTo(models.Category, {
  foreignKey: "id",
  sourceKey: "categoryId"
});
```

And inside the `Category.js`:

Inside the `Category.associate = function(models) {` block:

```
  Category.hasMany(models.Product, {
    foreignKey: "id",
    targetKey: "productId"
  });
```

Can work with shortcuts instead if the keys are named using the standard names:
`Category.hasMany(models.Product)`

### Using associations:

#### Retrieving a Product with associated Category:

```
const prod = await Product.findOne({
  where: { id: 1 },
  include: [Category]
});
```

`prod.Category.name` `//'Beer'`

#### Retrieving a Category with associated Products:

```
const cat = await Category.findOne({
   where: { id: 1 },
   include: [Product]
});
```

`_.first(cat.Products).name;` || `cat.Products[0].name;`
