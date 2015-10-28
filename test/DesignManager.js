describe('Design Manager', function() {

  it('should pagination correctly', function* () {
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

    var params = {
      page: 0,
      limit: 1
    };
    var data = yield DesignManager.getAllApprovedDesigns(params, {});
    expect(data.pageCount).to.be.equal(4);
    yield Designs.remove({});
  });

  it('able to approve design', function* () {
    let design = new Designs(
      {
        status: 'pending'
      }
    );

    yield design.save();

    var updatedDesign = yield DesignManager.approveDesign(design);
    expect(updatedDesign.status).to.be.equal('approved');
    yield Designs.remove({});
  });

  it('able to reject design', function* () {
    let design = new Designs(
      {
        status: 'pending'
      }
    );

    yield design.save();

    var updatedDesign = yield DesignManager.rejectDesign(design);
    expect(updatedDesign.status).to.be.equal('rejected');
    yield Designs.remove({});
  });

  it('able to get design by id', function* () {
    let design = new Designs(
      {
        status: 'pending'
      }
    );

    yield design.save();

    var id = design._id.toString();

    var updatedDesign = yield DesignManager.findOneDesignByID(id);
    expect(updatedDesign).to.be.ok;
    yield Designs.remove({});
  });

});
