"use strict";

//const crypto = require('crypto');
//const querystring = require('node:querystring');
var _require = require('../config.json'),
    api_token = _require.api_token,
    aliKey = _require.aliKey,
    aliSecret = _require.aliSecret,
    aliTrackId = _require.aliTrackId;

var logger = require("../logger");

var url = "https://api-sg.aliexpress.com/sync";

var crypto = require('crypto');

module.exports = function _callee(product_ids) {
  var generateSignature, parameters, signature, getProduct;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          getProduct = function _ref2(sign, parameters) {
            var response, responseData, data, product;
            return regeneratorRuntime.async(function getProduct$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    parameters.sign = sign;
                    _context.prev = 1;
                    _context.next = 4;
                    return regeneratorRuntime.awrap(fetch(url, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json;charset=utf-8"
                      },
                      body: JSON.stringify(parameters)
                    }));

                  case 4:
                    response = _context.sent;
                    _context.next = 7;
                    return regeneratorRuntime.awrap(response.json());

                  case 7:
                    responseData = _context.sent;
                    data = responseData.aliexpress_affiliate_productdetail_get_response.resp_result.result;

                    if (!(data.current_record_count == 0)) {
                      _context.next = 13;
                      break;
                    }

                    return _context.abrupt("return", {
                      error: 404,
                      msg: "produto não encontrado ou sem suporte para link de afiliado"
                    });

                  case 13:
                    product = data.products.product[0];
                    return _context.abrupt("return", {
                      original_id: product_ids,
                      title: product.product_title,
                      image: product.product_main_image_url,
                      discount: product.discount,
                      price: product.target_sale_price,
                      category1: product.first_level_category_name,
                      category2: product.second_level_category_name,
                      images: product.product_small_image_urls.string
                    });

                  case 15:
                    _context.next = 20;
                    break;

                  case 17:
                    _context.prev = 17;
                    _context.t0 = _context["catch"](1);
                    console.error(_context.t0);

                  case 20:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, null, [[1, 17]]);
          };

          generateSignature = function _ref(parameters, aliSecret) {
            // Passo 1: Ordenar os parâmetros por nome em ASCII
            var sortedParams = Object.keys(parameters).sort().map(function (key) {
              return "".concat(key).concat(parameters[key]);
            }).join(''); // Passo 2: Concatenar os parâmetros ordenados

            var concatenatedString = sortedParams; // Passo 3: Codificar a string concatenada em UTF-8 e fazer um digest pelo algoritmo de assinatura (HMAC_SHA256)

            var hmac = crypto.createHmac('sha256', aliSecret);
            hmac.update(concatenatedString); // Passo 4: Converter o digest para formato hexadecimal

            var sign = hmac.digest('hex');
            return sign.toUpperCase();
          };

          // Parâmetros da requisição
          parameters = {
            method: 'aliexpress.affiliate.productdetail.get',
            product_ids: product_ids,
            tracking_id: aliTrackId,
            app_key: aliKey,
            sign_method: 'sha256',
            timestamp: Math.floor(Date.now() / 1000) // Timestamp UNIX atual em segundos

          }; // Gerar a assinatura

          signature = generateSignature(parameters, aliSecret);
          _context2.next = 6;
          return regeneratorRuntime.awrap(getProduct(signature, parameters));

        case 6:
          return _context2.abrupt("return", _context2.sent);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
};