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

  var _version = '0.1.0';
  function _name(name, deflt) { return name ? name : deflt; }

  var i;
  var _wtop = 0.04;
  var _wbtm = 0.06;
  var _str = [0.03, 0.01, -0.01, -0.03];
  var _frets = [];
  for (i = 0; i < 25; i++) _frets.push(1 - Math.pow(2, -i / 12));
  function _f2y(f) { return (_frets[f] + (f ? _frets[f - 1] : _frets[11] - _frets[12])) / 2; }
  function _s2x(s, y) { return _str[s] * (1 + y * (_wbtm / _wtop - 1)); }
  function _y2f(y) {
    if (y < _frets[11] - _frets[12]) return -1;
    for (var i = 0; i < 25; i++) if (y <= _frets[i]) return i;
    return -1;
  }
  function _x2s(x, y) {
    var w = _wtop * (1 - y) + _wbtm * y;
    if (x > w) return -1;
    if (x > w * 0.5) return 0;
    if (x > 0) return 1;
    if (x > -w * 0.5) return 2;
    if (x >= -w) return 3;
    return -1;
  }
  function _x2n(x, y) { // between the strings
    var w = (_wtop * (1 - y) + _wbtm * y) * 0.25;
    if (x > w * 3) return 0;
    if (x > w) return 1;
    if (x > -w) return 2;
    if (x > -w * 3) return 3;
    return 4;
  }

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
    this.params = { frets: 18, strings: _strings('gCEA'), channels:[0, 1, 2, 3], active: true };
    if (typeof arg == 'undefined') arg = {};
    for (var key in arg) this.params[key] = arg[key];
    if (this.params.frets != parseInt(this.params.frets) || this.params.frets < 1 || this.params.frets > 24) this.params.frets = 18;
    this._sx = [];
    this._active = !!this.params.active;
  }

  var _svgns = 'http://www.w3.org/2000/svg';
  function _svg_line(x1, y1, x2, y2) {
    var line = document.createElementNS(_svgns, 'line');
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
    var circle = document.createElementNS(_svgns, 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', 0.005);
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('vector-effect', 'non-scaling-stroke');
    circle.setAttribute('stroke-width', '1px');
    return circle;
  }
  function _svg_o(fill) {
    var circle = document.createElementNS(_svgns, 'circle');
    circle.setAttribute('cx', 100);
    circle.setAttribute('cy', 100);
    circle.setAttribute('r', 0.01);
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('fill', fill);
    circle.setAttribute('vector-effect', 'non-scaling-stroke');
    circle.setAttribute('stroke-width', '1px');
    return circle;
  }
  function _svg_x() {
    var g = document.createElementNS(_svgns, 'g');
    var sz = 0.008;
    g.appendChild(_svg_line(-sz, -sz, sz, sz));
    g.appendChild(_svg_line(-sz, sz, sz, -sz));
    g.setAttribute('transform', 'translate(100,100)');
    return g;
  }
  function _svg(self) {
    var ww = 0.25;
    var tt = 0.2;
    var bb = 0.2;
    var i, x, y;
    var frets = self.params.frets;
    var svg = document.createElementNS(_svgns, 'svg');
    svg.setAttribute('version', '1.1');
    svg.setAttribute('xmlns', _svgns);
    svg.setAttribute('viewBox', [-ww, -tt, 2 * ww, 1  + tt + bb].join(' '));
    var g = document.createElementNS(_svgns, 'g');
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
    if (frets > 11) { g.appendChild(_svg_dot(-0.025, (_frets[11] + _frets[12]) / 2)); g.appendChild(_svg_dot(0.025, (_frets[11] + _frets[12]) / 2)); }
    if (frets > 14) g.appendChild(_svg_dot(0, (_frets[14] + _frets[15]) / 2));

    for (i = 0; i < _str.length; i++) g.appendChild(_svg_line(_str[i], 0, _str[i] * _wbtm / _wtop, 1));
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
      if (uke._active && _lftBtnDn(e)) {
        pt.x = e.clientX;
        pt.y = e.clientY;
        var pp =  pt.matrixTransform(uke._svgg.getScreenCTM().inverse());
        var s;
        var f = _y2f(pp.y);
        if (f >=0 && f <= uke.params.frets) {
          s = _x2s(pp.x, pp.y);
          if (s >= 0 && s <= 3) {
            if (uke._sticky) {
              if (!f && uke._chord && uke._chord[s] == 0) {
                uke.finger(s);
                uke.onChord();
                return;
              }
              uke.finger(s, f);
              uke.onChord();
            }
            uke._ps = s;
            uke._pn = f + uke.params.strings[s];
            uke.forward(JZZ.MIDI.noteOn(uke.params.channels[s], uke._pn));
          }
        }
        else if (pp.y > 0 && pp.y < 1) {
          s = _x2s(pp.x, pp.y);
          if (s >= 0 && s <= 3) {
            uke._ps = s;
            f = uke._chord ? uke._chord[s] || 0 : 0;
            uke._pn = f + uke.params.strings[s];
            uke.forward(JZZ.MIDI.noteOn(uke.params.channels[s], uke._pn));
          }
          uke._nn = _x2n(pp.x, pp.y);
        }
      }
      _firefoxBug = e.buttons;
    };
  }
  var _xxx = 0;
  function _stop(uke, s, n) {
    var x = _xxx;
    uke._sx[s] = x;
    _xxx++;
    return function() {
      if (x == uke._sx[s]) uke.forward(JZZ.MIDI.noteOff(uke.params.channels[s], n));
    };
  }
  function _handleMouseMove(uke, pt) {
    return function(e) {
      if (uke._active && _lftBtnDn(e)) {
        pt.x = e.clientX;
        pt.y = e.clientY;
        var pp =  pt.matrixTransform(uke._svgg.getScreenCTM().inverse());
        if (typeof uke._nn != 'undefined') {
          var n = _x2n(pp.x, pp.y);
          if (n != uke._nn) {
            var a, b, f, s, m;
            if (n < uke._nn) { a = n; b = uke._nn; }
            if (n > uke._nn) { a = uke._nn; b = n; }
            for (s = a; s < b; s++) {
              if (s != uke._ps) {
                f = uke._chord ? uke._chord[s] : 0;
                if (typeof f != 'undefined') {
                  m = f + uke.params.strings[s];
                  uke.forward(JZZ.MIDI.noteOn(uke.params.channels[s], m));
                  setTimeout(_stop(uke, s, m), 200);
                }
              }
            }
            if (typeof uke._ps != 'undefined') {
              setTimeout(_stop(uke, uke._ps, uke._pn), 200);
              uke._ps = undefined;
              uke._pn = undefined;
            }
            uke._nn = n;
          }
        }
      }
      _firefoxBug = e.buttons;
    };
  }
  function _handleMouseUp(uke) {
    return function(e) {
      e = _fixBtnUp(e);
      if (uke._active && _lftBtnUp(e)) {
        if (typeof uke._ps != 'undefined') {
          uke.forward(JZZ.MIDI.noteOff(uke.params.channels[uke._ps], uke._pn));
          uke._ps = undefined;
          uke._pn = undefined;
        }
        uke._nn = undefined;
      }
      _firefoxBug = e.buttons;
    };
  }
  Uke.prototype.create = function() {
    var i;
    var svg = _svg(this);
    var pt = svg[0].createSVGPoint();
    var xx = [];
    var oo = [];
    var ff = [];
    var pp = [];
    this._svg = svg[0];
    this._svgg = svg[1];
    this._xx = xx;
    this._oo = oo;
    this._ff = ff;
    this._pp = pp;
    this._playing = [];
    for (i = 0; i < 4; i++) {
      xx[i] = _svg_x();
      this._svgg.appendChild(xx[i]);
    }
    for (i = 0; i < 4; i++) {
      oo[i] = _svg_o('none');
      this._svgg.appendChild(oo[i]);
    }
    for (i = 0; i < 4; i++) {
      ff[i] = _svg_o('black');
      this._svgg.appendChild(ff[i]);
    }
    for (i = 0; i < 4; i++) {
      pp[i] = _svg_o('silver');
      this._svgg.appendChild(pp[i]);
    }
    this.watchButtons = _watchMouseButtons();
    this.mouseUpHandle = _handleMouseUp(this);
    this.mouseDownHandle = _handleMouseDown(this, pt);
    this.mouseMoveHandle = _handleMouseMove(this, pt);
    this._svg.addEventListener('mousedown', this.mouseDownHandle);
    this._svg.addEventListener('mousemove', this.mouseMoveHandle);
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

  Uke.prototype._on = function(s, n) {
    var f = n - this.params.strings[s];
    this._off(s);
    if (f >= 0 && f <= this.params.frets) {
      var y = _f2y(f);
      var x = _s2x(s, y);
      this._pp[s].setAttribute('cx', x);
      this._pp[s].setAttribute('cy', y);
    }
  };

  Uke.prototype._off = function(s) {
    this._sx[s] = undefined;
    this._pp[s].setAttribute('cx', 100);
    this._pp[s].setAttribute('cy', 100);
  };

  Uke.prototype.forward = function(msg) {
    var i, s;
    var n = msg[1];
    var ch = msg.getChannel();
    for (i = 0; i < 4; i++) if (ch == this.params.channels[i]) s = i;
    if (s >= 0 && s <= 3) {
      if (msg.isNoteOn()) this._on(s, n);
      else if (msg.isNoteOff()) this._off(s);
    }
    this.emit(msg);
  };

  function draw_chord(uke) {
    for (var s = 0; s < 4; s++) {
      if (uke._chord) {
        var f = uke._chord[s] || 0;
        var y = _f2y(f);
        var x = _s2x(s, y);
        if (f) {
          uke._xx[s].setAttribute('transform', 'translate(100,100)');
          uke._oo[s].setAttribute('cx', 100);
          uke._oo[s].setAttribute('cy', 100);
          uke._ff[s].setAttribute('cx', x);
          uke._ff[s].setAttribute('cy', y);
        }
        else {
          if (typeof uke._chord[s] == 'undefined') {
            uke._xx[s].setAttribute('transform', 'translate(' + x + ',' + y +')');
            uke._oo[s].setAttribute('cx', 100);
            uke._oo[s].setAttribute('cy', 100);
          }
          else {
            uke._xx[s].setAttribute('transform', 'translate(100,100)');
            uke._oo[s].setAttribute('cx', x);
            uke._oo[s].setAttribute('cy', y);
          }
          uke._ff[s].setAttribute('cx', 100);
          uke._ff[s].setAttribute('cy', 100);
        }
      }
      else {
        uke._xx[s].setAttribute('transform', 'translate(100,100)');
        uke._oo[s].setAttribute('cx', 100);
        uke._oo[s].setAttribute('cy', 100);
        uke._ff[s].setAttribute('cx', 100);
        uke._ff[s].setAttribute('cy', 100);
      }
    }
  }

  Uke.prototype.chord = function(x) {
    if (typeof x == 'undefined') {
      return this._chord ? this._chord.slice() : undefined;
    }
    if (!x) {
      this._chord = undefined;
      draw_chord(this);
      return;
    }
    try {
      var c = [];
      for (var i = 0; i < 4; i++) {
        var f = parseInt(x[i]);
        if (f == x[i] && f >= 0 && f <= this.params.frets) c[i] = f;
      }
      this._chord = c;
      draw_chord(this);
    } catch (e) {/**/}
  };
  Uke.prototype.finger = function(s, n) {
    if (s >= 0 && s <= 4) {
      if (!this._chord) this._chord = [0, 0, 0, 0];
      var f = parseInt(n);
      if (f == n && f >= 0 && f <= this.params.frets) this._chord[s] = f;
      else this._chord[s] = undefined;
      draw_chord(this);
    }
  };
  Uke.prototype.sticky = function(b) {
    if (typeof b == 'undefined') b = true;
    this._sticky = !!b;
  };
  Uke.prototype.enable = function() { this._active = true; };
  Uke.prototype.disable = function() { this._active = false; };

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
    uke.onChord = function(){ port.onChord(); };
    uke.create();
    port._info = this._info(name);
    port._receive = function(msg) { uke.forward(msg); };
    port._close = function() { uke.destroy(); };
    port.svg = function() { return uke.svg(); };
    port.viewbox = function(a, b, c, d) { return uke.viewbox(a, b, c, d); };
    port.transform = function(a, b, c, d, e, f) { return uke.transform(a, b, c, d, e, f); };
    port.chord = function(a) { return uke.chord(a); };
    port.finger = function(a, b) { uke.finger(a, b); };
    port.sticky = function(b) { uke.sticky(b); };
    port.enable = function() { uke.enable(); };
    port.disable = function() { uke.disable(); };
    port.onChord = function() {};
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
