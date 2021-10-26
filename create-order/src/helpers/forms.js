// @flow
import { v4 as uuidv4 } from 'uuid';

import type { FormData } from '../lib/types';

export const getPayload = (formData: FormData): { [key: string]: { S: string } } => {
  let payload = {};
  // eslint-disable-next-line array-callback-return
  Object.keys(formData).map((prop) => {
    let value = formData[prop];
    if (formData[prop] !== 'string') value = JSON.stringify(formData[prop]);
    payload[prop] = { S: value };
  });

  payload.submitted = { S: moment().format('YYYY-mm-dd HH:mm:ss:')}
  payload.timeStamp = { S: new Date().getTime().toString() };

  return payload;
};

export default getPayload;
