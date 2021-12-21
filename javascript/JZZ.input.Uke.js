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

  var _version = '0.0.2';
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
        if (i) return;
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
    var z = 53;
    if (s[0][0] == s[0][0].toLowerCase() && s[1][0] == s[1][0].toUpperCase()) {
      r[0] += 12;
      z = 56;
    }
    else if (r[1] % 12 == 9 && r[2] % 12 == 2 && r[3] % 12 == 7) z = 33;
    while (r[1] < z) for (i = 0; i < 4; i++) r[i] += 12;
    return r.reverse();
  }

  var _note = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];

  function _tuningx(x) {
    var a = [];
    for (var i = 0; i < 4; i++) a.push(_note[x[3 - i] % 12] + Math.floor(x[3 - i] / 12));
    return a.join('-');
  }

  function _tuning(x) {
    var a = [];
    for (var i = 0; i < 4; i++) a.push(_note[x[3 - i] % 12]);
    if (x[3] > x[2]) a[0] = a[0].toLowerCase();
    a = a.join('-');
    if ('' + _strings(a) == '' + x) return a;
    return _tuningx(x);
  }

  function Uke(arg) {
    this.params = {};
    if (typeof arg == 'undefined') arg = {};
    for (var key in arg) this.params[key] = arg[key];
  }

  function _svg_line(x1, y1, x2, y2) {
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "black");
    line.setAttribute("vector-effect", "non-scaling-stroke");
    line.setAttribute("stroke-width", "1px");
    return line;
  }
  function _svg() {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("viewBox", "0 0 1 1");
    svg.appendChild(_svg_line(0, 0, 1, 1));
    svg.appendChild(_svg_line(0, 1, 1, 0));
    return svg;
  }
  Uke.prototype.create = function() {
    this.dom =_svg();

    this.at = this.params.at;
    if (typeof this.at == 'string') this.at = document.getElementById(this.at);
    try { this.at.appendChild(this.dom); }
    catch(e) {
      this.at = document.createElement('div');
      document.body.appendChild(this.at);
      this.at.appendChild(this.dom);
    }
  };

  Uke.prototype.svg = function() { return this.at.innerHTML; };

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
    port.svg = function() { return uke.svg(); };
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
  JZZ.input.Uke.tuningx = _tuningx;

});
