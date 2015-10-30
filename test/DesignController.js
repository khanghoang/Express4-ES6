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
    yield Designs.remove({});
  });

  it('able to get design by id', function* () {
    let design = new Designs(
      {
        status: 'pending'
      }
    );

    yield design.save();
    let id = design._id;

    let res = {
      status: function() {
        return this;
      },
      json: function(d) {
        expect(d._id).to.be.not.null;
      }
    };

    let req = {
      params: {
        id: id
      }
    };

    let next = function() {};


    yield DesignController.getDesignByID(req, res, next);
    yield Designs.remove({});
  });
});
