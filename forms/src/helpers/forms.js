// @flow
import { v4 as uuidv4 } from 'uuid';

import type { FormData } from '../lib/types';

const setTimeStamp = () => new Date().getTime().toString();

export const setPayload = (data: FormData): { [key: string]: string } => {
  let newData = {};
  // eslint-disable-next-line array-callback-return
  Object.keys(data).map((prop) => {
    let value = data[prop];
    if (data[prop] !== 'string') value = JSON.stringify(data[prop]);
    newData[prop] = value;
    console.log('data prop', prop, value, newData[prop]);
  });

  newData.timeStamp = setTimeStamp();

  return newData;
};

export default setPayload;
