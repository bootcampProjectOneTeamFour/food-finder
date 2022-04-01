var userFormEl = document.querySelector("#searchForm");
var searchInputEl = document.querySelector("#search");
var restaurantContainerEl = document.querySelector("#container");

// user inputs postal code
var formSubmitHandler = function (event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  var postalCode = searchInputEl.value.trim();

  if (postalCode) {
    convertPostalCode(postalCode);

    // clear old content
    searchInputEl.value = "";
  } else {
    console.log("error with formSubmitHandler");
  }
};

// convert postal code to lat/lon
var convertPostalCode = function () {
  // format the open api url
  var coordinatesUrl =
    "https://api.openrouteservice.org/geocode/search/structured?api_key=5b3ce3597851110001cf624829baf84f92b4448ca3755e68e692125f&postalcode=" +
    searchInputEl.value.split(" ").join("").trim();

  // make a get request to url
  fetch(coordinatesUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      getLatLon();
    })
    .catch(function (error) {
      console.log("error with convertPostalCode");
    });
};

// get latitude and longitude from
var getLatLon = function () {};

// get Restaurants with radius around lat/lon
var getRestaurants = function () {};

// display Restaurants into list items
var displayRestaurants = function () {};

// add event listeners to forms
userFormEl.addEventListener("submit", formSubmitHandler);
