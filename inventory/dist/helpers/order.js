"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOrderPayload = exports.default = void 0;

var _uuid = require("uuid");

// 
const getOrderPayload = order => {
  let newOrder = {}; // eslint-disable-next-line array-callback-return

  Object.keys(order).map(prop => {
    const value = typeof order[prop] !== 'string' ? JSON.stringify(order[prop]) : order[prop]; // $FlowFixMe: ToDo - find out why flow doesn't like this

    newOrder[prop] = {
      S: value
    };
  });
  newOrder = { ...newOrder,
    orderNumber: {
      S: (0, _uuid.v4)()
    },
    timeStamp: {
      S: new Date().getTime().toString()
    }
  };
  return newOrder;
};

exports.getOrderPayload = getOrderPayload;
var _default = getOrderPayload;
exports.default = _default;