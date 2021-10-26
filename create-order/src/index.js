// @flow
require('./dotenv');

/* eslint-disable import/first */
import { DynamoDBClient, BatchExecuteStatementCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid';

import { getPayload } from './helpers/order';
import kmiLog from './helpers/logger';
import dynamoRegion from './helpers/aws-sdk/region-config';

// Types
import type { Order } from './lib/types';
/* eslint-enable import/first */

type EventPayload = {
  body: string,
  order: Order,
};

const { AWS_APP_REGION, NODE_ENV } = process.env || { AWS_APP_REGION: 'us-east-1', NODE_ENV: 'dev' };

const client = new DynamoDBClient({ apiVersion: '2012-08-10', region: AWS_APP_REGION });

const handler = async (event: EventPayload) => {
  // Event only handles POST event from gateway
  kmiLog({ message: 'Order triggered', event });
  const headers = {
    'X-Requested-With': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
  };
  let { order } = event;
  let newOrder: Order | string = {};

  kmiLog({ order, newOrder, varType: typeof order });

  if (event.body) newOrder = event.body;

  try {
    newOrder = typeof order === 'string' ? await JSON.parse(order) : order;
  } catch (err) {
    kmiLog({ message: 'Error reading order data', newOrder, error: err });
  }

  let status = true;
  let statusCode = 200;
  const error = {
    message: '',
    errorMessage: '',
  };

  kmiLog(newOrder);

  if (typeof newOrder === 'string') {
    return {
      headers,
      body: JSON.stringify({
        error: {
          message: 'Error reading order data',
        },
      }),
      status,
      statusCode,
    };
  }

  const params = {
    TableName: `orders_${NODE_ENV}`,
    Item: getPayload(newOrder),
  };

  kmiLog({ params });

  try {
    const command = new BatchExecuteStatementCommand(params);
    console.log('command', command);
    const results = await new Promise((resolve, reject) => client.send(command, (err, data) => {
      if (err) {
        kmiLog({ message: 'Error during dynamo put', err });
        const errorData = {
          ok: false,
          error,
        };
        reject(errorData);
      }
      kmiLog({ message: 'Dynamo put success', data });
      resolve({
        ok: true,
        data,
      });
    }));

    // console.log('results', results);

    if (!results || !results.ok) {
      status = false;
      statusCode = 500;
      error.message = 'Failed to save order data. Please contact support. Error code: FTSO01';
    }

    return {
      headers,
      body: JSON.stringify({
        items: params.Item,
      }),
      status,
      statusCode,
    };
  } catch (err) {
    kmiLog({ message: 'failed to init putItem', err });
    return {
      headers,
      body: JSON.stringify({
        items: params.Item,
      }),
      status: false,
      statusCode: false,
    };
  }
};

export default handler;
