"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dynamoRegion = exports.default = void 0;

var _clientDynamodb = require("@aws-sdk/client-dynamodb");

// 
require('../../dotenv');

const dynamoRegion = () => {
  const {
    AWS_APP_REGION
  } = process.env;
  return new _clientDynamodb.DynamoDBClient({
    endpoint: 'https://s3.us-east-2.amazonaws.com',
    apiVersion: '2006-03-01',
    region: AWS_APP_REGION
  });
};

exports.dynamoRegion = dynamoRegion;
var _default = dynamoRegion;
exports.default = _default;