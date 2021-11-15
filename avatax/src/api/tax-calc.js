// @flow

import moment from 'moment';

import { buildAvaAddress } from '../helpers/avatax';
import kmiLog from '../helpers/logger';

import type { Address, Order } from '../lib/types';

type CalcProps = { address: Address, client: any, order: Order}
type CalcResults = {
  ok: boolean,
  value: any,
} | {
  ok: boolean,
  error: string,
}
const calculateTax = async ({ address, client, order }: CalcProps): Promise<CalcResults> => {
  const taxDocument = {
    type: 'SalesOrder',
    companyCode: 'urbanchicus',
    date: moment().format('YYYY-MM-DD'),
    customerCode: '2000824774',
    purchaseOrderNo: 'test-na',
    addresses: {
      ShipFrom: {
        city: "Charlton",
        country: "US",
        line1: "6 Hannahs Way",
        line2: "",
        line3: "",
        locationCode: "DEFAULT",
        postalCode: "01507-1587",
        region: "MA",
      },
      ShipTo: buildAvaAddress({ address }),
    },
    lines: [
      {
        amount: '100',
        description: 'No description',
        itemCode: '',
        quantity: '1',
      }
    ],
    commit: false
  }

  console.log('taxDocument payload', taxDocument, JSON.stringify(taxDocument));
  kmiLog({ message: 'Tax document sending to avatax', payload: taxDocument });

  const response = await client.createTransaction({ model: taxDocument })
    .then(result => {
      // response tax document
      console.log('response tax document', result);
      return result;
    });

  if (!response || (response && (/error/gi).test(JSON.stringify(response)))) {
    const { error, errors } = response;
    const errorMessage = `Failed to get tax calculation. Error: ${error || errors || 'undefined'}`;
    kmiLog({ message: errorMessage, response });
    return {
      ok: false,
      error: 'Failed to get tax',
      errorMessage,
    }
  }

  kmiLog({ message: 'Tax calculation successful', response });
  return {
    ok: true,
    value: response,
  }
}

export default calculateTax;
