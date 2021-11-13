// @flow
import Avatax from 'avatax';

import kmiLog from './helpers/logger';

// API
import calcTax from './api/tax-calc';

// Helpers
import { buildAddress } from './helpers/avatax';

import type { Address, Order } from './lib/types';

type EventPayload = {
  address: Address,
  order: Order,
};

const handler = async (event: EventPayload) => {
  kmiLog({ message: 'Avatax triggered', event });
  let { address, order } = event;
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
    const avaAddress = buildAddress({ address });

    const response = await client.resolveAddress(avaAddress)
      .then(result => {
        // address validation result
        console.log(result);
        kmiLog({ message: 'Avatax response', result: JSON.stringify(result) });
        return result;
      });

    kmiLog({ message: 'Successful address validation', response });

    const responseAddress = response.validatedAddresses[0];
    const taxCalcResponse = await calcTax({ address: responseAddress, client, order });

    kmiLog({ message: 'Tax calculation response', taxCalcResponse });

    if (!taxCalcResponse.ok) {
      return {
        headers,
        body: JSON.stringify({
          address: taxCalcResponse.value.addresses[1].ShipTo,
          error: 'Error calculating tax',
        }),
        status: 'failed',
        statusCode: 500,
      };
    }
    if (taxCalcResponse.ok) {
      const { addresses, totalTax, totalTaxCalculated } = taxCalcResponse.value;
      return {
        headers,
        body: JSON.stringify({
          address: taxCalcResponse.value.addresses[1].ShipTo,
          totalTax,
          totalTaxCalculated,
        }),
        status: 'success',
        statusCode: 200,
      };
    }
  }
}

export default handler;
