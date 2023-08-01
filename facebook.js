const axios = require('axios');

//user 3653781581574038
//user2 act_2337849136500629
// Credenciais de acesso do aplicativo do Facebook
const appId = '1345524276039480'; //1345524276039480 //1424544814777647
const appSecret = ''; //65d043a522dbd92ba0ac970af7d30cb8 //95779eb4b4c03f35aee618f54fc34bbf
//EAATHv0iCjzgBO49udNicwYFfIbe7c7IMXRQZCeT9XZC8ByGaPr4IIMpQ2Wbm8A0pr8a4ZB2SRYReTCVVUQ8NjAAsCTxZCTbKE06mIiaZC3kbkFBunbzil7Gfm4t1GWPVABkcdtKp7o9Nwb5SRTA0F6AOjVeGFPdFnoISYvoIaSHxXbNqauVEUBP9jChr4B58jPlMDrKPtBuVvAhd3kCF9FLICBgNRSy0ZB6J5yZChY9JesZD

// Token de acesso de página
const pageAccessToken = '';

// ID da página onde deseja criar o evento
const pageId = '228412443934071';

// Informações do evento a ser criado
const evento = {
  name: 'Meu Evento',
  start_time: '2023-08-01T19:00:00',
  end_time: '2023-08-01T23:00:00',
  description: 'Descrição do meu evento',
  location: 'Local do evento',
};

const post = {
    message: 'hello world!'
}

// URL da API do Facebook para criar eventos
const apiUrl = `https://graph.facebook.com/${pageId}/feed`;

// Configuração do cabeçalho com o token de acesso
const headers = {
  Authorization: `Bearer ${pageAccessToken}`,
};

// // Chamada POST para criar o evento
axios.post(apiUrl, post, { headers })
  .then(response => {
    console.log('Evento criado com sucesso:', response.data);
  })
  .catch(error => {
    console.error('Erro ao criar evento:', error.response.data.error);
  });


  // axios.post('https://graph.facebook.com/hardlevelbr/feed', post, { headers })
  // .then(response => {
  //   console.log('Evento criado com sucesso:', response.data);
  // })
  // .catch(error => {
  //   console.error('Erro ao criar evento:', error.response.data.error);
  // });

  axios.get('https://graph.facebook.com/hardlevelbr/feed', post, { headers })
  .then(response => {
    console.log('Evento criado com sucesso:', response.data);
  })
  .catch(error => {
    console.error('Erro ao criar evento:', error.response.data.error);
  });