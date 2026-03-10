const { Sequelize } = require('sequelize');

const {
  DB_DIALECT = 'sqlite',
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'sociosphere_db',
} = process.env;

let sequelize;

if (DB_DIALECT === 'mysql') {
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false,
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'sociosphere.sqlite',
    logging: false,
  });
}

module.exports = sequelize;

