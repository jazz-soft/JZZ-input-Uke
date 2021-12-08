(function(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory;
  }
  else if (typeof define === 'function' && define.amd) {
    define('JZZ.input.Uke', ['JZZ'], factory);
  }
  else {
    factory(JZZ);
  }
})(this, function(JZZ) {

  if (!JZZ) return;
  if (!JZZ.input) JZZ.input = {};

  var _version = '0.0.0';
  function _name(name, deflt) { return name ? name : deflt; }

  function _strings() {
    return [JZZ.MIDI.midi('A5'), JZZ.MIDI.midi('E5'), JZZ.MIDI.midi('C5'), JZZ.MIDI.midi('G5')];
  }

  function _tuning() {
    return 'gCEA';
  }

  function Uke(arg) {
    this.params = {};
    if (typeof arg == 'undefined') arg = {};
    for (var key in arg) this.params[key] = arg[key];
  }

  Uke.prototype.create = function() {
    this.dom = document.createElement('div');
    this.dom.innerHTML = 'This is an Uke!';
    this.at = this.params.at;
    if (typeof this.at == 'string') this.at = document.getElementById(this.at);
    try { this.at.appendChild(this.dom); }
    catch(e) {
      this.at = document.createElement('div');
      this.at.appendChild(this.dom);
    }
  };

  Uke.prototype.destroy = function() {
    this.at.removeChild(this.dom);
  };

  function UkeEngine() {}

  UkeEngine.prototype._info = function(name) {
    return {
      type: 'html/javascript',
      name: _name(name, 'Uke'),
      manufacturer: 'virtual',
      version: _version
    };
  };

  UkeEngine.prototype._openIn = function(port, name) {
    var uke = new Uke(this._arg);
    uke.send = function() { port.send.apply(port, arguments); };
    uke.emit = function(msg) { port._emit(msg); };
    uke.connect = function() { port.connect.apply(port, arguments); };
    uke.create();
    port._info = this._info(name);
    port._close = function() { uke.destroy(); };
    port._resume();
  };

  JZZ.input.Uke = function() {
    var name, arg;
    if (arguments.length == 1) {
      if (typeof arguments[0] === 'string') name = arguments[0];
      else arg = arguments[0];
    }
    else { name = arguments[0]; arg = arguments[1];}
    var engine = new UkeEngine();
    engine._arg = arg;
    return JZZ.lib.openMidiIn(name, engine);
  };

  JZZ.input.Uke.version = function() { return _version; };

  JZZ.input.Uke.register = function() {
    var name, arg;
    if (arguments.length == 1) {
      if (typeof arguments[0] === 'string') name = arguments[0];
      else arg = arguments[0];
    }
    else { name = arguments[0]; arg = arguments[1];}
    var engine = new UkeEngine();
    engine._arg = arg;
    return JZZ.lib.registerMidiIn(name, engine);
  };

  JZZ.input.Uke.strings = _strings;
  JZZ.input.Uke.tuning = _tuning;

});
