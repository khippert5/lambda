// @flow

import type { Address } from '../lib/types';

export const buildAvaAddress = ({ address }: { address: { [key: string]: string }}) => {
  const validKeys = [
    'line1',
    'line2',
    'line3',
    'city',
    'region',
    'country',
    'postalCode'];
    const keys = Object.keys(address);
    const cleanAddress = {};
    for (let i = 0; i < validKeys.length; i++) {
      const key = validKeys[i];
      cleanAddress[key] = address[key];
    }

    return cleanAddress;
}

export const buildAddress = ({ address }: { address: Address }) => {
  const { address1, address2, city, country, state, zip } = address;
  return {
    city,
    country: country || 'us',
    line1: address1 || '',
    line2: address2 || '',
    postalCode: zip,
    region: state,
  }
}

export default buildAddress;
