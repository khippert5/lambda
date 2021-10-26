"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getformDataPayload = exports.default = void 0;

var _uuid = require("uuid");

// 
const getformDataPayload = data => {
  let newData = {}; // eslint-disable-next-line array-callback-return

  Object.keys(data).map(prop => {
    let value = data[prop];
    if (data[prop] !== 'string') value = JSON.stringify(data[prop]);
    newData[prop] = {
      S: value
    };
    console.log('data prop', prop, value, newData[prop]);
  });
  newData.timeStamp = {
    S: new Date().getTime().toString()
  };
  return newData;
};

exports.getformDataPayload = getformDataPayload;
var _default = getformDataPayload;
exports.default = _default;