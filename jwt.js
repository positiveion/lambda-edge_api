var JWT = require('jwt-simple');
var Promise = require("bluebird");

Jwt = {}
Jwt.secret = Buffer.from('ae1a1981a419f3ri5377b64d14794932', 'hex');

Jwt.encode = function(contact) {
  var jwtValue = {
    first_name: contact.first_name,
    last_name: contact.last_name,
    ACL: contact.ACL || '{}',
    profile: contact.profile || 'public',
    email: contact.email || '',
    mobile_phone: contact.mobile_phone || '',
    details: contact.details || '{}',
    id: contact.id,
    namespace_id: contact.namespace_id,
    env: contact.env,
    account: {
      name: contact.account.name
    }
  }

  return JWT.encode(jwtValue, Jwt.secret);
}

Jwt.decode = function(token) {
  var promise = function(resolve, reject) {
    try {
      resolve(JWT.decode(token, Jwt.secret));
    } catch (e) {
      reject()
    }

  }
  return new Promise(promise);
}

module.exports = Jwt;
