!function(t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t:"function"==typeof define&&define.amd?define("JZZ.input.Uke",["JZZ"],t):t(JZZ)}(function(h){h.input||(h.input={});var n="0.1.5";for(var p=.04,d=.06,v=[.03,.01,-.01,-.03],_=[],t=0;t<25;t++)_.push(1-Math.pow(2,-t/12));function o(t){return(_[t]+(t?_[t-1]:_[11]-_[12]))/2}function s(t,e){return v[t]*(1+e*(d/p-1))}function a(t,e){e=p*(1-e)+d*e;return e<t?-1:.5*e<t?0:0<t?1:.5*-e<t?2:-e<=t?3:-1}function l(t,e){e=.25*(p*(1-e)+d*e);return 3*e<t?0:e<t?1:-e<t?2:3*-e<t?3:4}function u(t){var e;if(t)return e=t.split("-"),4==e.length?e:(e=t.split("")).length<4?void 0:4==e.length?e:function t(e,n){if(!n)return e.length?void 0:[];for(var i=1;i<=e.length;i++){var r=e.substr(0,i);if(void 0===h.MIDI.noteValue(r+"9"))break;var o=t(e.substr(i),n-1);if(o)return[r].concat(o)}}(t,4)}function i(t){var e,n,i=[];if(t=u(t)){for(e=0;e<4;e++){if(void 0===(n=h.MIDI.noteValue(t[3-e]))){if(e)return;break}i.push(n)}if(i.length)return i;for(e=0;e<4;e++){if(void 0===(n=h.MIDI.noteValue(t[e]+"9")))return;i.push(n%12)}for(e=1;e<4;e++)for(;i[e]<i[e-1];)i[e]+=12;var r=53;for(t[0][0]==t[0][0].toLowerCase()&&t[1][0]==t[1][0].toUpperCase()?(i[0]+=12,r=56):i[1]%12==9&&i[2]%12==2&&i[3]%12==7&&(r=33);i[1]<r;)for(e=0;e<4;e++)i[e]+=12;return i.reverse()}}var r=["C","C♯","D","E♭","E","F","F♯","G","A♭","A","B♭","B"];function f(t){for(var e=[],n=0;n<4;n++)e.push(r[t[3-n]%12]+Math.floor(t[3-n]/12));return e.join("-")}function c(t){for(var e in this.params={frets:18,strings:i("gCEA"),channels:[0,1,2,3],active:!0},t=void 0===t?{}:t)this.params[e]=t[e];(this.params.frets!=parseInt(this.params.frets)||this.params.frets<1||24<this.params.frets)&&(this.params.frets=18),this._sx=[],this._active=!!this.params.active}var m,b="http://www.w3.org/2000/svg";function g(t,e,n,i){var r=document.createElementNS(b,"line");return r.setAttribute("x1",t),r.setAttribute("y1",e),r.setAttribute("x2",n),r.setAttribute("y2",i),r.setAttribute("stroke","black"),r.setAttribute("vector-effect","non-scaling-stroke"),r.setAttribute("stroke-width","1px"),r}function y(t,e){var n=document.createElementNS(b,"circle");return n.setAttribute("cx",t),n.setAttribute("cy",e),n.setAttribute("r",.005),n.setAttribute("stroke","black"),n.setAttribute("fill","none"),n.setAttribute("vector-effect","non-scaling-stroke"),n.setAttribute("stroke-width","1px"),n}function A(t){var e=document.createElementNS(b,"circle");return e.setAttribute("cx",100),e.setAttribute("cy",100),e.setAttribute("r",.01),e.setAttribute("stroke","black"),e.setAttribute("fill",t),e.setAttribute("vector-effect","non-scaling-stroke"),e.setAttribute("stroke-width","1px"),e}function w(t){return void 0===t.buttons?!t.button:1&t.buttons}function x(r,o){return function(t){if(r._active&&w(t)){o.x=t.clientX,o.y=t.clientY;var e,n=o.matrixTransform(r._svgg.getScreenCTM().inverse()),i=function(t){if(t<_[11]-_[12])return-1;for(var e=0;e<25;e++)if(t<=_[e])return e;return-1}(n.y);if(0<=i&&i<=r.params.frets){if(0<=(e=a(n.x,n.y))&&e<=3){if(r._sticky){if(!i&&r._chord&&0==r._chord[e])return r.finger(e),void r.onChord();r.finger(e,i),r.onChord()}r._ps=e,r._pn=i+r.params.strings[e],r.forward(h.MIDI.noteOn(r.params.channels[e],r._pn))}}else 0<n.y&&n.y<1&&(0<=(e=a(n.x,n.y))&&e<=3&&(r._ps=e,i=r._chord&&r._chord[e]||0,r._pn=i+r.params.strings[e],r.forward(h.MIDI.noteOn(r.params.channels[e],r._pn))),r._nn=l(n.x,n.y))}m=t.buttons}}var C=0;function k(t,e,n){var i=C;return t._sx[e]=i,C++,function(){i==t._sx[e]&&t.forward(h.MIDI.noteOff(t.params.channels[e],n))}}function I(n){return function(t){var e;t=void 0===(e=t).buttons||e.buttons!=m?e:(e.stopPropagation(),0==e.button?{buttons:1^m}:1==e.button?{buttons:4^m}:2==e.button?{buttons:2^m}:void 0),n._active&&!(void 0===(e=t).buttons?e.button:1&e.buttons)&&(void 0!==n._ps&&(n.forward(h.MIDI.noteOff(n.params.channels[n._ps],n._pn)),n._ps=void 0,n._pn=void 0),n._nn=void 0),setTimeout(function(){m=t.buttons},0)}}function E(t){for(var e,n,i,r=0;r<4;r++)t._chord?(i=s(r,n=o(e=t._chord[r]||0)),e?(t._xx[r].setAttribute("transform","translate(100,100)"),t._oo[r].setAttribute("cx",100),t._oo[r].setAttribute("cy",100),t._ff[r].setAttribute("cx",i),t._ff[r].setAttribute("cy",n)):(void 0===t._chord[r]?(t._xx[r].setAttribute("transform","translate("+i+","+n+")"),t._oo[r].setAttribute("cx",100),t._oo[r].setAttribute("cy",100)):(t._xx[r].setAttribute("transform","translate(100,100)"),t._oo[r].setAttribute("cx",i),t._oo[r].setAttribute("cy",n)),t._ff[r].setAttribute("cx",100),t._ff[r].setAttribute("cy",100))):(t._xx[r].setAttribute("transform","translate(100,100)"),t._oo[r].setAttribute("cx",100),t._oo[r].setAttribute("cy",100),t._ff[r].setAttribute("cx",100),t._ff[r].setAttribute("cy",100))}function M(){}c.prototype.create=function(){var t,e,n,s,a,i=function(t){var e,n,i,r=t.params.frets,o=((t=document.createElementNS(b,"svg")).setAttribute("version","1.1"),t.setAttribute("xmlns",b),t.setAttribute("viewBox",[-.25,-.2,.5,1.4].join(" ")),document.createElementNS(b,"g"));for(t.appendChild(o),o.appendChild(g(-p,0,p,0)),o.appendChild(g(-d,1,d,1)),e=0;e<=r;e++)i=_[e],o.appendChild(g(-(n=p+(d-p)*i),i,n,i));for(o.appendChild(g(-p,0,-n,i)),o.appendChild(g(p,0,n,i)),4<r&&o.appendChild(y(0,(_[4]+_[5])/2)),6<r&&o.appendChild(y(0,(_[6]+_[7])/2)),9<r&&o.appendChild(y(0,(_[9]+_[10])/2)),11<r&&(o.appendChild(y(-.025,(_[11]+_[12])/2)),o.appendChild(y(.025,(_[11]+_[12])/2))),14<r&&o.appendChild(y(0,(_[14]+_[15])/2)),e=0;e<v.length;e++)o.appendChild(g(v[e],0,v[e]*d/p,1));return[t,o]}(this),r=i[0].createSVGPoint(),o=[],u=[],f=[],c=[];for(this._svg=i[0],this._svgg=i[1],this._xx=o,this._oo=u,this._ff=f,this._pp=c,this._playing=[],t=0;t<4;t++)o[t]=(n=e=void 0,e=document.createElementNS(b,"g"),n=.008,e.appendChild(g(-n,-n,n,n)),e.appendChild(g(-n,n,n,-n)),e.setAttribute("transform","translate(100,100)"),e),this._svgg.appendChild(o[t]);for(t=0;t<4;t++)u[t]=A("none"),this._svgg.appendChild(u[t]);for(t=0;t<4;t++)f[t]=A("black"),this._svgg.appendChild(f[t]);for(t=0;t<4;t++)c[t]=A("silver"),this._svgg.appendChild(c[t]);this.watchButtons=function(t){m=t.buttons},this.mouseUpHandle=I(this),this.mouseDownHandle=x(this,r),this.mouseMoveHandle=(s=this,a=r,function(t){if(s._active&&w(t)){a.x=t.clientX,a.y=t.clientY;var e=a.matrixTransform(s._svgg.getScreenCTM().inverse());if(void 0!==s._nn){var n,i,r,o,e=l(e.x,e.y);if(e!=s._nn){for(e<s._nn&&(n=e,i=s._nn),e>s._nn&&(n=s._nn,i=e),r=n;r<i;r++)r!=s._ps&&void 0!==(o=s._chord?s._chord[r]:0)&&(o=o+s.params.strings[r],s.forward(h.MIDI.noteOn(s.params.channels[r],o)),setTimeout(k(s,r,o),200));void 0!==s._ps&&(setTimeout(k(s,s._ps,s._pn),200),s._ps=void 0,s._pn=void 0),s._nn=e}}}m=t.buttons}),this._svg.addEventListener("mousedown",this.mouseDownHandle),this._svg.addEventListener("mousemove",this.mouseMoveHandle),window.addEventListener("mousedown",this.watchButtons),window.addEventListener("mousemove",this.watchButtons),window.addEventListener("mouseup",this.mouseUpHandle),this.at=this.params.at,"string"==typeof this.at&&(this.at=document.getElementById(this.at));try{this.at.appendChild(this._svg)}catch(t){this.at=document.createElement("div"),document.body.appendChild(this.at),this.at.appendChild(this._svg)}},c.prototype._on=function(t,e){var n,e=e-this.params.strings[t];this._off(t),0<=e&&e<=this.params.frets&&(n=s(t,e=o(e)),this._pp[t].setAttribute("cx",n),this._pp[t].setAttribute("cy",e))},c.prototype._off=function(t){this._sx[t]=void 0,this._pp[t].setAttribute("cx",100),this._pp[t].setAttribute("cy",100)},c.prototype.forward=function(t){for(var e,n=t[1],i=t.getChannel(),r=0;r<4;r++)i==this.params.channels[r]&&(e=r);0<=e&&e<=3&&(t.isNoteOn()?this._on(e,n):t.isNoteOff()&&this._off(e)),this.emit(t)},c.prototype.chord=function(t){if(void 0===t)return this._chord?this._chord.slice():void 0;if(!t)return this._chord=void 0,void E(this);try{for(var e=[],n=0;n<4;n++){var i=parseInt(t[n]);i==t[n]&&0<=i&&i<=this.params.frets&&(e[n]=i)}this._chord=e,E(this)}catch(t){}},c.prototype.finger=function(t,e){var n;0<=t&&t<=4&&(this._chord||(this._chord=[0,0,0,0]),(n=parseInt(e))==e&&0<=n&&n<=this.params.frets?this._chord[t]=n:this._chord[t]=void 0,E(this))},c.prototype.sticky=function(t){this._sticky=!!(t=void 0===t?!0:t)},c.prototype.enable=function(){this._active=!0},c.prototype.disable=function(){this._active=!1},c.prototype.svg=function(){return this.at.innerHTML},c.prototype.viewbox=function(t,e,n,i){this._svg.setAttribute("viewBox",[t,e,n,i].join(" "))},c.prototype.transform=function(t,e,n,i,r,o){this._svgg.setAttribute("transform","matrix("+[t,e,n,i,r,o].join(" ")+")")},c.prototype.destroy=function(){this.watchButtons&&(this._svg.removeEventListener("mousedown",this.mouseDownHandle),window.removeEventListener("mousedown",this.watchButtons),window.removeEventListener("mousemove",this.watchButtons),window.removeEventListener("mouseup",this.mouseUpHandle)),this.at.removeChild(this._svg)},M.prototype._info=function(t){return{type:"html/javascript",name:(e="Uke",t||e),manufacturer:"virtual",version:n};var e},M.prototype._openIn=function(e,t){var s=new c(this._arg);s.emit=function(t){e._emit(t)},s.onChord=function(){e.onChord()},s.create(),e._info=this._info(t),e._receive=function(t){s.forward(t)},e._close=function(){s.destroy()},e.svg=function(){return s.svg()},e.viewbox=function(t,e,n,i){return s.viewbox(t,e,n,i)},e.transform=function(t,e,n,i,r,o){return s.transform(t,e,n,i,r,o)},e.chord=function(t){return s.chord(t)},e.finger=function(t,e){s.finger(t,e)},e.sticky=function(t){s.sticky(t)},e.enable=function(){s.enable()},e.disable=function(){s.disable()},e.onChord=function(){},e._resume()},h.input.Uke=function(){1==arguments.length?"string"==typeof arguments[0]?t=arguments[0]:e=arguments[0]:(t=arguments[0],e=arguments[1]);var t,e,n=new M;return n._arg=e,h.lib.openMidiIn(t,n)},h.input.Uke.version=function(){return n},h.input.Uke.register=function(){1==arguments.length?"string"==typeof arguments[0]?t=arguments[0]:e=arguments[0]:(t=arguments[0],e=arguments[1]);var t,e,n=new M;return n._arg=e,h.lib.registerMidiIn(t,n)},h.input.Uke.strings=i,h.input.Uke.tuning=function(t){for(var e=[],n=0;n<4;n++)e.push(r[t[3-n]%12]);return t[3]>t[2]&&(e[0]=e[0].toLowerCase()),""+i(e=e.join("-"))==""+t?e:f(t)},h.input.Uke.tuningx=f});