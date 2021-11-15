"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.buildAvaAddress = exports.buildAddress = void 0;

// 
const buildAvaAddress = ({
  address
}) => {
  const validKeys = ['line1', 'line2', 'line3', 'city', 'region', 'country', 'postalCode'];
  const keys = Object.keys(address);
  const cleanAddress = {};

  for (let i = 0; i < validKeys.length; i++) {
    const key = validKeys[i];
    cleanAddress[key] = address[key];
  }

  return cleanAddress;
};

exports.buildAvaAddress = buildAvaAddress;

const buildAddress = ({
  address
}) => {
  const {
    address1,
    address2,
    city,
    country,
    state,
    zip
  } = address;
  return {
    city,
    country: country || 'us',
    line1: address1 || '',
    line2: address2 || '',
    postalCode: zip,
    region: state
  };
};

exports.buildAddress = buildAddress;
var _default = buildAddress;
exports.default = _default;