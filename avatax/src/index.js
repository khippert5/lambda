// @flow
import Avatax from 'avatax';

import kmiLog from './helpers/logger';

type Address = {
  address1: string,
  address2: string,
  city: string,
  country: string,
  state: string,
  zip: string,
}

type EventPayload = {
  address: Address,
};

const handler = async (event: EventPayload) => {
  kmiLog({ message: 'Avatax triggered', event });
  let { address } = event;
  const headers = {
    'X-Requested-With': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
  };

  if (!address) {
    kmiLog({ message: 'Error parsing body', event });
    return {
      headers,
      body: JSON.stringify({
        address,
        error: 'Failed to find address in payload',
        errorMessage: 'No address found in request',
      }),
      status: 'failed',
      statusCode: 500,
    };
  }

  if (address && typeof address === 'string') {
    try {
      address = JSON.parse(address);
    } catch (err) {
      kmiLog({ message: 'Error parsing address', event });
      return {
        headers,
        body: JSON.stringify({
          address,
          error: 'Mailformed JSON. Address could not be parsed.',
          errorMessage: 'Error parsing address.',
        }),
        status: 'failed',
        statusCode: 500,
      };
    }
  }

  const {
    NODE_ENV,
    AVATAX_PW,
    AVATAX_UN
  } = process.env;

  // resolve configuration and credentials
  const config = {
    appName: 'urbanchic',
    appVersion: '1.0',
    environment: NODE_ENV,
    machineName: 'Lambda'
  };

  const creds = {
    username: AVATAX_UN,
    password: AVATAX_PW,
  };

  if (typeof address !== 'string') {
    const client = new Avatax(config).withSecurity(creds);
    const { city, country, state, zip } = address;
    const avaAddress = {
      city,
      postalCode: zip,
      region: state,
      country: country || 'us',
    };

    const response = client.resolveAddress(avaAddress)
      .then(result => {
        // address validation result
        console.log(result);
      });

    kmiLog({ message: 'Successful address validation', response });
    return {
      headers,
      body: JSON.stringify({
        address,
        response,
      }),
      status: 'success',
      statusCode: 200,
    };
  }

  return {
    headers,
    body: JSON.stringify({
      address,
      error: 'Address validation failed',
      errorMessage: 'Malformed address. Inability to parse value.'
    }),
    status: 'failed',
    statusCode: 500,
  };
}

export default handler;
