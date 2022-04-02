var userFormEl = document.querySelector("#user-form");
var searchInputEl = document.querySelector("#postal-code");
var restaurantContainerEl = document.querySelector("#food-list");

// user inputs postal code
var formSubmitHandler = function (event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  var postalCode = searchInputEl.value.trim();

  if (postalCode) {
    getLatLon(postalCode);

    // clear old content
    searchInputEl.value = "";
  } else {
    console.log("error with formSubmitHandler");
  }
};

// convert postal code to lat/lon
var getLatLon = function () {
  // format the open api url
  var coordinatesUrl =
    "https://api.openrouteservice.org/geocode/search/structured?api_key=5b3ce3597851110001cf624829baf84f92b4448ca3755e68e692125f&postalcode=" +
    searchInputEl.value.split(" ").join("").trim();

  // make a get request to url
  fetch(coordinatesUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          getRestaurants(data);
        });
      } else {
        console.log("Error: response");
      }
    })
    .catch(function (error) {
      console.log("error with convertPostalCode");
    });
};

var getRestaurants = function (data) {
  if (data.length === 0) {
    restaurantContainerEl.textContent = "No restaurants found.";
    return;
  }

  restaurantContainerEl.innerHTML = "";

  var lon = data.bbox[0];
  var lat = data.bbox[1];

  var restaurantURL =
    "https://api.yelp.com/v3/businesses/search?latitude=" +
    lat +
    "&longitude=" +
    lon +
    "&radius=2000&limit=10";

  console.log(restaurantURL);

  var request = new Request(restaurantURL, {
    method: "GET",
    headers: new Headers({
      Authorization:
        "Bearer lO79j63ISFGzcfjzGoCxRkKARZG2kQcdr0R7PSB1CuvE9QuVJwBA0R-dzLwAGzGqF3PpdjuTOTHJyPI-R7rh-xZxbka3RPqzWhKLFE7fQr21uCsWim-DT9IS1cNDYnYx",
      "Content-Type": "application/json",
    }),
    mode: "no-cors",
  });

  fetch(request)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayRestaurants(data);
        });
      } else {
        console.log("Error: yelp response");
      }
    })
    .catch(function (error) {
      console.log("error with yelp response");
    });
};

//  display Restaurants into list items
var displayRestaurants = function (data) {};

// add event listeners to forms
userFormEl.addEventListener("submit", formSubmitHandler);
