require('co-mocha');

import {expect} from 'chai';
import connectToDatabase from '../app/config/database';
import loadModels from '../app/utils/loadModels';
const mongoose = require('mongoose');
const mockgoose = require('mockgoose');

let DesignController;
let DesignManager;

// mock the mongoose
mockgoose(mongoose);

before(function* () {
  // manually connect MOCKGOOSE db
  connectToDatabase({}, mongoose);
  loadModels();
  DesignController = require('../app/controllers/api/v1/DesignController');
  DesignManager = require('../app/managers/DesignManager');

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
      },
      {
        status: 'approved'
      }
    ];

    for (let i = 0; i < rawDesigns.length; i++) {
      let d = rawDesigns[i];
      let design = new Designs(d);
      yield design.save();
    }

    let req = {
      query: {
        page: 0,
        limit: 10
      }
    };

    let res = {
      status: function() {
        return this;
      },
      json: function(r) {
        expect(r.data.length).to.be.equal(2);
      }
    };

    yield DesignController.getAllApprovedDesigns(req, res, function() {});
  });

  it('should pagination correctly', function* () {
    var fakeReq = {
      page: 0,
      limit: 1
    };
    var data = yield DesignManager.getAllApprovedDesigns(fakeReq, {});
    expect(data.pageCount).to.be.equal(4);
  });

});

after(function() {
  mockgoose.reset('Designs');
});
