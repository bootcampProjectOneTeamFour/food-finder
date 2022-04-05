var userFormEl = document.querySelector("#user-form");
var searchInputEl = document.querySelector("#postal-code");
var restaurantContainerEl = document.getElementById("food-list");
var iframeEl = document.querySelector("#iframeDirections");
var targetRestaurantLat = "";
var targetRestaurantLon = "";
var pathForMap = "";

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
          coordinatesPrep(data);
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
          console.log(data);
          displayRestaurants(data);
          coordinatesPrep(data);
        });
      } else {
        console.log("error: yelp response");
      }
    })
    .catch(function (error) {
      console.log("error with yelp response");
    });
};

//  display Restaurants into list items
var displayRestaurants = function (data) {
  var cardElement = document.createElement("div");
  var imageContainer = document.createElement("div");
  var infoContainer = document.createElement("div");
  var imageElement = document.createElement("img");
  var headingElement = document.createElement("h5");
  var paragraphElement = document.createElement("p");

  cardElement.className = "card";
  imageContainer.className = "image-container";
  infoContainer.className = "info-container";
  imageElement.className = "image";
  headingElement.className = "heading";
  paragraphElement.className = "paragraph";

  imageElement.setAttribute("alt", "Image supplied by Restaurant");

  if (data.length === 0) {
    restaurantContainerEl.textContent = "No restaurants found.";
    return;
  }
  console.log(data);

  // loop over given restaurants
  for (var i = 0; i < data.length; i++) {
    imageElement.src = data.businesses[i].image_url;
    headingElement.innerText = data.businesses[i].name;
    paragraphElement.innerText = data.businesses[i].rating;

    restaurantContainerEl.appendChild(cardElement);
    cardElement.append(imageContainer, infoContainer);

    console.log(restaurantContainerEl);
  }
};



// ---------------------> TOMMY SECTION START<------------------------
var coordinatesPrep = function(data) {
  var latStart = data.bbox[0];
  var lonStart = data.bbox[1];
  var latEnd = targetRestaurantLat;
  var lonEnd = targetRestaurantLon;
  getDirections(latStart, latEnd, lonStart, lonEnd);
};

var getDirections = function(latStart, latEnd, lonStart, lonEnd) {
    var apiUrl = 'https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248da3361049f304c83b34cb7e9d07c6238&start='+ latStart +','+ lonStart +'&end='+ latEnd +','+ lonEnd;
    fetch(apiUrl)
      .then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
            console.log("this is directions data" + data);
            // call function to update iFrame here
            // updateMap(data);
          });
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(function(error) {
        alert("Unable to connect to Openroute Service");
      });
  };

var updateMap = function(data) {
  var iframeLink = ""; // pull from data passed
  iframeEl.setAttribute('src', iframeLink);
};
// ---------------------> TOMMY SECTION END<------------------------

// add event listeners to forms
userFormEl.addEventListener("submit", formSubmitHandler);