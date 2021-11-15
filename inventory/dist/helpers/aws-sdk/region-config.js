"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.s3Region = exports.default = void 0;

var _clientS = require("@aws-sdk/client-s3");

// 
require('../../dotenv');

const s3Region = () => {
  const {
    AWS_APP_REGION
  } = process.env;
  return new _clientS.S3Client({
    endpoint: 'https://s3.us-east-2.amazonaws.com',
    apiVersion: '2006-03-01',
    region: AWS_APP_REGION
  });
};

exports.s3Region = s3Region;
var _default = s3Region;
exports.default = _default;