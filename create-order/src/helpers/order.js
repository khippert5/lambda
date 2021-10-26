// @flow
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import type { Order } from '../lib/types';

const setOrderId = () => `${moment().format('YYYYMMDDkkmmssSS')}${uuidv4().split('-')[0].toString().toUpperCase()}`;

const setTimeStamp = () => new Date().getTime().toString();

export const setPayload = (order: Order): { [key: string]: { S: string } } => {
  let newOrder = {};
  // eslint-disable-next-line array-callback-return
  Object.keys(order).map((prop) => {
    let value = order[prop];
    if (order[prop] !== 'string') value = JSON.stringify(order[prop]);
    newOrder[prop] = value;
  });

  newOrder.orderNumber = setOrderId();
  newOrder.timeStamp = setTimeStamp();

  return newOrder;
};

export default setPayload;
