'use strict';
const querystring = require('querystring');
var url = require("url");
var path = require("path");
var JWT = require("@positiveion/proton/helpers/jwt");

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
  signatureVersion: 'v4',
});

var Promise = require("bluebird");

function App(event) => {

  const request = event.Records[0].cf.request;
  console.log(JSON.stringify(event));
  console.log(request);
  var authorization = request.headers.authorization || request.headers.authorization;
  console.log(authorization);


  request.uri = request.uri.replace("api/", "");
  return request;

};

module.exports = App;
