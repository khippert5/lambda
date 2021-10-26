"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPayload = exports.default = void 0;

var _uuid = require("uuid");

// 
const getPayload = order => {
  let newOrder = {}; // eslint-disable-next-line array-callback-return

  Object.keys(order).map(prop => {
    let value = order[prop];
    if (order[prop] !== 'string') value = JSON.stringify(order[prop]);
    newOrder[prop] = {
      S: value
    };
  });
  newOrder.orderNumber = {
    S: (0, _uuid.v4)()
  };
  newOrder.timeStamp = {
    S: new Date().getTime().toString()
  };
  return newOrder;
};

exports.getPayload = getPayload;
var _default = getPayload;
exports.default = _default;