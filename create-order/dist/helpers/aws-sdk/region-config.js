"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dynamoRegionConfig = exports.default = void 0;

// 
require('../../dotenv');

const dynamoRegionConfig = () => {
  const {
    AWS_APP_REGION
  } = process.env;
  return {
    endpoint: `https://s3.${AWS_APP_REGION}.amazonaws.com`,
    apiVersion: '2012-08-10'
  };
};

exports.dynamoRegionConfig = dynamoRegionConfig;
var _default = dynamoRegionConfig;
exports.default = _default;