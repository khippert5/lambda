"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kmiLogger = exports.default = void 0;

// 
const kmiLogger = value => {
  let type = value && value.error ? 'error' : 'info';
  if (/error/gi.test(JSON.stringify(value))) type = 'error'; // eslint-disable-next-line no-console

  console.log({
    type,
    notice: 'KMI_LOG_STATUS',
    ...value
  });
};

exports.kmiLogger = kmiLogger;
var _default = kmiLogger;
exports.default = _default;