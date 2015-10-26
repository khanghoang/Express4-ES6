describe('Design Model', function() {
  it('should have correct type', function* () {

    let description = 'this is description';
    let email = 'khanghoang@gmail.com';

    let design = new Designs({
      status: 'approved',
      description: description,
      email: email
    });
    try {
      yield design.save();
    } catch (e) {
      expect(e).to.be.null;
    }

    expect(design.description).to.be.equal(description);
    expect(design.email).to.be.equal(email);

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
