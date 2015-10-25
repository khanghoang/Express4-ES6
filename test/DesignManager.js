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

});
