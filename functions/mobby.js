const games = require('../src/controllers/gamesController');
const { mobby } = require('../config.json');
const { stringify } = require('querystring');
// ps1 = 6, ps2 = 7, ps3 = 81, ps4 = 141, ps5 = 288, psp = 46, psvita = 105

//const crypto = require('crypto');
//const querystring = require('node:querystring');

async function gameDetails (title) {
    const baseUrl = new URL('https://api.mobygames.com/v1/games');
    const params = {
        title,
        platform:7,
        format:'normal',
        api_key:mobby
    };
    baseUrl.search = stringify(params);
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    //console.log(baseUrl);
    //console.log(title);
    //console.log(options);

    try {
        const response = await fetch(baseUrl.href, options);
        const responseBody = await response.json();
        //console.log(responseBody);
        return responseBody;
    } catch (error) {
        console.log(error);
				logger.error(error);
        return error.message
    }
}

async function gameCover (title) {
    const baseUrl = new URL('https://api.mobygames.com/v1/games');
    const params = {
        title,
        platform:7,
        format:'normal',
        api_key:mobby
    };
    baseUrl.search = stringify(params);
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    //console.log(baseUrl);
    //console.log(title);
    //console.log(options);

    try {
        const response = await fetch(baseUrl.href, options);
        const responseBody = await response.json();
        console.log(responseBody);
        return responseBody.games[0].sample_cover.image;
    } catch (error) {
        console.log(error);
				logger.error(error);
        return error.message
    }
}

const platforms = [6, 7, 81, 141, 288, 46, 105];

async function getGames(platform) {
  console.log('processando dados para plataforma: ', platform);
  let dataCount = [];
  let offset = 0;
  let continueExecution = true;

  async function makeRequest(platform) {
    const baseUrl = new URL('https://api.mobygames.com/v1/games');
    const params = {
      limit: 100,
      platform,
      format: 'normal',
      offset,
      api_key: mobby,
    };
    baseUrl.search = stringify(params);

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    console.log(baseUrl.href);

    try {
      const response = await fetch(baseUrl.href, options);
      const responseBody = await response.json();

      console.log(response.status);
      console.log(response.ok);

      if (response.ok) {
        dataCount = dataCount.concat(responseBody.games);
        offset += 100;

        console.log(`Total de registros: ${dataCount.length}`);

        // Chama storeGames após cada solicitação bem-sucedida
        await storeGames(responseBody.games, platform);

        return responseBody.games.length === 100; // Continue apenas se houver 100 registros
      }
    } catch (error) {
			logger.error(error);
      console.log(error);

      if (error.message.includes('Rate limit exceeded')) {
        console.log('Atingido o limite de solicitações. Aguardando...');
        await new Promise(resolve => setTimeout(resolve, 3600000));
        return true;
      }

      throw error;
    }
  }

  do {
    console.log('Aguardando 10 segundos antes da próxima tentativa...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    continueExecution = await makeRequest(platform);
    console.log(continueExecution);

  } while (continueExecution);

  return dataCount;
}

// Chama a função principal de forma sequencial
async function processPlatforms() {
  for (const platform of platforms) {
    const data = await getGames(platform);
    console.log('Ok. Total de registros:', data.length);
  }
}

// Inicia o processamento das plataformas
//processPlatforms();


async function storeGames(gamesArr, platform) {
  let consoleName = '';
  switch (platform) {
    case 6:
      consoleName = 'ps1';
      break;
    case 7:
      consoleName = 'ps2';
      break;
    case 81:
      consoleName = 'ps3';
      break;
    case 141:
      consoleName = 'ps4';
      break;
    case 288:
      consoleName = 'ps5';
      break;
    case 46:
      consoleName = 'psp';
      break;
    case 105:
      consoleName = 'vita';
      break;
  }
  console.log(consoleName, platform);

  if (Array.isArray(gamesArr)) {
    gamesArr.forEach(game => {
      let releaseDate = '';
      game.platforms.forEach(item => {
        if (item.platform_id == platform) {
          releaseDate = item.first_release_date;
        }
      });

      const imageUrl = game.sample_cover && game.sample_cover.image;

      games.add(game.game_id, game.title, consoleName, imageUrl, releaseDate);
    });
  }
}

async function getGamesPlatform(platform) {
  const gamesCollection = await games.getGamesPlatform(platform);
  return gamesCollection;
}

async function todayGame() {
  const game = await games.getTodayGame();
  return game;
}

async function getMultiGames(...platform) {
  const game = await games.getGamesMultiPlatform(...platform);
  return game;
}

// getMultiGames('ps1','ps2').then(game => {
//   console.log(game);
// }).catch(error => {
//   console.error(error);
// });

//storeGames();
module.exports = { gameDetails, gameCover, todayGame, getMultiGames };

// const { moby } = require('./functions/mobby');
// (async() => {
//     try {
//         const result = await moby('delta force: black hawk down');
//         console.log(result.games[0].sample_cover.image);
//     } catch (error) {
//         console.error(error);
//     }
// })();