// missing SVG function for JSDOM
const _svgns = 'http://www.w3.org/2000/svg';
var svg = document.createElementNS(_svgns, 'svg');
if (!svg || !svg.createSVGPoint) {
  document.__createElementNS = document.createElementNS;
  document.createElementNS = function(ns, name) {
    node = document.__createElementNS(ns, name);
    if (ns == _svgns && name == 'svg') {
      node.createSVGPoint = function() { return document.createElementNS(_svgns, 'point'); };
    }
    return node;
  };
}

