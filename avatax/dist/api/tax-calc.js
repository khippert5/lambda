"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _avatax = require("../helpers/avatax");

var _logger = _interopRequireDefault(require("../helpers/logger"));

// 
const calculateTax = async ({
  address,
  client,
  order
}) => {
  const taxDocument = {
    type: 'SalesOrder',
    companyCode: 'urbanchicus',
    date: (0, _moment.default)().format('YYYY-MM-DD'),
    customerCode: '2000824774',
    purchaseOrderNo: 'test-na',
    addresses: {
      ShipFrom: {
        city: "Charlton",
        country: "US",
        line1: "6 Hannahs Way",
        line2: "",
        line3: "",
        locationCode: "DEFAULT",
        postalCode: "01507-1587",
        region: "MA"
      },
      ShipTo: (0, _avatax.buildAvaAddress)({
        address
      })
    },
    lines: [{
      amount: '100',
      description: 'No description',
      itemCode: '',
      quantity: '1'
    }],
    commit: false
  };
  console.log('taxDocument payload', taxDocument, JSON.stringify(taxDocument));
  (0, _logger.default)({
    message: 'Tax document sending to avatax',
    payload: taxDocument
  });
  const response = await client.createTransaction({
    model: taxDocument
  }).then(result => {
    // response tax document
    console.log('response tax document', result);
    return result;
  });

  if (!response || response && /error/gi.test(JSON.stringify(response))) {
    const {
      error,
      errors
    } = response;
    const errorMessage = `Failed to get tax calculation. Error: ${error || errors || 'undefined'}`;
    (0, _logger.default)({
      message: errorMessage,
      response
    });
    return {
      ok: false,
      error: 'Failed to get tax',
      errorMessage
    };
  }

  (0, _logger.default)({
    message: 'Tax calculation successful',
    response
  });
  return {
    ok: true,
    value: response
  };
};

var _default = calculateTax;
exports.default = _default;