const assert = require('assert');
const JSDOM = require('jsdom').JSDOM;
const WMT =  require('web-midi-test');
const JZZ = require('jzz');
const version = require('../package.json').version;
require('..')(JZZ);

const UKE = JZZ.input.Uke;

var midi_out = new WMT.MidiDst('VIRTUAL MIDI-Out');
midi_out.connect();

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
  it('dGBE', function() {
    assert.deepEqual(UKE.strings('dGBE'), [76, 71, 67, 74]);
    assert.equal(UKE.tuning(UKE.strings('d-G-B-E')), 'd-G-B-E');
  });
  it('cFAD', function() {
    assert.deepEqual(UKE.strings('cFAD'), [74, 69, 65, 72]);
    assert.equal(UKE.tuning(UKE.strings('c-F-A-D')), 'c-F-A-D');
  });
  it('DGBE', function() {
    assert.deepEqual(UKE.strings('DGBE'), [64, 59, 55, 50]);
    assert.equal(UKE.tuning(UKE.strings('D-G-B-E')), 'D-G-B-E');
  });
  it('CGBE', function() {
    assert.deepEqual(UKE.strings('CGBE'), [64, 59, 55, 48]);
    assert.equal(UKE.tuning(UKE.strings('C-G-B-E')), 'C-G-B-E');
  });
  it('EADG', function() {
    assert.deepEqual(UKE.strings('EADG'), [43, 38, 33, 28]);
    assert.equal(UKE.tuning(UKE.strings('E-A-D-G')), 'E-A-D-G');
  });
  it('DADG', function() {
    assert.deepEqual(UKE.strings('DADG'), [43, 38, 33, 26]);
    assert.equal(UKE.tuning(UKE.strings('D-A-D-G')), 'D-A-D-G');
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

describe('register', function() {
  it('register', function() {
    JZZ.input.Uke.register();
    JZZ.input.Uke.register('uke');
  });
  it('version', function() {
    assert.equal(JZZ.input.Uke.version(), version);
  });
});

describe('in browser', function() {
  before(function() {
    return new Promise(function(resolve) {
      JSDOM.fromFile('test/demo.html', {
        resources: 'usable',
        runScripts: 'dangerously',
        beforeParse: function(window) {
          window.__coverage__ = global.__coverage__;
          window.navigator.requestMIDIAccess = WMT.requestMIDIAccess;
        }
      }).then(function(dom) {
        global.window = dom.window;
        setTimeout(resolve, 1500);
      });
    });
  });
  it('it works!', function() {
    assert.equal(0, 0);
  });
  after(function() {
    try {
      global.window.close();
    }
    catch(e) { console.log(e); }
  });
});
