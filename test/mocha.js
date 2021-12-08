const assert = require('assert');
const JZZ = require('jzz');
require('..')(JZZ);
const UKE = JZZ.input.Uke;

describe('tuning', function() {
  it('gCEA', function() {
    assert.deepEqual(UKE.strings(), [69, 64, 60, 67]);
  });
});
