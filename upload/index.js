// @flow
require('./dotenv');

/* eslint-disable import/first */
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

import { getOrderPayload } from './helpers/order';
import kmiLog from './helpers/logger';
import dynamoRegion from './helpers/aws-sdk/region-config';

// Types
import type { Order } from './lib/types';
/* eslint-enable import/first */

type EventPayload = {
  body: string,
  order: string,
};

const client = new AWS.DynamoDB(dynamoRegion());

const handler = async (event: EventPayload) => {
  // Event only handles POST event from gateway
  kmiLog({ message: 'Create order triggered', event });
  const headers = {
    'X-Requested-With': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
  };
  let { order } = event;
  let newOrder: Order | string = {};

  kmiLog({ order, newOrder, varType: typeof order });

  const NODE_ENV = process.env.NODE_EVN || 'dev';

  if (!order && event.body) order = event.body;

  try {
    newOrder = typeof order === 'string' ? await JSON.parse(order) : order;
  } catch (err) {
    kmiLog({ message: 'Error reading order', newOrder, error: err });
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
      body: {
        error: {
          message: 'Error reading order payload',
        },
        status: false,
        statusCode: 500,
      },
      status,
      statusCode,
    };
  }

  const { billing, email, products, shipping, tax, total } = newOrder;

  const params = {
    TableName: `orders_${NODE_ENV}`,
    Item: getOrderPayload(newOrder),
  };

  kmiLog({ params });

  const results = await client.putItem(params, (err, data) => {
    if (err) {
      kmiLog({ message: 'Error during dynamo put', err });
      const errorData = {
        ok: false,
        error,
      };
      return errorData;
    }
    kmiLog({ message: 'Dynamo put success', data });
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
      items: params.Item,
      status,
      statusCode,
    }),
    status,
    statusCode,
  };
};

export default handler;
