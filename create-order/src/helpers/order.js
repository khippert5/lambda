// @flow
import { v4 as uuidv4 } from 'uuid';

import type { Order } from '../lib/types';

export const getPayload = (order: Order): { [key: string]: { S: string } } => {
  let newOrder = {};
  // eslint-disable-next-line array-callback-return
  Object.keys(order).map((prop) => {
    let value = order[prop];
    if (order[prop] !== 'string') value = JSON.stringify(order[prop]);
    newOrder[prop] = { S: value };
  });

  newOrder.orderNumber = { S: uuidv4() };
  newOrder.timeStamp = { S: new Date().getTime().toString() };

  return newOrder;
};

export default getPayload;
