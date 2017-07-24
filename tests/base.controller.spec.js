var should = require('should');
var BaseController = require("../controllers/Base");

describe('Base controller', function () {
  it('should have a method extend which returns a child instance', function (next) {
    should.exist(BaseController.extend);
    const childName = "child controller";
    var child = BaseController.extend({ name: childName });

    should.exist(child);
    should.exist(child.name);
    should.exist(child.extend);
    should.exist(child.run);

    child.should.have.property('name', childName);

    next();
  });
});

