var iframeEl = document.querySelector("#iframeDirections");
var coordinates = sessionStorage.getItem("coordinatesEnd");
var coordinatesSplit = coordinates.split(",");
console.log(coordinatesSplit);

var coordinatesPrep = function () {
  var latStart = sessionStorage.getItem("latStart");
  var lonStart = sessionStorage.getItem("lonStart");
  var latEnd = coordinatesSplit[0].trim();
  var lonEnd = coordinatesSplit[1].trim();
  //   console.log(latStart);
  //   console.log(lonStart);
  //   console.log(latEnd);
  //   console.log(lonEnd);
  getDirections(latStart, latEnd, lonStart, lonEnd);
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

var getDirections = function (latStart, latEnd, lonStart, lonEnd) {
  var apiUrl =
    "https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248da3361049f304c83b34cb7e9d07c6238&start=8.681495,49.41461&end=8.687872,49.420318";
  // "https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248da3361049f304c83b34cb7e9d07c6238&start=" +
  // latStart +
  // "," +
  // lonStart +
  // "&end=" +
  // latEnd +
  // "," +
  // lonEnd;
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          // call function to update iFrame here
          console.log(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Openroute Service");
    });
};

coordinatesPrep();
