"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setPayload = exports.default = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _uuid = require("uuid");

// 
const setOrderId = () => `${(0, _moment.default)().format('YYYYMMDDkkmmssSS')}${(0, _uuid.v4)().split('-')[0].toString().toUpperCase()}`;

const setTimeStamp = () => new Date().getTime().toString();

const setPayload = order => {
  let newOrder = {}; // eslint-disable-next-line array-callback-return

  Object.keys(order).map(prop => {
    let value = order[prop];
    if (order[prop] !== 'string') value = JSON.stringify(order[prop]);
    newOrder[prop] = value;
  });
  newOrder.orderNumber = setOrderId();
  newOrder.timeStamp = setTimeStamp();
  return newOrder;
};

exports.setPayload = setPayload;
var _default = setPayload;
exports.default = _default;