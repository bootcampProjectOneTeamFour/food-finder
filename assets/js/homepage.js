var userFormEl = document.querySelector("#user-form");
var searchInputEl = document.querySelector("#postal-code");
var restaurantContainerEl = document.getElementById("food-list");
var historyEl = document.getElementById("historyEl");
var iframeEl = document.querySelector("#iframeDirections");
var targetRestaurantLat = "";
var targetRestaurantLon = "";

// user inputs postal code
var formSubmitHandler = (event) => {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  var postalCode = searchInputEl.value.trim();

  if (postalCode) {
    getLatLon(postalCode);
    coordinatesPrep(data);

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

  // remove proxyURL when pushed to live page
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

// display Restaurants into card elements
var displayRestaurants = (data) => {
  if (data.businesses.length === 0) {
    restaurantContainerEl.textContent = "No restaurants found.";
    return;
  }

  restaurantContainerEl.innerHTML = "";

  for (var i = 0; i < data.businesses.length; i++) {
    var cardHolder = document.createElement("div");
    cardHolder.className =
      "max-w-sm max-h-sm m-6 gap-10 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700";
    cardHolder.setAttribute("id", "data-number-" + [i]);

    var cardElement = document.createElement("div");
    //cardElement.setAttribute("href", "./restaurant-index.html");

    var imageElement = document.createElement("img");
    imageElement.className = "rounded-t-lg";
    imageElement.src = data.businesses[i].image_url;
    imageElement.alt = "Image Not Found";

    var infoContainer = document.createElement("div");
    infoContainer.className = "p-5";

    var headingElement = document.createElement("h5");
    headingElement.className =
      "mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white";
    headingElement.textContent = data.businesses[i].name;

    var paragraphElement = document.createElement("p");
    paragraphElement.className =
      "mb-3 font-normal text-gray-700 dark:text-gray-400";
    paragraphElement.innerHTML =
      data.businesses[i].location.display_address[0] +
      ", " +
      data.businesses[i].location.display_address[1];

    restaurantContainerEl.appendChild(cardHolder);
    cardHolder.appendChild(cardElement);
    cardElement.append(imageElement, infoContainer);
    infoContainer.append(headingElement, paragraphElement);

    // save cardElement.addEventListener history to array of objects
    imageElement.addEventListener("click", function (event) {
      console.log("clicked");
      var existingEntries = JSON.parse(localStorage.getItem("allRestaurants"));
      if (existingEntries == null) existingEntries = [];
      // save object to localStorage array as value
      localStorage.setItem(
        "restaurant",
        JSON.stringify(
          event.target.nextElementSibling.firstElementChild.textContent
        )
      );
      // push data.businesses[i].name to existingEntries []
      existingEntries.push(
        event.target.nextElementSibling.firstElementChild.textContent
      );
      // create key of all restaurants to load
      localStorage.setItem("allRestaurants", JSON.stringify(existingEntries));
      window.location.href = "./restaurant-index.html";
    });
  }
};

var coordinatesPrep = function (data) {
  var latStart = data.bbox[0];
  var lonStart = data.bbox[1];
  var latEnd = targetRestaurantLat;
  var lonEnd = targetRestaurantLon;
  getDirections(latStart, latEnd, lonStart, lonEnd);
};

var getDirections = function (latStart, latEnd, lonStart, lonEnd) {
  var apiUrl =
    "https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248da3361049f304c83b34cb7e9d07c6238&start=" +
    latStart +
    "," +
    lonStart +
    "&end=" +
    latEnd +
    "," +
    lonEnd;
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log("this is directions data" + data);
          // call function to update iFrame here
          // updateMap(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Openroute Service");
    });
};

var updateMap = function (data) {
  var iframeLink = ""; // pull from data passed
  iframeEl.setAttribute("src", iframeLink);
};

// keep localStorage history
var loadHistory = function () {
  // store data.businesses[i].name in object
  var existingEntries = JSON.parse(localStorage.getItem("allRestaurants"));
  // create key of existingEntries
  if (existingEntries == null) existingEntries = [];
  historyEl.innerHTML = "";
  for (var i = 0; i < existingEntries.length; i++) {
    var historyItem = document.createElement("li");
    historyItem.setAttribute("class", "");
    historyItem.textContent = ("restaurant", existingEntries[i]);
    historyEl.appendChild(historyItem);
  }
};

loadHistory();

// add event listener to form
userFormEl.addEventListener("submit", formSubmitHandler);
