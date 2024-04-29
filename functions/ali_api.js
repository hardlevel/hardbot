//const crypto = require('crypto');
//const querystring = require('node:querystring');
const { api_token, aliKey, aliSecret, aliTrackId } = require('../config.json');
const logger = require("../logger");
const url = "https://api-sg.aliexpress.com/sync";
const crypto = require('crypto');

module.exports = async (product_ids) => {
	function generateSignature(parameters, aliSecret) {
    // Passo 1: Ordenar os parâmetros por nome em ASCII
    const sortedParams = Object.keys(parameters).sort().map(key => `${key}${parameters[key]}`).join('');

    // Passo 2: Concatenar os parâmetros ordenados
    const concatenatedString = sortedParams;

    // Passo 3: Codificar a string concatenada em UTF-8 e fazer um digest pelo algoritmo de assinatura (HMAC_SHA256)
    const hmac = crypto.createHmac('sha256', aliSecret);
    hmac.update(concatenatedString);

    // Passo 4: Converter o digest para formato hexadecimal
    const sign = hmac.digest('hex');

    return sign.toUpperCase();
	}

// Parâmetros da requisição
	const parameters = {
		method: 'aliexpress.affiliate.productdetail.get',
		product_ids,
		tracking_id: aliTrackId,
		app_key: aliKey,
		sign_method: 'sha256',
		timestamp: Math.floor(Date.now() / 1000) // Timestamp UNIX atual em segundos
	};

	// Gerar a assinatura
	const signature = generateSignature(parameters, aliSecret);


	async function getProduct(sign, parameters){
		parameters.sign = sign;
		try {
			const response = await fetch(url, {
				method: "POST",
				headers:{"Content-Type": "application/json;charset=utf-8"},
				body: JSON.stringify(parameters)
			});
			const responseData = await response.json();
			const data = responseData.aliexpress_affiliate_productdetail_get_response.resp_result.result;

			if (data.current_record_count == 0) {
				return {
					error: 404,
					msg: "produto não encontrado ou sem suporte para link de afiliado",
				};
			} else {
				const product = data.products.product[0];
				return {
					original_id: product_ids,
					title: product.product_title,
					image: product.product_main_image_url,
					discount: product.discount,
					price: product.target_sale_price,
					category1: product.first_level_category_name,
					category2: product.second_level_category_name,
					images: product.product_small_image_urls.string
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	return await getProduct(signature, parameters);
	// return await getProduct(signature, parameters);
    // let token = encodeURIComponent(api_token);
    // //console.log('id recebida para api: ', id);
    // const baseUrl = `https://hdlvl.dev/api/ali/${token}/${id}`;

    // const options = {
    //     method: 'GET',
    //     headers: { 'Content-Type': 'application/json' }
    // }

    // try {
    //     const response = await fetch(baseUrl, options)
    //     //console.log(await response.json())
    //     return await response.json();
    // } catch (error) {
    //     console.log(error);
		// 		logger.error(error);
    //     return error.message;
    // }
}