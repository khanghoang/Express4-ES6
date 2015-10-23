require('co-mocha');

import {expect} from 'chai';
import Promise from 'bluebird';
import connectToDatabase from '../app/config/database';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');

// mock the mongoose
mockgoose(mongoose);

before(function* () {

  // manually connect MOCKGOOSE db
  connectToDatabase({}, mongoose);

  // because of mockgoose, we need to define Design
  // model again
  GLOBAL.Design = Promise.promisifyAll(require('../app/models/Design'));
});

describe('Design Model', function() {
  it('should have correct type', function* () {
    // somehow when use mockgoose, the save/update/remove
    // function of mongoose model hass problem
    // this way is a pain in ass
    let design = new Design({status: 'approved'});
    let saveAsync = Promise.promisify(design.save);
    try {
      yield saveAsync.bind(design)();
    } catch (e) {
      expect(e).to.be.null;
    }

    let designs = yield Design.findAsync({});
    expect(designs).to.be.ok;

    let removeAsync = Promise.promisify(design.remove);
    yield removeAsync.bind(design);
  });

  // this way is less pain, but we need to come back
  // to our old friend, callback
  it('should raise error when type is not valid', function(done) {
    let design = new Design({status: 'invalid-type'});
    design.save(function(err) {
      expect(err).to.not.be.null;
      design.remove(done);
    });
  });
});
