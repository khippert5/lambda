// @flow

require('../../dotenv');

const AWS = require('aws-sdk');

export const s3Region = (): any => {
  const { AWS_APP_REGION } = process.env;
  return new AWS.S3({ endpoint: 'https://s3.us-east-2.amazonaws.com', apiVersion: '2006-03-01', region: AWS_APP_REGION });
};

export const dynamoRegion = (): any => {
  const { AWS_APP_REGION } = process.env;
  return new AWS.DynamoDB({ endpoint: 'https://s3.us-east-2.amazonaws.com', apiVersion: '2006-03-01', region: AWS_APP_REGION });
};

export default dynamoRegion;
