"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _uuid = require("uuid");

var _order = require("./helpers/order");

var _logger = _interopRequireDefault(require("./helpers/logger"));

var _regionConfig = _interopRequireDefault(require("./helpers/aws-sdk/region-config"));

// 
require('./dotenv');
/* eslint-disable import/first */


// Types

/* eslint-enable import/first */
const {
  AWS_APP_REGION,
  NODE_ENV
} = process.env || {
  AWS_APP_REGION: 'us-east-1',
  NODE_ENV: 'dev'
};

_awsSdk.default.config.update({
  region: AWS_APP_REGION
});

const dynamodb = new _awsSdk.default.DynamoDB({
  apiVersion: '2012-08-10'
});
;

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
  let {
    order
  } = event;
  let newOrder = {};
  (0, _logger.default)({
    order,
    newOrder,
    varType: typeof order
  });
  if (!order && event.body) order = event.body;

  try {
    newOrder = typeof order === 'string' ? await JSON.parse(order) : order;
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
  (0, _logger.default)(newOrder);

  if (typeof newOrder === 'string') {
    return {
      headers,
      body: JSON.stringify({
        error: {
          message: 'Error reading order payload'
        }
      }),
      status,
      statusCode
    };
  }

  const {
    billing,
    email,
    products,
    shipping,
    tax,
    total
  } = newOrder;
  const params = {
    TableName: `orders_${NODE_ENV}`,
    Item: (0, _order.getOrderPayload)(newOrder)
  };
  (0, _logger.default)({
    params
  });

  try {
    const results = await new Promise((resolve, reject) => dynamodb.putItem(params, (err, data) => {
      if (err) {
        (0, _logger.default)({
          message: 'Error during dynamo put',
          err
        });
        const errorData = {
          ok: false,
          error
        };
        reject(errorData);
      }

      (0, _logger.default)({
        message: 'Dynamo put success',
        data
      });
      resolve({
        ok: true,
        data
      });
    })); // console.log('results', results);

    if (!results || !results.ok) {
      status = false;
      statusCode = 500;
      error.message = 'Failed to save order. Please contact support. Error code: FTSO01';
    }

    return {
      headers,
      body: JSON.stringify({
        items: params.Item
      }),
      status,
      statusCode
    };
  } catch (err) {
    (0, _logger.default)({
      message: 'failed to init putItem',
      err
    });
    return {
      headers,
      body: JSON.stringify({
        items: params.Item
      }),
      status: false,
      statusCode: false
    };
  }
};

var _default = handler;
exports.default = _default;