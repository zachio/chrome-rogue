function TileSheet(image, tilesize, cropX, cropY) {
  var canvas = document.createElement("canvas");
  canvas.width = tilesize * 16;
  canvas.height = tilesize;
  var ctx = canvas.getContext("2d");
  var left = {
    top: {x: cropX, y: cropY + 1},
    side: {x: cropX, y: cropY + 1.5},
    bottom: {x: cropX, y: cropY + 2.5}
  };
  var top = {
    left: {x: cropX + 0.5, y: cropY + 1},
    right: {x: cropX + 1, y: cropY + 1}
  };
  var right = {
    top: {x: cropX + 1.5, y: cropY + 1},
    side: {x: cropX + 1.5, y: cropY + 1.25},
    bottom: {x: cropX + 1.5, y: cropY + 2.5}
  };
  var bottom = {
    left: {x: cropX + 0.5, y: cropY + 2.5},
    right: {x: cropX + 1, y: cropY + 2.5}
  };
  var inside = {
    left: {x: cropX + 0.5 ,y: cropY + 1.5 },
    right: {x: cropX + 1 ,y: cropY + 1.5 },
    };
  var drawTile = function(crop1, crop2, crop3, crop4) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = tilesize;
    canvas.height = tilesize;
    ctx.drawImage(image,
      crop1.x * tilesize,
      crop1.y * tilesize,
      tilesize / 2, tilesize / 2,
      0, 0,
      tilesize / 2, tilesize / 2);
    ctx.drawImage(image,
      crop2.x * tilesize,
      crop2.y * tilesize,
      tilesize / 2, tilesize / 2,
      tilesize / 2, 0,
      tilesize / 2, tilesize / 2
    );
    ctx.drawImage(image,
      crop3.x * tilesize,
      crop3.y * tilesize,
      tilesize / 2, tilesize / 2,
      0, tilesize / 2,
      tilesize / 2, tilesize / 2
    );
    ctx.drawImage(image,
      crop4.x * tilesize,
      crop4.y * tilesize,
      tilesize / 2, tilesize / 2,
      tilesize / 2, tilesize / 2,
      tilesize / 2, tilesize / 2
    );
    return canvas;
  };
  var tile = null;
  for(var x = 0; x < 16; x++) {
    switch(x) {
      case 0:
        tile = drawTile(left.top, right.top, left.bottom, right.bottom);
        break;
      case 1:
        tile = drawTile(left.side, right.side, left.bottom, right.bottom);
        break;
      case 2:
        tile = drawTile(left.top, top.left, left.bottom, bottom.right);
        break;
      case 3:
        tile = drawTile(left.side, inside.right, left.bottom, bottom.right);
        break;
      case 4:
        tile = drawTile(left.top, right.top, left.side, right.side);
        break;
      case 5:
        tile = drawTile(left.side, right.side, left.side, right.side);
        break;
      case 6:
        tile = drawTile(left.top, top.left, left.side, inside.right);
        break;
      case 7:
        tile = drawTile(left.side, {x: left.side.x + 0.5,y: left.side.y}, {x: left.side.x, y: left.side.y + 0.5}, {x: left.side.x + 0.5, y: left.side.y + 0.5});
        break;
      case 8:
        tile = drawTile(top.left, right.top, bottom.left, right.bottom);
        break;
      case 9:
        tile = drawTile(inside.left, right.side, bottom.right, right.bottom);
        break;
      case 10:
        tile = drawTile(top.left, top.right, bottom.left, bottom.right);
        break;
      case 11:
        tile = drawTile(inside.left, inside.right, bottom.left, bottom.right);
        break;
      case 12:
        tile = drawTile(top.left, right.top, inside.left, right.side);
        break;
      case 13:
        tile = drawTile(inside.left, right.side, {x: inside.left.x, y: inside.left.y + 0.5}, {x: right.side.x, y: right.side.y + 0.5});
        break;
      case 14:
        tile = drawTile(top.left, top.right, inside.left, inside.right);
        break;
      case 15:
        tile = drawTile(inside.left, inside.right, {x: inside.left.x, y: inside.left.y + 0.5}, {x: inside.right.x, y: inside.right.y + 0.5});
        break;
    }
    ctx.drawImage(tile, x * tilesize, 0);
    //ctx.fillStyle = "white";
    //ctx.fillText(x, x * tilesize + 13, 16);
  }
  document.body.appendChild(canvas);
  return canvas;
}
