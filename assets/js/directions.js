var iframeEl = document.querySelector("#iframeDirections");
var coordinates = sessionStorage.getItem("coordinatesEnd");
var coordinatesSplit = coordinates.split(",");
console.log(coordinatesSplit);

var coordinatesPrep = function () {
  var latStart = sessionStorage.getItem("latStart");
  var lonStart = sessionStorage.getItem("lonStart");
  var latEnd = coordinatesSplit[0].trim();
  var lonEnd = coordinatesSplit[1].trim();
  var iframeLink =
    "https://www.google.com/maps/embed/v1/directions?key=AIzaSyAqMCNMooQrQlJcK7bpd3pcMGD1bMmarF4&mode=walking&origin=" +
    latStart +
    "," +
    lonStart +
    "&destination=" +
    latEnd +
    "," +
    lonEnd;
  iframeEl.setAttribute("src", iframeLink);
};

coordinatesPrep();