var chai = require('chai');
var should = chai.should();
var Handler = require("../index").handler;
var Event = require("./event");
var Event2 = require("./event2");
//Our parent block
describe('Operation test', () => {

  it('it should return headers', function(done) {

    Handler(Event)
      .then(function(res) {
        console.log(res);
        res.headers["x-namespace"].should.not.equal(null)
        done();
      })

  });

  it('it should return headers', function(done) {

    Handler(Event2)
      .then(function(res) {
        console.log(res);
        res.headers["authorization"].should.not.equal(null)
        res.headers["x-namespace"].should.not.equal(null)
        done();
      })

  });

});
