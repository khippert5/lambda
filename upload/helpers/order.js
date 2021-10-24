// @flow
import { v4 as uuidv4 } from 'uuid';

import type { Order } from '../lib/types';

export const getOrderPayload = (order: Order): { [key: string]: { S: string } } => {
  let newOrder = {};
  // eslint-disable-next-line array-callback-return
  Object.keys(order).map((prop) => {
    const value = typeof order[prop] !== 'string' ? JSON.stringify(order[prop]) : order[prop];
    // $FlowFixMe: ToDo - find out why flow doesn't like this
    newOrder[prop] = { S: value };
  });

  newOrder = {
    ...newOrder,
    orderNumber: { S: uuidv4() },
    timeStamp: { S: new Date().getTime().toString() },
  };

  return newOrder;
};

export default getOrderPayload;
