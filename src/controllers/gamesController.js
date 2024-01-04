const Games = require('../models/gamesModel');
const { Op } = require("sequelize");
const { sequelize } = require('../../config/database');

const getGamesMultiPlatform = async (...platforms) => {
  const random = Math.floor(Math.random() * platforms.length);
  const platform = platforms[random];  
  const game = await Games.findAndCountAll({
    where: { 
      platform,
      cover: {
        [Op.not]: null
      }
    },
    order: sequelize.random(),
    limit: 1,
    offset: 0,
    raw : true ,
  }).then(game => {
    // console.log('Jogo encontrado:');
    // console.log(game);
    return game;
  })
  .catch(err => console.log(err));
  return game;
};

const add = async (mobyId, title, platform, cover, releaseDate) => {
  try {
    await Games.create({
      mobyId,
      title,
      platform,
      cover,
      releaseDate
    });
  } catch (error) {
    console.error('Erro ao buscar os jogos:', error);
    throw error;
  }
};

const getGames = async() => {
  try {
    const { count, rows } = await Games.findAndCountAll({
      where: {
        releaseDate: {
          [Op.not]: null
        }
      },
      offset: 0,
      limit: 100
    });
    // console.log(count);
    return { count, rows }; 
  } catch (error) {
    console.error('Erro ao buscar os jogos:', error);
    throw error;
  }
};

const getGamesPlatform = async (platform) => {
  try {
    const { count, rows } = await Games.findAndCountAll({
      where: {
        platform,
        releaseDate: {
          [Op.not]: null
        }
      },
      offset: 0,
      limit: 100
    });
    // console.log(count);
    // console.log(rows);
    return { count, rows }; 
  } catch (error) {
    console.error('Erro ao buscar os jogos:', error);
    throw error;
  }
};



// const findByPlatformCount = async (platform) => {
//   console.log('plataforma recebida: ' + platform);
//   const count = await Games.count({
//     where: {
//       platform,
//     },
//   });//.then(total => console.log('total, ' + total)).catch(error => console.error(error));
//   console.log(count);
//   //return count;
// }

// const findByPlatformRandom = async (platform) => {
//   console.log('plataforma selecionada: ' +  platform);
//   const game = await Games.findOne({
//     where: {
//       platform: platform,
//       id,
//       cover: {
//         [Op.not]: null
//       }
//     },
//   }).catch(error => console.error(error));
//   if (!game) {
//     return await findByPlatformRandom(platform, count);
//   }
//   return game;
// }

const getTodayGame = async () => {  
  const today = new Date().toLocaleDateString("fr-CA", {month: "2-digit", day:"2-digit"});  
  console.log(today);
  try {
    const { count, rows } = await Games.findAndCountAll({
      where: {
        releaseDate: {
          [Op.endsWith]: `-${today}`
        }
      },
      order: sequelize.random(),
      limit: 1,
      offset: 0,
      raw : true ,
    });
    // console.log(await count);
    // console.log(await rows);
    return { count, rows };
  }
  catch (error) {
    console.error('Erro ao buscar os jogos:', error);
    throw error;
  };
}

const pinto = () => console.log('pinto');

module.exports = {
  getGamesPlatform,
  getGames,
  getGamesMultiPlatform,
  getTodayGame,
  add
};