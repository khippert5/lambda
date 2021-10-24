// @flow

require('../../dotenv');

export const dynamoRegionConfig = (): any => {
  const { AWS_APP_REGION } = process.env;
  return {
    endpoint: `https://s3.${AWS_APP_REGION}.amazonaws.com`,
    apiVersion: '2012-08-10',
  };
};

export default dynamoRegionConfig;
