// @flow
require('./dotenv');

/* eslint-disable import/first */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const path = require('path');

const fs = require('fs');

import { getOrderPayload } from './helpers/order';
import kmiLog from './helpers/logger';
import dynamoRegion from './helpers/aws-sdk/region-config';
/* eslint-enable import/first */

type EventPayload = {
  body: string,
  item: string,
};

const s3Client = new S3Client(dynamoRegion());

const handler = async (event: EventPayload) => {
  // Event only handles POST event from gateway
  kmiLog({ message: 'Upload triggered', event });
  const headers = {
    'X-Requested-With': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
  };
  let { item } = event;
  let newItem = {};


  kmiLog({ item });

  const NODE_ENV = process.env.NODE_EVN || 'dev';
  const { AWS_BUCKET_NAME } = process.env || { AWS_BUCKET_NAME: 'test' }

  if (!item && event.body) item = event.body;

  try {
    newItem = typeof item === 'string' ? await JSON.parse(item) : item;
  } catch (err) {
    kmiLog({ message: 'Error reading upload item', newItem, error: err });
  }

  let status = true;
  let statusCode = 200;
  const error = {
    message: '',
    errorMessage: '',
  };

  kmiLog(newItem);

  if (typeof newItem === 'string') {
    return {
      headers,
      body: {
        error: {
          message: 'Error reading upload payload',
        },
        status: false,
        statusCode: 500,
      },
      status,
      statusCode,
    };
  }

  const { path, file } = newItem;
  const fileStream = fs.createReadStream(file);

  const params = {
    BUCKET: AWS_BUCKET_NAME,
    Key: path.basename(file),
    body: fileStream,
  };

  kmiLog({ params });

  const results = await s3Client.send(new PutObjectCommand(params), (err, data) => {
    if (err) {
      kmiLog({ message: 'Error during S# upload put', err });
      const errorData = {
        ok: false,
        error,
      };
      return errorData;
    }
    kmiLog({ message: 'S3 upload success', data });
    return {
      ok: true,
      data,
    };
  });

  console.log('results', results);

  if (!results || !results.ok) {
    status = false;
    statusCode = 500;
    error.message = 'Failed to save order. Please contact support. Error code: FTSO01';
  }

  return {
    headers,
    body: JSON.stringify({
      items: params,
      status,
      statusCode,
    }),
    status,
    statusCode,
  };
};

export default handler;
