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

  var i;
  var _wtop = .04;
  var _wbtm = .06;
  var _frets = [];
  for (i = 0; i < 25; i++) _frets.push(1 - Math.pow(2, -i / 12));

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
    this.params = { frets: 18 };
    if (typeof arg == 'undefined') arg = {};
    for (var key in arg) this.params[key] = arg[key];
    if (this.params.frets != parseInt(this.params.frets) || this.params.frets < 1 || this.params.frets > 24) this.params.frets = 18;
  }

  function _svg_line(x1, y1, x2, y2) {
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', 'black');
    line.setAttribute('vector-effect', 'non-scaling-stroke');
    line.setAttribute('stroke-width', '1px');
    return line;
  }
  function _svg_dot(x, y) {
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', .005);
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('vector-effect', 'non-scaling-stroke');
    circle.setAttribute('stroke-width', '1px');
    return circle;
  }
  function _svg_finger() {
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', 100);
    circle.setAttribute('cy', 100);
    circle.setAttribute('r', .01);
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('vector-effect', 'non-scaling-stroke');
    circle.setAttribute('stroke-width', '1px');
    return circle;
  }
  function _svg(self) {
    var ww = .25;
    var tt = .2;
    var bb = .2;
    var strings = [.03, .01, -.01, -.03];
    var i, x, y;
    var frets = self.params.frets;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('version', '1.1');
    svg.setAttribute('viewBox', [-ww, -tt, 2 * ww, 1  + tt + bb].join(' '));
    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(g);
    g.appendChild(_svg_line(-_wtop, 0, _wtop, 0));
    g.appendChild(_svg_line(-_wbtm, 1, _wbtm, 1));
    for (i = 0; i <= frets; i++) {
      y = _frets[i];
      x = _wtop + (_wbtm - _wtop) * y;
      g.appendChild(_svg_line(-x, y, x, y));
    }
    g.appendChild(_svg_line(-_wtop, 0, -x, y));
    g.appendChild(_svg_line(_wtop, 0, x, y));
    if (frets > 4) g.appendChild(_svg_dot(0, (_frets[4] + _frets[5]) / 2));
    if (frets > 6) g.appendChild(_svg_dot(0, (_frets[6] + _frets[7]) / 2));
    if (frets > 9) g.appendChild(_svg_dot(0, (_frets[9] + _frets[10]) / 2));
    if (frets > 11) { g.appendChild(_svg_dot(-.025, (_frets[11] + _frets[12]) / 2)); g.appendChild(_svg_dot(.025, (_frets[11] + _frets[12]) / 2)); }
    if (frets > 14) g.appendChild(_svg_dot(0, (_frets[14] + _frets[15]) / 2));

    for (i = 0; i < strings.length; i++) g.appendChild(_svg_line(strings[i], 0, strings[i] * _wbtm / _wtop, 1));
    return [svg, g];
  }

  var _firefoxBug;
  function _fixBtnUp(e) {
    if (typeof e.buttons == 'undefined' || e.buttons != _firefoxBug) return e;
    e.stopPropagation();
    if (e.button == 0) return {buttons:_firefoxBug^1};
    if (e.button == 1) return {buttons:_firefoxBug^4};
    if (e.button == 2) return {buttons:_firefoxBug^2};
  }
  function _lftBtnDn(e) { return typeof e.buttons == 'undefined' ? !e.button : e.buttons & 1; }
  function _lftBtnUp(e) { return typeof e.buttons == 'undefined' ? !e.button : !(e.buttons & 1); }
  function _watchMouseButtons() {
    return function(e) {
      _firefoxBug = e.buttons;
    };
  }
  function _handleMouseDown(uke, pt) {
    return function(e) {
      if (_lftBtnDn(e)) {
        pt.x = e.clientX;
        pt.y = e.clientY;
        var pp =  pt.matrixTransform(uke._svgg.getScreenCTM().inverse());
console.log('mouse down', pp.x, pp.y);
uke._finger[0].setAttribute('cx', pp.x);
uke._finger[0].setAttribute('cy', pp.y);
      }
      _firefoxBug = e.buttons;
    };
  }
  function _handleMouseUp(uke, pt) {
    return function(e) {
      e = _fixBtnUp(e);
      if (_lftBtnUp(e)) {
        pt.x = e.clientX;
        pt.y = e.clientY;
        var pp =  pt.matrixTransform(uke._svgg.getScreenCTM().inverse());
      }
      _firefoxBug = e.buttons;
    };
  }
  Uke.prototype.create = function() {
    var svg = _svg(this);
    var pt = svg[0].createSVGPoint();
    var ff = [];
    this._svg = svg[0];
    this._svgg = svg[1];
    this._finger = ff;
    for (var i = 0; i < 4; i++) {
      ff[i] = _svg_finger(0, 0);
      this._svgg.appendChild(ff[i]);
    }
    this.watchButtons = _watchMouseButtons();
    this.mouseUpHandle = _handleMouseUp(this, pt);
    this.mouseDownHandle = _handleMouseDown(this, pt);
    this._svg.addEventListener('mousedown', this.mouseDownHandle);
    window.addEventListener('mousedown', this.watchButtons);
    window.addEventListener('mousemove', this.watchButtons);
    window.addEventListener('mouseup', this.mouseUpHandle);

    this.at = this.params.at;
    if (typeof this.at == 'string') this.at = document.getElementById(this.at);
    try { this.at.appendChild(this._svg); }
    catch(e) {
      this.at = document.createElement('div');
      document.body.appendChild(this.at);
      this.at.appendChild(this._svg);
    }
  };

  Uke.prototype.svg = function() { return this.at.innerHTML; };
  Uke.prototype.viewbox = function(a, b, c, d) {
    this._svg.setAttribute('viewBox', [a, b, c, d].join(' '));
  };
  Uke.prototype.transform = function(a, b, c, d, e, f) {
    this._svgg.setAttribute('transform', 'matrix(' + [a, b, c, d, e, f].join(' ') + ')');
  };

  Uke.prototype.destroy = function() {
    if (this.watchButtons) {
      this._svg.removeEventListener('mousedown', this.mouseDownHandle);
      window.removeEventListener('mousedown', this.watchButtons);
      window.removeEventListener('mousemove', this.watchButtons);
      window.removeEventListener('mouseup', this.mouseUpHandle);
    }
    this.at.removeChild(this._svg);
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
    port.viewbox = function(a, b, c, d) { return uke.viewbox(a, b, c, d); };
    port.transform = function(a, b, c, d, e, f) { return uke.transform(a, b, c, d, e, f); };
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
