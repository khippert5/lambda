"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setPayload = exports.default = void 0;

var _uuid = require("uuid");

// 
const setTimeStamp = () => new Date().getTime().toString();

const setPayload = data => {
  let newData = {}; // eslint-disable-next-line array-callback-return

  Object.keys(data).map(prop => {
    let value = data[prop];
    if (data[prop] !== 'string') value = JSON.stringify(data[prop]);
    newData[prop] = value;
    console.log('data prop', prop, value, newData[prop]);
  });
  newData.timeStamp = setTimeStamp();
  return newData;
};

exports.setPayload = setPayload;
var _default = setPayload;
exports.default = _default;