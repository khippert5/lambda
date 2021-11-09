"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _avatax = _interopRequireDefault(require("avatax"));

var _logger = _interopRequireDefault(require("./helpers/logger"));

var _taxCalc = _interopRequireDefault(require("./api/tax-calc"));

var _avatax2 = require("./helpers/avatax");

// 
// API
// Helpers
const handler = async event => {
  (0, _logger.default)({
    message: 'Avatax triggered',
    event
  });
  let {
    address,
    order
  } = event;
  const headers = {
    'X-Requested-With': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS'
  };

  if (!address) {
    (0, _logger.default)({
      message: 'Error parsing body',
      event
    });
    return {
      headers,
      body: JSON.stringify({
        address,
        error: 'Failed to find address in payload',
        errorMessage: 'No address found in request'
      }),
      status: 'failed',
      statusCode: 500
    };
  }

  if (address && typeof address === 'string') {
    try {
      address = JSON.parse(address);
    } catch (err) {
      (0, _logger.default)({
        message: 'Error parsing address',
        event
      });
      return {
        headers,
        body: JSON.stringify({
          address,
          error: 'Mailformed JSON. Address could not be parsed.',
          errorMessage: 'Error parsing address.'
        }),
        status: 'failed',
        statusCode: 500
      };
    }
  }

  const {
    NODE_ENV,
    AVATAX_PW,
    AVATAX_UN
  } = process.env; // resolve configuration and credentials

  const config = {
    appName: 'urbanchic',
    appVersion: '1.0',
    environment: NODE_ENV,
    machineName: 'Lambda'
  };
  const creds = {
    username: AVATAX_UN,
    password: AVATAX_PW
  };

  if (typeof address !== 'string') {
    const client = new _avatax.default(config).withSecurity(creds);
    const avaAddress = (0, _avatax2.buildAddress)({
      address
    });
    const response = await client.resolveAddress(avaAddress).then(result => {
      // address validation result
      console.log(result);
      (0, _logger.default)({
        message: 'Avatax response',
        result: JSON.stringify(result)
      });
      return result;
    });
    (0, _logger.default)({
      message: 'Successful address validation',
      response
    });
    const responseAddress = response.validatedAddresses[0];
    const taxCalcResponse = await (0, _taxCalc.default)({
      address: responseAddress,
      client,
      order
    });
    (0, _logger.default)({
      message: 'Tax calculation response',
      taxCalcResponse
    });

    if (!taxCalcResponse.ok) {
      return {
        headers,
        body: JSON.stringify({
          address: taxCalcResponse.value.addresses[1].ShipTo,
          payload,
          error: 'Error calculating tax'
        }),
        status: 'failed',
        statusCode: 500
      };
    }

    if (taxCalcResponse.ok) {
      const {
        addresses,
        totalTax,
        totalTaxCalculated
      } = taxCalcResponse.value;
      return {
        headers,
        body: JSON.stringify({
          address: taxCalcResponse.value.addresses[1].ShipTo,
          totalTax,
          totalTaxCalculated
        }),
        status: 'success',
        statusCode: 200
      };
    }
  }
};

var _default = handler;
exports.default = _default;