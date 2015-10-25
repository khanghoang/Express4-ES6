describe('Design Model', function() {
  it('should have correct type', function* () {
    let design = new Designs({status: 'approved'});
    try {
      yield design.save();
    } catch (e) {
      expect(e).to.be.null;
    }

    yield design.remove();
  });

  it('should raise error when type is not valid', function* () {
    let design = new Designs({status: 'invalid-type'});
    try {
      yield design.save();
    } catch (err) {
      expect(err).to.not.be.null;
    }
  });
});
