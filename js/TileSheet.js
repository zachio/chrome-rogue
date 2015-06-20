function TileSheet(sprites) {
  var canvas = document.createElement("canvas");
  canvas.width = 32 * 16;
  canvas.height = 32;
  var ctx = canvas.getContext("2d");
  for(var x = 0; x < sprites.length; x++) {
    ctx.drawImage(sprites[x], x * 32, 0);
    ctx.fillText(x, 32 * x + 13, 16);
  }
  //document.body.appendChild(canvas);
  return canvas;
}
