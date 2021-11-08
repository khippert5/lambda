// @flow
require('./dotenv');

/* eslint-disable import/first */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

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
  kmiLog({ message: 'Update Order triggered', event });
  const headers = {
    'X-Requested-With': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
  };
  let { order } = event;
  let newOrder = {};

  kmiLog({ order, newOrder, varType: typeof order });

  if (event.body) newOrder = event.body;

  try {
    newOrder = typeof order === 'string' ? await JSON.parse(order) : order;
  } catch (err) {
    kmiLog({ message: 'Error reading order data', newOrder, error: err });
  }

  let lambdaStatus = true;
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
      status: lambdaStatus,
      statusCode,
    };
  }
  const { orderNumber, status, timeStamp, paymentData } = order;
  const completedStamp = new Date().getTime().toString();
  const params = {
    // $FlowFixMe: Allow
    TableName: `orders_${NODE_ENV}`,
    Key: {
      "orderNumber": orderNumber,
      "timeStamp": timeStamp

    },
    UpdateExpression: "set #status = :a, #completed = :b, #paymentData = :c",
    ExpressionAttributeNames: {
        "#completed": 'completed',
        "#status": 'status',
        "#paymentData": 'paymentData'
    },
    ExpressionAttributeValues: {
        ":a": status,
        ":b": completedStamp,
        ":c": paymentData,
    }
  };

  kmiLog({ params });

  try {
    const command = new UpdateCommand(params);
    console.log('command', command);
    const results = await new Promise((resolve, reject) => client.send(command, (err, data) => {
      if (err) {
        kmiLog({ message: 'Error during dynamo update', err });
        const errorData = {
          ok: false,
          error,
        };
        reject(errorData);
      }
      kmiLog({ message: 'Dynamo update success', data });
      resolve({
        ok: true,
        data,
      });
    }));

    // console.log('results', results);

    if (!results || !results.ok) {
      lambdaStatus = false;
      statusCode = 500;
      error.message = 'Failed to save order data. Please contact support. Error code: FTSO01';
      throw new Error(error);
    }

    return {
      headers,
      body: JSON.stringify({
        update: 'success',
        orderNumber,
      }),
      status: lambdaStatus,
      statusCode,
    };
  } catch (err) {
    kmiLog({ message: 'failed to init update', err });
    return {
      headers,
      body: JSON.stringify({
        update: 'failed',
        orderNumber,
        error: err,
      }),
      status: false,
      statusCode: false,
    };
  }
};

export default handler;
