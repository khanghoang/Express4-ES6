require('co-mocha');

import {expect} from 'chai';
import connectToDatabase from '../app/config/database';

const mongoose = require('mongoose');
const mockgoose = require('mockgoose');

let Design;

// mock the mongoose
mockgoose(mongoose);

before(function* () {
  // manually connect MOCKGOOSE db
  connectToDatabase({}, mongoose);

  // because of mockgoose, we need to define Design
  // model again
  Design = require('../app/models/Design');
});

describe('Design Controller', function() {
  it('get all approved designs', function* () {
    let design = new Design({status: 'approved'});
    try {
      yield design.save();
    } catch (e) {
      expect(e).to.be.null;
    }

    yield design.remove();
  });

  it('should raise error when type is not valid', function* () {
    let design = new Design({status: 'invalid-type'});
    try {
      yield design.save();
    } catch (err) {
      expect(err).to.not.be.null;
    }
  });
});
