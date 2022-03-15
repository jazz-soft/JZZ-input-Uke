# JZZ-input-Uke
SVG MIDI Ukulele

[![npm](https://img.shields.io/npm/v/jzz-input-uke.svg)](https://www.npmjs.com/package/jzz-input-uke)
[![npm](https://img.shields.io/npm/dt/jzz-input-uke.svg)](https://www.npmjs.com/package/jzz-input-uke)
[![build](https://github.com/jazz-soft/JZZ-input-Uke/actions/workflows/build.yml/badge.svg)](https://github.com/jazz-soft/JZZ-input-Uke/actions)
[![Coverage Status](https://coveralls.io/repos/github/jazz-soft/JZZ-input-Uke/badge.svg?branch=main)](https://coveralls.io/github/jazz-soft/JZZ-input-Uke?branch=main)

## Install
`npm install jzz-input-uke --save`  
or `yarn add jzz-input-uke`  
or get the full development version and minified scripts from [**GitHub**](https://github.com/jazz-soft/JZZ-input-Uke)

## Usage

##### Plain HTML
```html
<script src="JZZ.js"></script>
<script src="JZZ.input.Uke.js"></script>
//...
```

##### CDN (jsdelivr)
```html
<script src="https://cdn.jsdelivr.net/npm/jzz"></script>
<script src="https://cdn.jsdelivr.net/npm/jzz-input-uke"></script>
//...
```

##### CDN (unpkg)
```html
<script src="https://unpkg.com/jzz"></script>
<script src="https://unpkg.com/jzz-input-uke"></script>
//...
```

##### CommonJS
```js
var JZZ = require('jzz');
require('jzz-input-uke')(JZZ);
//...
```

## Example HTML
```html
<!DOCTYPE html>
<html lang=en>
<head>
<script src="https://cdn.jsdelivr.net/npm/jzz"></script>
<script src="https://cdn.jsdelivr.net/npm/jzz-synth-tiny"></script>
<script src="https://cdn.jsdelivr.net/npm/jzz-input-uke"></script>
</head>
<body>
<div id="uke_div"></div>
<script>
JZZ.synth.Tiny.register('Web Audio');
var out = JZZ().openMidiOut();
var uke = JZZ.input.Uke({ at: "uke_div" });
uke.viewbox(-3.1, -.15, 3.2, 1.35);
uke.transform(1, 3, -3, 1, 0, 0)
uke.connect(out);
</script>
</body>
</html>
```

## API
#### Construction
```js
var uke = JZZ.input.Uke(args);
// or
JZZ.input.Uke.register('My Cool Ukulele', args);
var uke = JZZ().openMidiIn('My Cool Ukulele');
```
where `args` is an object with th optional keys:
- `at`: DOM element to insert SVG, or its ID as string; default: the bottom of the page;
- `frets`: number of frets; default: `18`;
- `strings`: tuning; default: `gCEA`;
- `channels`: MIDI channels for each string; default: `[0, 1, 2, 3]`