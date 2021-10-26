// @flow
require('./dotenv');

/* eslint-disable import/first */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

import { setPayload } from './helpers/forms';
import kmiLog from './helpers/logger';
import dynamoRegion from './helpers/aws-sdk/region-config';

// Types
import type { FormData } from './lib/types';
/* eslint-enable import/first */

type EventPayload = {
  body: string,
  formData: string,
};

const { AWS_APP_REGION, NODE_ENV } = process.env || { AWS_APP_REGION: 'us-east-1', NODE_ENV: 'dev' };

const client = new DynamoDBClient({ apiVersion: '2012-08-10', region: AWS_APP_REGION });

const handler = async (event: EventPayload) => {
  // Event only handles POST event from gateway
  kmiLog({ message: 'Forms lambda triggered', event });
  const headers = {
    'X-Requested-With': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
  };
  let formData = event.formData ? event.formData : event;

  kmiLog({ formData, varType: typeof formData });

  if (event.body) formData = event.body;

  try {
    formData = typeof formData === 'string' ? await JSON.parse(formData) : formData;
  } catch (err) {
    kmiLog({ message: 'Error reading formData', formData, error: err });
  }

  let status = true;
  let statusCode = 200;
  const error = {
    message: '',
    errorMessage: '',
  };

  kmiLog(formData);

  if (!formData || (formData && typeof formData === 'string')) {
    return {
      headers,
      body: JSON.stringify({
        error: {
          message: 'Error reading formData payload',
        },
      }),
      status,
      statusCode,
    };
  }

  const { formname } = formData;

  const params = {
    TableName: `forms_${NODE_ENV}`,
    Item: setPayload(formData),
  };

  kmiLog({ params });

  try {
    const command = new PutCommand(params);
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
      error.message = 'Failed to save formData. Please contact support. Error code: FTSO01';
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
