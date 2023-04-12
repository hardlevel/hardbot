const paapi = require('paapi5-nodejs-sdk');
require('dotenv').config();

// Carregar configurações
const config = process.env

// Configurar cliente PAAPI
const client = paapi.ApiClient.instance;
client.accessKey = config.accessKeyId;
client.secretKey = config.secretAccessKey;
client.partnerTag = config.partnerTag;
client.partnerType = config.partnerType;
client.host = 'webservices.amazon.com.br';
client.region = 'us-east-1';

var api = new ProductAdvertisingAPIv1.DefaultApi();

const searchItemsRequest = new ProductAdvertisingAPIv1.SearchItemsRequest();
searchItemsRequest['PartnerTag'] = 'config.partnerTag';
searchItemsRequest['PartnerType'] = 'Associates';
 
// Specify search keywords
searchItemsRequest['Keywords'] = 'Harry Potter';

searchItemsRequest['Resources'] = ['Images.Primary.Medium', 'ItemInfo.Title', 'Offers.Listings.Price'];

var callback = function (error, data, response) {
    if (error) {
      console.log('Error calling PA-API 5.0!');
      console.log('Printing Full Error Object:\n' + JSON.stringify(error, null, 1));
      console.log('Status Code: ' + error['status']);
      if (error['response'] !== undefined && error['response']['text'] !== undefined) {
        console.log('Error Object: ' + JSON.stringify(error['response']['text'], null, 1));
      }
    } else {
      console.log('API called successfully.');
      var searchItemsResponse = ProductAdvertisingAPIv1.SearchItemsResponse.constructFromObject(data);
      console.log('Complete Response: \n' + JSON.stringify(searchItemsResponse, null, 1));
      if (searchItemsResponse['SearchResult'] !== undefined) {
        console.log('Printing First Item Information in SearchResult:');
        var item_0 = searchItemsResponse['SearchResult']['Items'][0];
        if (item_0 !== undefined) {
          if (item_0['ASIN'] !== undefined) {
            console.log('ASIN: ' + item_0['ASIN']);
          }
          if (item_0['DetailPageURL'] !== undefined) {
            console.log('DetailPageURL: ' + item_0['DetailPageURL']);
          }
          if (item_0['ItemInfo'] !== undefined && item_0['ItemInfo']['Title'] !== undefined && item_0['ItemInfo']['Title']['DisplayValue'] !== undefined) {
            console.log('Title: ' + item_0['ItemInfo']['Title']['DisplayValue']);
          }
          if (item_0['Offers'] !== undefined && item_0['Offers']['Listings'] !== undefined && item_0['Offers']['Listings'][0]['Price'] !== undefined && item_0['Offers']['Listings'][0]['Price']['DisplayAmount'] !== undefined) {
            console.log('Buying Price: ' + item_0['Offers']['Listings'][0]['Price']['DisplayAmount']);
          }
        }
      }
      if (searchItemsResponse['Errors'] !== undefined) {
        console.log('Errors:');
        console.log('Complete Error Response: ' + JSON.stringify(searchItemsResponse['Errors'], null, 1));
        console.log('Printing 1st Error:');
        var error_0 = searchItemsResponse['Errors'][0];
        console.log('Error Code: ' + error_0['Code']);
        console.log('Error Message: ' + error_0['Message']);
      }
    }
  };
   
  try {
    api.searchItems(searchItemsRequest, callback);
  } catch (ex) {
    console.log('Exception: ' + ex);
  }

// Parâmetros de solicitação
/*const request = new paapi.GetItemsRequest();
request.ItemIds = ['B07VJYZF24']; // Código do produto
request.PartnerTag = config.partnerTag; // Seu PartnerTag
request.PartnerType = config.partnerType; // Seu PartnerType
request.Language = 'pt_BR'; // Idioma da resposta

// Fazer a solicitação à API
/*paapi.GetItems(request, async (err, data) => {
  if (err) {
    console.error(err);
  } else {
    // Extrair informações do produto da resposta
    const product = data.ItemsResult.Items[0];
    const productId = product.ASIN;
    const productName = product.ItemInfo.Title.DisplayValue;
    const productUrl = product.DetailPageURL;

    // Gerar link de afiliado
    const affiliateUrl = productUrl + '?tag=' + config.partnerTag;

    // Armazenar informações do produto em um arquivo JSON
    const productData = {
      id: productId,
      name: productName,
      url: affiliateUrl
    };
    fs.writeFileSync('product.json', JSON.stringify(productData, null, 2));

    console.log('Informações do produto armazenadas em product.json');
    console.log('Link de afiliado gerado:', affiliateUrl);
  }
});*/
