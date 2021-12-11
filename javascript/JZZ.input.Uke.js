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

  function _splitx(s, n) {
    if (!n) return s.length ? undefined : [];
    for (var i = 1; i <= s.length; i++) {
      var z = s.substr(0, i);
      if (typeof JZZ.MIDI.noteValue(z + '9') == 'undefined') break;
      var a = _splitx(s.substr(i), n - 1);
      if (a) return [z].concat(a);
    }
  }

  function _split(s) {
    if (!s) return;
    var a = s.split('-');
    if (a.length == 4) return a;
    a = s.split('');
    if (a.length < 4) return;
    if (a.length == 4) return a;
    return _splitx(s, 4);
  }

  function _strings(s) {
    var i, n;
    var r = [];
    s = _split(s);
    if (!s) return;
    for (i = 0; i < 4; i++) {
      n = JZZ.MIDI.noteValue(s[3 - i]);
      if (typeof n == 'undefined') {
        if (i) return; // undefined
        break;
      }
      r.push(n);
    }
    if (r.length) return r;
    for (i = 0; i < 4; i++) {
      n = JZZ.MIDI.noteValue(s[i] + '9');
      if (typeof n == 'undefined') return;
      r.push(n % 12);
    }
    for (i = 1; i < 4; i++) while (r[i] < r[i - 1]) r[i] += 12;
    if (s[0][0] == s[0][0].toLowerCase() && s[1][0] == s[1][0].toUpperCase()) r[0] += 12;
    while (r[1] < 56) for (i = 0; i < 4; i++) r[i] += 12;
    return r.reverse();
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
