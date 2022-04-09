// global variables
var userFormEl = document.querySelector("#user-form");
var searchInputEl = document.querySelector("#postal-code");
var restaurantContainerEl = document.getElementById("food-list");
var historyEl = document.getElementById("historyEl");
var yelpCall = [];
var lonStart = "";
var latStart = "";

// user inputs postal code
var formSubmitHandler = (event) => {
  // prevent page from refreshing automatically
  event.preventDefault();

  // get value from input element
  var postalCode = searchInputEl.value.trim();

  if (postalCode) {
    getLatLon();

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
    "https://maps.googleapis.com/maps/api/geocode/json?address=" +
    searchInputEl.value.split(" ").join("").trim() +
    "&key=AIzaSyCansGW4cqHYnXmRIXWGdrGpcjYSiv3mEs";

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
      console.log("error with getLatLon");
    });
};

// get JSON object array of restaurants from Yelp API using getLatLon();
var getRestaurants = (data) => {
  if (data.length === 0) {
    restaurantContainerEl.textContent = "No restaurants found.";
    return;
  }
  // data variables from openrouteservice API
  lonStart = data.results[0].geometry.location.lng;
  latStart = data.results[0].geometry.location.lat;
  console.log(lonStart);
  console.log(latStart);

  sessionStorage.setItem("lonStart", lonStart);
  sessionStorage.setItem("latStart", latStart);

  // proxyURL required based on CORS issues
  var proxyURL = "https://cors-anywhere.herokuapp.com/";

  // get Yelp API data via fetch
  var restaurantListURL =
    "https://api.yelp.com/v3/businesses/search?latitude=" +
    latStart +
    "&longitude=" +
    lonStart +
    "&radius=2000&limit=10&sort_by=rating";

  // append new headers to pull Yelp API
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

  // remove proxyURL when pushed to live page
  // proxyURL
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
      console.log("error with Yelp API response");
    });
};

// display Restaurants into card elements
var displayRestaurants = (data) => {
  if (data.businesses.length === 0) {
    restaurantContainerEl.textContent = "No restaurants found.";
    return;
  }

  // clear card section on refresh/new search
  restaurantContainerEl.innerHTML = "";

  // loop through Yelp object and create card elements
  for (var i = 0; i < data.businesses.length; i++) {
    // overall card container
    var cardHolder = document.createElement("div");
    cardHolder.className =
      "max-w-sm max-h-sm m-6 gap-10 bg-red-400 rounded-lg border border-red-500 shadow-md dark:bg-gray-800 dark:border-gray-700";

    // used to wrap all card elements
    var cardElement = document.createElement("div");
    cardElement.setAttribute("id", "data-number-" + [i]);

    // image element on card
    var imageElement = document.createElement("img");
    imageElement.className = "rounded-t-lg";
    imageElement.src = data.businesses[i].image_url;
    imageElement.alt = "Image Not Found";

    // info element on card
    var infoContainer = document.createElement("div");
    infoContainer.className = "p-5";

    // display restaurant name
    var headingElement = document.createElement("h5");
    headingElement.className =
      "mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white";
    headingElement.textContent = data.businesses[i].name;

    // display restaurant address
    var paragraphElement = document.createElement("p");
    paragraphElement.className =
      "mb-3 font-normal text-gray-700 dark:text-gray-400";
    paragraphElement.innerHTML =
      data.businesses[i].location.display_address[0] +
      ", " +
      data.businesses[i].location.display_address[1];

    var coordinates = [
      data.businesses[i].coordinates.latitude,
      data.businesses[i].coordinates.longitude,
    ];
    paragraphElement.setAttribute("data-coordinates", coordinates);

    // append everything together
    restaurantContainerEl.appendChild(cardHolder);
    cardHolder.appendChild(cardElement);
    cardElement.append(imageElement, infoContainer);
    infoContainer.append(headingElement, paragraphElement);

    // save cardElement.addEventListener history to array of objects
    paragraphElement.addEventListener("click", function (e) {
      var coordPairString = e.target.getAttribute("data-coordinates");

      sessionStorage.setItem("coordinatesEnd", coordPairString);

      var existingEntries = JSON.parse(localStorage.getItem("allRestaurants"));
      if (existingEntries == null) existingEntries = [];
      // save object to localStorage array as value
      localStorage.setItem(
        "restaurant",
        JSON.stringify(e.target.previousElementSibling.textContent)
      );
      // push data.businesses[i].name to existingEntries []
      existingEntries.push(e.target.previousElementSibling.textContent);
      // create key of all restaurants to load
      localStorage.setItem("allRestaurants", JSON.stringify(existingEntries));
      // on click, refresh page to individual restaurant index file
      window.location.href = "./restaurant-index.html";
    });
  }
};

// keep localStorage history
var loadHistory = function () {
  // store data.businesses[i].name in object
  var existingEntries = JSON.parse(localStorage.getItem("allRestaurants"));
  // create key of existingEntries
  if (existingEntries == null) existingEntries = [];
  historyEl.innerHTML = "";
  // create li element for each previously viewed restaurant
  for (var i = 0; i < existingEntries.length; i++) {
    var historyItem = document.createElement("li");
    historyItem.setAttribute("class", "list-none");
    historyItem.textContent = ("restaurant", existingEntries[i]);
    historyEl.appendChild(historyItem);
  }
};

// call loadHistory() so historyEl stays active
loadHistory();

// add event listener to form
userFormEl.addEventListener("submit", formSubmitHandler);