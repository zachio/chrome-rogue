function MessageBox(ctx, x, y, width, textArray) {
  var box = {
    x: x,
    y: y,
    width: width,
    height: textArray.length * 20 + 20,
  };
  ctx.fillStyle = "rgba(0,0,0,0.8)";
  ctx.fillRect(x, y, box.width, box.height);
  ctx.fillStyle = "white";
  for(var i = 0; i < textArray.length; i++) {
    ctx.fillText(textArray[i], x + 20, (y + 20 * i) + 20);
  }
};
