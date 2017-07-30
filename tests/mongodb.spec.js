const should = require('should');
const mongoose = require('mongoose');

describe("MongoDB", function (){
  it("should be able to connect to db", function (done) {   
    mongoose.connect('mongodb://localhost:27017/worktest', function (err, db) {
      if (err) {
        should.exist(null);
        done();
      } else {
        should.exist(true);
        done();
      }
    });
  });
  it("should be able to create object", function (done) {
    const Cat = mongoose.model('Cat', { name: String });
    const kitty = new Cat({ name: 'Zildjian' });
    kitty.save(function (err) {
      if (err) {
        should.exist(null);
        done();
      } else {
        should.exist(true);
        done();
      }
    });
  })
});
