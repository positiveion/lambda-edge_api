'use strict';
const querystring = require('querystring');
var url = require("url");
var path = require("path");
var jwt = require("./jwt");

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

  var stagePath = "production";
  var host = request.headers.host[0].value;
  if (host.indexOf("staging") > -1) stagePath = "staging";

  if (token.length > 0) {
    var user = jwt.decode(token.replace("Bearer ", ""));
  }

  var isPublic = false;
  if (request.uri.indexOf("/api/public") == 0) isPublic = true;
  request.uri = request.uri.replace("api/", "");

  if (isPublic == false) {
    request.uri = "/" + account + request.uri;
  }

  //ie: /api/public/login/validateCode , /api/admin/account/all
  request.uri = "/" + stagePath + request.uri;

  console.log(request.uri);

  return request;

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
