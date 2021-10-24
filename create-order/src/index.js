// @flow
require('./dotenv');

/* eslint-disable import/first */
import kmiLog from './helpers/logger';

import dynamoDBClient from './helpers/aws-sdk/region-config';

import { getOrderPayload } from './helpers/order';
// Types
import type { Order } from './lib/types';
/* eslint-enable import/first */

type EventPayload = {
  body: string,
  order: string,
};

const dynamo = dynamoDBClient();

const handler = async (event: EventPayload) => {
  // Event only handles POST event from gateway
  kmiLog({ message: 'Create order triggered', event });
  const headers = {
    'X-Requested-With': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
  };
  const { order } = event;
  let newOrder: Order | string = '';

  const NODE_ENV = process.env.NODE_EVN || 'dev';

  if (!order && event.body) newOrder = event.body;

  try {
    newOrder = JSON.parse(order);
  } catch (err) {
    kmiLog({ message: 'Error reading order', newOrder, error: err });
  }

  let status = true;
  let statusCode = 200;
  const error = {
    message: '',
    errorMessage: '',
  };

  kmiLog(order);

  // if (typeof newOrder === 'string') {
  //   return {
  //     headers,
  //     body: JSON.stringify({
  //       error: {
  //         message: 'Error reading order payload',
  //       },
  //       order: newOrder,
  //       status: false,
  //       statusCode: 500,
  //     }),
  //     status,
  //     statusCode,
  //   };
  // }

  // const options = getOrderPayload(newOrder);

  // const results = await dynamo.putItem({
  //   TableName: `products_${NODE_ENV}`,
  //   Item: options,
  // }, (err, data) => {
  //   if (err) {
  //     const errorData = {
  //       ok: false,
  //       error: err,
  //     };
  //     return errorData;
  //   }

  //   return {
  //     ok: true,
  //     data,
  //   };
  // });

  // if (!results.ok) {
  //   status = false;
  //   statusCode = 500;
  //   error.message = 'Failed to save order. Please contact support. Error code: FTSO01';
  // }

  // const { orderNumber, timeStamp } = options;

  // return {
  //   headers,
  //   body: JSON.stringify({
  //     order: {
  //       ...newOrder,
  //       orderNumber,
  //       timeStamp,
  //     },
  //     status,
  //     statusCode,
  //   }),
  //   status,
  //   statusCode,
  // };
};

export default handler;
