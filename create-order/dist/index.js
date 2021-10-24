"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _logger = _interopRequireDefault(require("./helpers/logger"));

var _order = require("./helpers/order");

// 
require('./dotenv');
/* eslint-disable import/first */


// Types

/* eslint-enable import/first */
const dynamo = new _awsSdk.default.Dynamo();

const handler = async event => {
  // Event only handles POST event from gateway
  (0, _logger.default)({
    message: 'Create order triggered',
    event
  });
  const headers = {
    'X-Requested-With': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS'
  };
  const {
    order
  } = event;
  let newOrder = '';
  const NODE_ENV = process.env.NODE_EVN || 'dev';
  if (!order && event.body) newOrder = event.body;

  try {
    newOrder = JSON.parse(order);
  } catch (err) {
    (0, _logger.default)({
      message: 'Error reading order',
      newOrder,
      error: err
    });
  }

  let status = true;
  let statusCode = 200;
  const error = {
    message: '',
    errorMessage: ''
  };
  (0, _logger.default)(order); // if (typeof newOrder === 'string') {
  //   return {
  //     headers,
  //     body: JSON.stringify({
  //       error: {
  //         message: 'Error reading order payload',
  //       },
  //       order: newOrder,
  //       status: false,
  //       statusCode: 500,
  //     }),
  //     status,
  //     statusCode,
  //   };
  // }
  // const options = getOrderPayload(newOrder);
  // const results = await dynamo.putItem({
  //   TableName: `products_${NODE_ENV}`,
  //   Item: options,
  // }, (err, data) => {
  //   if (err) {
  //     const errorData = {
  //       ok: false,
  //       error: err,
  //     };
  //     return errorData;
  //   }
  //   return {
  //     ok: true,
  //     data,
  //   };
  // });
  // if (!results.ok) {
  //   status = false;
  //   statusCode = 500;
  //   error.message = 'Failed to save order. Please contact support. Error code: FTSO01';
  // }
  // const { orderNumber, timeStamp } = options;
  // return {
  //   headers,
  //   body: JSON.stringify({
  //     order: {
  //       ...newOrder,
  //       orderNumber,
  //       timeStamp,
  //     },
  //     status,
  //     statusCode,
  //   }),
  //   status,
  //   statusCode,
  // };
};

var _default = handler;
exports.default = _default;