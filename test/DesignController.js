require('co-mocha');

import {expect} from 'chai';
import connectToDatabase from '../app/config/database';
import loadModels from '../app/utils/loadModels';
import sinon from 'sinon';
const mongoose = require('mongoose');
const mockgoose = require('mockgoose');

let DesignController;

// mock the mongoose
mockgoose(mongoose);

before(function* () {
  // manually connect MOCKGOOSE db
  connectToDatabase({}, mongoose);
  loadModels();
  DesignController = require('../app/controllers/api/v1/DesignController');
});

describe('Design Controller', function() {
  it('get all approved designs', function* () {

    var rawDesigns = [
      {
        status: 'approved'
      },
      {
        status: 'pending'
      },
      {
        status: 'rejected'
      }
    ];

    for (let i = 0; i < rawDesigns.length; i++) {
      let d = rawDesigns[i];
      let design = new Designs(d);
      yield design.save();
    }

    let res = {
      status: function() {
        return this;
      },
      json: function(r) {
        expect(r.data.length).to.be.equal(1);
      }
    };

    yield DesignController.getAllApprovedDesigns({}, res, {});
  });

});

after(function() {
  mockgoose.reset('Designs');
});
