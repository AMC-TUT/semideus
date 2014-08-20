/* Author:

 */

var isiPad = navigator.userAgent.match(/iPad/i) !== null;

Crafty.init(TULOS.canvas.width, TULOS.canvas.height).canvas.init();

Crafty.background("#3d7369");

Crafty.scene("Loading");

Crafty.viewport.bounds = {
  min: {
    x: 0,
    y: 0
  },
  max: {
    x: 1024,
    y: 748
  }
};

