const { Model, Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/database');
//const sequelize = new Sequelize('sqlite::memory:');

const Games = db.sequelize.define('Games', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  mobyId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  platform: {
    type: DataTypes.STRING,
    allowNull: false
  },
  releaseDate: {
    type: DataTypes.STRING
  },
  cover: {
    type: DataTypes.STRING
  }
});
//recria banco de dados e apagadados
//Games.sync({ force: true });

//module.exports = Games;

(async () => {
  await Games.sync().then(console.log('Tabela Games sincronizada'));
})();

module.exports = Games;