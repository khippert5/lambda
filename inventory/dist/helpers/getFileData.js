"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileData = void 0;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _logger = _interopRequireDefault(require("./logger"));

// flow
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

const getFileData = params => new Promise((resolve, reject) => {
  (0, _logger.default)({
    message: 'getParam',
    params
  });

  try {
    return S3.getObject(params, (err, data) => {
      if (err) {
        const newError = {
          ok: false,
          error: err
        };
        reject(newError);
      }

      try {
        const {
          Body
        } = data;
        resolve(Body.toString('utf-8'));
      } catch (error) {
        const newError = {
          ok: false,
          error
        };
        reject(newError);
      }
    });
  } catch (err) {
    return {
      ok: false,
      error: err
    };
  }
});

exports.getFileData = getFileData;