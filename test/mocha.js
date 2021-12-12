const assert = require('assert');
const JZZ = require('jzz');
require('..')(JZZ);
const UKE = JZZ.input.Uke;

describe('tuning', function() {
  it('gCEA', function() {
    assert.deepEqual(UKE.strings('gCEA'), [69, 64, 60, 67]);
    assert.deepEqual(UKE.strings('67-60-64-69'), [69, 64, 60, 67]);
    assert.deepEqual(UKE.strings('G5-c5-e5-A5'), [69, 64, 60, 67]);
    assert.equal(UKE.tuning(UKE.strings('g-C-E-A')), 'g-C-E-A');
    assert.equal(UKE.tuningx(UKE.strings('g-C-E-A')), 'G5-C5-E5-A5');
  });
  it('GCEA', function() {
    assert.deepEqual(UKE.strings('GCEA'), [69, 64, 60, 55]);
    assert.equal(UKE.tuning(UKE.strings('G-C-E-A')), 'G-C-E-A');
    assert.equal(UKE.tuningx(UKE.strings('G-C-E-A')), 'G4-C5-E5-A5');
  });
  it('GCEG', function() {
    assert.deepEqual(UKE.strings('gCEg'), [67, 64, 60, 67]);
    assert.deepEqual(UKE.strings('GCEG'), [67, 64, 60, 55]);
  });
  it('GCEBb', function() {
    assert.deepEqual(UKE.strings('gCEB♭'), [70, 64, 60, 67]);
    assert.deepEqual(UKE.strings('gCEBb'), [70, 64, 60, 67]);
    assert.deepEqual(UKE.strings('GCEB♭'), [70, 64, 60, 55]);
    assert.deepEqual(UKE.strings('GCEBb'), [70, 64, 60, 55]);
  });
  it('aDF#B', function() {
    assert.deepEqual(UKE.strings('aDF♯B'), [71, 66, 62, 69]);
    assert.deepEqual(UKE.strings('aDF#B'), [71, 66, 62, 69]);
  });
  it('ADF#B', function() {
    assert.deepEqual(UKE.strings('ADF#B'), [71, 66, 62, 57]);
  });
  it('bEbe', function() {
    assert.deepEqual(UKE.strings('bEbe'), [76, 71, 64, 71]);
  });
  it('error', function() {
    assert.equal(UKE.strings(), undefined);
    assert.equal(UKE.strings('G-C'), undefined);
    assert.equal(UKE.strings('#####'), undefined);
  });
});
