// flow

import AWS from 'aws-sdk';
import kmiLog from './logger';

const { AWS_APP_REGION } = process.env || { AWS_APP_REGION: 'us-east-1' };

const S3 = new AWS.S3({ endpoint: 'https://s3.us-east-1.amazonaws.com', apiVersion: '2006-03-01', region: AWS_APP_REGION });

export const getFileData = (params: { BUCKET: string, Key: string }) => new Promise((resolve, reject) => {
  kmiLog({ message: 'getParam', params });

  try {
    return S3.getObject(params, (err, data) => {
      if (err) {
        const newError = {
          ok: false,
          error: err,
        };
        reject(newError);
      }
      try {
        const { Body } = data;
        resolve(Body.toString('utf-8'));
      } catch (error) {
        const newError = {
          ok: false,
          error,
        };
        reject(newError);
      }
    });
  } catch (err) {
    return {
      ok: false,
      error: err,
    };
  }
});
