'use strict';
const querystring = require('querystring');
var url = require("url");
var path = require("path");

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
  signatureVersion: 'v4',
});

exports.handler = async(event) => {

  console.log(JSON.stringify(event));
  const request = event.Records[0].cf.request;
  console.log(JSON.stringify(request));

  var account = getAccountCookie(request.headers);
  var token = getAuthHeader(request.headers);
  console.log(JSON.stringify(event));
  console.log(account)
  console.log(token)

  request.uri = request.uri.replace("api/", "");
  return callback(null, request);

};

function getAccountCookie(headers) {
  var cookie = headers.cookie || [];
  var account = "";
  cookie.forEach(function(c) {
    if (c.value.indexOf("account=") == 0) account = c.value.replace("account=", "");
  })
  return account;
}

function getAuthHeader(headers) {
  var authorization = headers.authorization || [];
  var token = "";
  authorization.forEach(function(c) {
    token = c.value;
  })
  return token;
}
