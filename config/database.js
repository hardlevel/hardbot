const Sequelize  = require('sequelize');
const path  = require('path');
const dbFile = path.resolve(__dirname, '../database/database.sqlite');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbFile
});

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize
}