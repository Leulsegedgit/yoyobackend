const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("yoyo", "root", "password", {
  host: "localhost",
  dialect: "mysql",
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.FormData = require("./formData")(sequelize, Sequelize);

module.exports = db;
