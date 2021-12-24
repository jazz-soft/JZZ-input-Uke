!function(t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t:"function"==typeof define&&define.amd?define("JZZ.input.Uke",["JZZ"],t):t(JZZ)}(function(u){var e,i;function o(t){if(t){var n=t.split("-");return 4==n.length?n:(n=t.split("")).length<4?void 0:4==n.length?n:function t(n,e){if(!e)return n.length?void 0:[];for(var i=1;i<=n.length;i++){var r=n.substr(0,i);if(void 0===u.MIDI.noteValue(r+"9"))break;var o=t(n.substr(i),e-1);if(o)return[r].concat(o)}}(t,4)}}function r(t){var n,e,i=[];if(t=o(t)){for(n=0;n<4;n++){if(void 0===(e=u.MIDI.noteValue(t[3-n]))){if(n)return;break}i.push(e)}if(i.length)return i;for(n=0;n<4;n++){if(void 0===(e=u.MIDI.noteValue(t[n]+"9")))return;i.push(e%12)}for(n=1;n<4;n++)for(;i[n]<i[n-1];)i[n]+=12;var r=53;for(t[0][0]==t[0][0].toLowerCase()&&t[1][0]==t[1][0].toUpperCase()?(i[0]+=12,r=56):i[1]%12==9&&i[2]%12==2&&i[3]%12==7&&(r=33);i[1]<r;)for(n=0;n<4;n++)i[n]+=12;return i.reverse()}}function a(t){for(var n=[],e=0;e<4;e++)n.push(i[t[3-e]%12]+Math.floor(t[3-e]/12));return n.join("-")}function f(t){for(var n in this.params={},t=void 0===t?{}:t)this.params[n]=t[n]}function s(){}u&&(u.input||(u.input={}),e="0.0.2",i=["C","C♯","D","E♭","E","F","F♯","G","A♭","A","B♭","B"],f.prototype.create=function(){this.dom=document.createElement("div"),this.dom.innerHTML="This is an Uke!",this.at=this.params.at,"string"==typeof this.at&&(this.at=document.getElementById(this.at));try{this.at.appendChild(this.dom)}catch(t){this.at=document.createElement("div"),this.at.appendChild(this.dom)}},f.prototype.destroy=function(){this.at.removeChild(this.dom)},s.prototype._info=function(t){return{type:"html/javascript",name:(n="Uke",t||n),manufacturer:"virtual",version:e};var n},s.prototype._openIn=function(n,t){var e=new f(this._arg);e.send=function(){n.send.apply(n,arguments)},e.emit=function(t){n._emit(t)},e.connect=function(){n.connect.apply(n,arguments)},e.create(),n._info=this._info(t),n._close=function(){e.destroy()},n._resume()},u.input.Uke=function(){var t,n;1==arguments.length?"string"==typeof arguments[0]?t=arguments[0]:n=arguments[0]:(t=arguments[0],n=arguments[1]);var e=new s;return e._arg=n,u.lib.openMidiIn(t,e)},u.input.Uke.version=function(){return e},u.input.Uke.register=function(){var t,n;1==arguments.length?"string"==typeof arguments[0]?t=arguments[0]:n=arguments[0]:(t=arguments[0],n=arguments[1]);var e=new s;return e._arg=n,u.lib.registerMidiIn(t,e)},u.input.Uke.strings=r,u.input.Uke.tuning=function(t){for(var n=[],e=0;e<4;e++)n.push(i[t[3-e]%12]);return t[3]>t[2]&&(n[0]=n[0].toLowerCase()),""+r(n=n.join("-"))==""+t?n:a(t)},u.input.Uke.tuningx=a)});