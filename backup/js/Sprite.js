function Sprite(image, cropX1, cropY1, cropX2, cropY2, cropX3, cropY3, cropX4, cropY4) {
  var canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  cropX1 *= 32;
  cropY1 *= 32;
  if(typeof cropX2 != "undefined") {
    cropX2 *= 32;
    cropY2 *= 32;
    cropX3 *= 32;
    cropY3 *= 32;
    cropX4 *= 32;
    cropY4 *= 32;
  }
  var ctx = canvas.getContext("2d");
  //Check if sprite is nothing
  if(typeof image == "undefined") {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,32,32);
  } else {
    ctx.drawImage(image, cropX1, cropY1, 16, 16, 0, 0, 16, 16); //Top left

    //Check if other crops are set if not just do standard crop
    if(typeof cropX2 == "undefined") {
      ctx.drawImage(image, cropX1 + 16, cropY1, 16, 16, 16, 0, 16, 16); //Top right
      ctx.drawImage(image, cropX1, cropY1 + 16, 16, 16, 0, 16, 16, 16); //Bottom left
      ctx.drawImage(image, cropX1 + 16, cropY1 + 16, 16, 16, 16, 16, 16, 16); //Bottom Right
    } else {
      ctx.drawImage(image, cropX2, cropY2, 16, 16, 16, 0, 16, 16);//Top right
      ctx.drawImage(image, cropX3, cropY3, 16, 16, 0, 16, 16, 16);//Bottom left
      ctx.drawImage(image, cropX4, cropY4, 16, 16, 16, 16, 16, 16);//Bottom Right
    }
  }
  return canvas;
};
