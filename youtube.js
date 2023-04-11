require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');

const channelId = require('YT_ID');
n
async function getChannelInfo(youtubeLink) {
  try {
        // Faz a requisição HTTP para a página do link do YouTube
        const response = await axios.get(youtubeLink);

        // Carrega o HTML da página usando o cheerio
        const $ = cheerio.load(response.data);

        // Extrai o nome do canal do HTML
        const channelName = $('a[href^="/channel/"]').text().trim();

        // Extrai a URL do canal do HTML
        const channelUrl = $('a[href^="/channel/"]').attr('href').split('/channel/')[1];

        // Retorna as informações do canal
        return {
            name: channelName,
            url: channelUrl
        };
    } catch (error) {
        console.error(`Ocorreu um erro ao verificar o canal do YouTube: ${error}`);
    }
}

// Exemplo de uso
const youtubeLink = 'https://www.youtube.com/channel/UC1234567890abcdefg';
getChannelInfo(youtubeLink)
    .then(channelInfo => {
        console.log('Nome do canal:', channelInfo.name);
        console.log('URL do canal:', channelInfo.url);
    })
    .catch(error => {
    console.error(error);
});
