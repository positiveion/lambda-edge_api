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

  console.log(JSON.stringify(request));

  var normalHeaders = normalize(request.headers);

  var token = normalHeaders.authorization || normalHeaders["x-token"];
  //delete normalHeaders.authorization;

  var stagePath = "production";
  var namespace = normalHeaders["x-namespace"] || "production";

  var host = request.headers.host[0].value;
  if (host.indexOf("staging") > -1) {
    namespace = normalHeaders["x-namespace"] || "staging";
    stagePath = "staging";
  }
  normalHeaders["x-namespace"] = namespace;

  var isPublic = false;
  if (request.uri.indexOf("/api/public") == 0) isPublic = true;
  request.uri = request.uri.replace("api/", "");

  if (isPublic == false) {
    if (!token) return {
      status: '401',
      statusDescription: 'unauthorized',
      headers: {
        'content-type': [{
          key: 'Content-Type',
          value: 'applicacion/json'
        }],
        'content-encoding': [{
          key: 'Content-Encoding',
          value: 'UTF-8'
        }],
      },
      body: '{"error": "Token not found for non-public route"}',
    };
    var user = jwt.decode(token.replace("Bearer ", ""));
    var account = user.account.name;
    request.uri = "/" + account + request.uri;
    normalHeaders["x-token"] = token;
  }

  request.headers = denormalize(normalHeaders)

  //ie: /api/public/login/validateCode , /api/admin/account/all
  request.uri = "/" + stagePath + request.uri;

  console.log(JSON.stringify(request));
  return request;

};


function normalize(headers) {
  var keys = Object.keys(headers);
  var result = {}
  keys.forEach(function(key) {
    key = key.toLowerCase();
    result[key] = headers[key][0].value;
  })
  return result;
}

function denormalize(headers) {
  var keys = Object.keys(headers);
  var result = {}
  keys.forEach(function(key) {
    key = key.toLowerCase();
    result[key] = [{
      key: key,
      value: headers[key]
    }]
  })
  return result;
}
