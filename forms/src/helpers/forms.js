// @flow
import { v4 as uuidv4 } from 'uuid';

import type { FormData } from '../lib/types';

export const getformDataPayload = (data: FormData): { [key: string]: { S: string } } => {
  let newData = {};
  // eslint-disable-next-line array-callback-return
  Object.keys(data).map((prop) => {
    let value = data[prop];
    if (data[prop] !== 'string') value = JSON.stringify(data[prop]);
    newData[prop] = { S: value };
    console.log('data prop', prop, value, newData[prop]);
  });

  newData.timeStamp = { S: new Date().getTime().toString() };

  return newData;
};

export default getformDataPayload;
