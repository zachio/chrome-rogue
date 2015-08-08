game.misc = {
  toggle: function(bool) {
    if(bool) {
      return false;
    } else {
      return true;
    }
  }
}

game.misc.distance = function (x1,y1,x2,y2){
    var xd = x1-x2;
    var yd = y1-y2;
    
    return (xd + yd)
}
