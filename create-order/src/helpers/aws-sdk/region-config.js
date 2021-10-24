// @flow

require('../../dotenv');

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const dynamoRegion = (): any => {
  const { AWS_APP_REGION } = process.env;
  return new DynamoDBClient({ endpoint: 'https://s3.us-east-2.amazonaws.com', apiVersion: '2006-03-01', region: AWS_APP_REGION });
};

export default dynamoRegion;
