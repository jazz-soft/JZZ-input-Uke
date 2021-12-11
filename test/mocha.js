const assert = require('assert');
const JZZ = require('jzz');
require('..')(JZZ);
const UKE = JZZ.input.Uke;

describe('tuning', function() {
  it('gCEA', function() {
    assert.deepEqual(UKE.strings('gCEA'), [69, 64, 60, 67]);
    assert.deepEqual(UKE.strings('67-60-64-69'), [69, 64, 60, 67]);
    assert.deepEqual(UKE.strings('G5-c5-e5-A5'), [69, 64, 60, 67]);
  });
  it('aDF#B', function() {
    assert.deepEqual(UKE.strings('aDF♯B'), [71, 66, 62, 69]);
    assert.deepEqual(UKE.strings('aDF#B'), [71, 66, 62, 69]);
  });
  it('error', function() {
    assert.equal(UKE.strings(), undefined);
    assert.equal(UKE.strings('#####'), undefined);
  });
});
