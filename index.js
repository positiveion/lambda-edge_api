'use strict';
var ServiceHelper = require("@positiveion/proton/service");

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  ServiceHelper(event, context, callback)
};
