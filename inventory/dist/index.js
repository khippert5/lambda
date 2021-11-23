"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logger = _interopRequireDefault(require("./helpers/logger"));

var _getFileData = require("./helpers/getFileData");

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

// 
require('./dotenv');
/* eslint-disable import/first */


const {
  AWS_APP_REGION
} = process.env || {
  AWS_APP_REGION: 'us-east-1'
};
const S3 = new _awsSdk.default.S3({
  endpoint: 'https://s3.us-east-1.amazonaws.com',
  apiVersion: '2006-03-01',
  region: AWS_APP_REGION
});
/* eslint-enable import/first */

const handler = async event => {
  // Event only handles POST event from gateway
  (0, _logger.default)({
    message: 'Get inventory triggered',
    event
  });
  const headers = {
    'X-Requested-With': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS'
  };
  let {
    object
  } = event;
  let newItem = {};
  (0, _logger.default)({
    object
  });
  const NODE_ENV = process.env.NODE_ENV || 'dev';
  const {
    AWS_S3_BUCKET_NAME
  } = process.env || {
    AWS_S3_BUCKET_NAME: 'test'
  };
  if (!object && event.body) object = event.body;

  try {
    newItem = typeof object === 'string' ? await JSON.parse(object) : object;
  } catch (err) {
    (0, _logger.default)({
      message: 'Error reading get inventory values',
      newItem,
      error: err
    });
  }

  let status = true;
  let statusCode = 200;
  const error = {
    message: '',
    errorMessage: ''
  };
  (0, _logger.default)(newItem);

  if (typeof newItem === 'string') {
    return {
      headers,
      body: {
        error: {
          message: 'Error reading inventory items'
        },
        status: false,
        statusCode: 500
      },
      status,
      statusCode
    };
  }

  const {
    folder,
    file
  } = newItem;
  const params = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: `${NODE_ENV}/${file}`
  };
  (0, _logger.default)({
    params
  });
  return new Promise((resolve, reject) => {
    (0, _logger.default)({
      message: 'getParam',
      params
    });
    return S3.getObject(params, (err, data) => {
      if (err) {
        (0, _logger.default)({
          message: 'Error getting data',
          params,
          error: JSON.stringify(err)
        });
        const newError = {
          ok: false,
          error: err
        };
        reject({
          headers,
          body: JSON.stringify({
            error: newError
          }),
          status: false,
          statusCode: 500
        });
      }

      const {
        Body
      } = data;
      (0, _logger.default)({
        message: 'Data received',
        data: Body.toString('utf-8')
      });
      resolve({
        headers,
        body: JSON.stringify({
          data: Body.toString('utf-8')
        }),
        status,
        statusCode
      });
    });
  });
};

var _default = handler;
exports.default = _default;