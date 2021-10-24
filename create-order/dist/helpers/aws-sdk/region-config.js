"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.s3Region = exports.dynamoRegion = exports.default = void 0;

// 
require('../../dotenv');

const AWS = require('aws-sdk');

const s3Region = () => {
  const {
    AWS_APP_REGION
  } = process.env;
  return new AWS.S3({
    endpoint: 'https://s3.us-east-2.amazonaws.com',
    apiVersion: '2006-03-01',
    region: AWS_APP_REGION
  });
};

exports.s3Region = s3Region;

const dynamoRegion = () => {
  const {
    AWS_APP_REGION
  } = process.env;
  return new AWS.DynamoDB({
    endpoint: 'https://s3.us-east-2.amazonaws.com',
    apiVersion: '2006-03-01',
    region: AWS_APP_REGION
  });
};

exports.dynamoRegion = dynamoRegion;
var _default = dynamoRegion;
exports.default = _default;