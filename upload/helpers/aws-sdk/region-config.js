// @flow

require('../../dotenv');

import { S3Client } from '/@aws-sdk/client-s3';

export const s3Region = (): any => {
  const { AWS_APP_REGION } = process.env;
  return new S3Client({ endpoint: 'https://s3.us-east-2.amazonaws.com', apiVersion: '2006-03-01', region: AWS_APP_REGION });
};

export default dynamoRegion;
