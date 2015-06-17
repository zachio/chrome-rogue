function require(src, callback) {
  var start = Date.now();
  for(var i = 0; i < src.length; i++){
    var script = document.createElement("script");
    script.setAttribute("src", src[i]);
    script.setAttribute("type", "text/javascript")
    document.body.appendChild(script);
  }
  window.onload = callback
}
