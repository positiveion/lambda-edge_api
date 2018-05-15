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

  const request = event.Records[0].cf.request;

  var account = getAccountCookie(request.headers);
  var token = getAuthHeader(request.headers);

  var stagePath = "production";
  var host = request.headers.host[0].value;
  if (host.indexOf("staging") > -1) stagePath = "staging";

  var isPublic = false;
  if (request.uri.indexOf("/api/public") == 0) isPublic = true;
  request.uri = request.uri.replace("api/", "");

  if (isPublic == false) {
    var user = jwt.decode(token.replace("Bearer ", ""));
    var account = user.account.name;
    request.uri = "/" + account + request.uri;
  }

  //ie: /api/public/login/validateCode , /api/admin/account/all
  request.uri = "/" + stagePath + request.uri;

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
  var authorization = headers["x-token"] || [];
  var token = "";
  authorization.forEach(function(c) {
    token = c.value;
  })
  return token;
}
