function require(src) {
  var script = document.createElement("script");
  script.setAttribute("src", src);
  script.setAttribute("type", "text/javascript")
  document.head.appendChild(script);
}
