// @flow
require('./dotenv');

/* eslint-disable import/first */
import { DynamoDBClient, BatchExecuteStatementCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid';

import { getformDataPayload } from './helpers/formData';
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

const client = new DynamoDBClient({ region: AWS_APP_REGION });

const handler = async (event: EventPayload) => {
  // Event only handles POST event from gateway
  kmiLog({ message: 'Forms lambda triggered', event });
  const headers = {
    'X-Requested-With': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
  };
  let { formData } = event;
  let newFormData: FormData | string = {};

  kmiLog({ formData, newFormData, varType: typeof formData });

  if (!formData && event.body) formData = event.body;

  try {
    newFormData = typeof formData === 'string' ? await JSON.parse(formData) : formData;
  } catch (err) {
    kmiLog({ message: 'Error reading formData', newFormData, error: err });
  }

  let status = true;
  let statusCode = 200;
  const error = {
    message: '',
    errorMessage: '',
  };

  kmiLog(newFormData);

  if (typeof newFormData === 'string') {
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

  const { formname } = newFormData;

  const params = {
    TableName: `forms_${NODE_ENV}`,
    Item: getformDataPayload(newFormData),
  };

  kmiLog({ params });

  try {
    const command = new BatchExecuteStatementCommand(params);
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
