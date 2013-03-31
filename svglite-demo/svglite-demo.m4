/**

m4_undivert(`doc/top-summary.mkd')

**/

var $g = function(prop) {
    return ((function(){ return this; })())[prop];
};
var $c = $g('console');

m4_undivert(`util-class.js')
m4_undivert(`canvas-wrapper.js')
m4_undivert(`parser-base.js')
m4_undivert(`svg-lite.js')

m4_undivert(`main.js')
