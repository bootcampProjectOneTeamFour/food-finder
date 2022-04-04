var userFormEl = document.querySelector("#user-form");
var searchInputEl = document.querySelector("#postal-code");
var restaurantContainerEl = document.getElementById("food-list");
var restaurantCards = document.getElementById("restaurantCards");

// user inputs postal code
var formSubmitHandler = (event) => {
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
var getLatLon = () => {
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

// get object array of restaurants from lat/lon
var getRestaurants = (data) => {
  if (data.length === 0) {
    restaurantContainerEl.textContent = "No restaurants found.";
    return;
  }

  var lon = data.bbox[0];
  var lat = data.bbox[1];

  // remove proxyURL var and call when pushed to live page
  var proxyURL = "https://cors-anywhere.herokuapp.com/";

  var restaurantListURL =
    "https://api.yelp.com/v3/businesses/search?latitude=" +
    lat +
    "&longitude=" +
    lon +
    "&radius=2000&limit=10&sort_by=rating";

  let myHeaders = new Headers();
  myHeaders.append("method", "GET");
  myHeaders.append(
    "Authorization",
    "Bearer " +
      "lO79j63ISFGzcfjzGoCxRkKARZG2kQcdr0R7PSB1CuvE9QuVJwBA0R-dzLwAGzGqF3PpdjuTOTHJyPI-R7rh-xZxbka3RPqzWhKLFE7fQr21uCsWim-DT9IS1cNDYnYx"
  );
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("mode", "no-cors");
  myHeaders.append("Access-Control-Allow-Origin", "*");

  fetch(proxyURL + restaurantListURL, {
    headers: myHeaders,
  })
    .then((res) => {
      if (res.ok) {
        res.json().then(function (data) {
          displayRestaurants(data);
        });
      } else {
        console.log("error: yelp response");
      }
    })
    .catch(function (error) {
      console.log("error with yelp response");
    });
};

//  display Restaurants into card elements
var displayRestaurants = (data) => {
  if (data.length === 0) {
    restaurantContainerEl.textContent = "No restaurants found.";
    return;
  }

  for (var i = 0; i < data.length; i++) {
    var cardHolder = document.createElement("div");
    cardHolder.className =
      "max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700";

    var cardElement = document.createElement("a");
    cardElement.setAttribute("href", "./restaurant-index.html");

    var imageElement = document.createElement("img");
    imageElement.className = "rounded-t-lg";
    imageElement.src = data.businesses[i].image_url;
    imageElement.alt = "";

    var infoContainer = document.createElement("div");
    infoContainer.className = "p-5";

    var headingElement = document.createElement("h5");
    headingElement.className =
      "mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white";
    headingElement.textContent = data.businesses[i].name;

    var paragraphElement = document.createElement("p");
    paragraphElement.className =
      "mb-3 font-normal text-gray-700 dark:text-gray-400";
    paragraphElement.textContent = data.businesses[i].location;
  }
  restaurantCards.appendChild(cardHolder);
  cardHolder.append(cardElement, imageElement, infoContainer);
  infoContainer.append(headingElement, paragraphElement);

  //cardElement.addEventListener("click", function (event) {});
};

var saveRestaurants = (event) => {};
// add event listeners to forms
userFormEl.addEventListener("submit", formSubmitHandler);
