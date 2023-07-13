let currentCity = "Gaborone";
let units = "metric";
let apiKey = "aeb2b3f4a790f66fe13d4f5b8325028b";
let apiWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}`;

function getWeatherByCity() {
  axios
    .get(`${apiWeatherUrl}&units=${units}&q=${currentCity}`)
    .then(updateCity)
    .catch((error) => console.error(error));
}

function updateCity(response) {
  let unitTemp = "C";
  let unitSpeed = "km/h";

  if (units === "metric") {
    unitMetric.classList.add("fw-bold");
    unitImperial.classList.remove("fw-bold");
  } else {
    unitTemp = "F";
    unitSpeed = "mph";
    unitMetric.classList.remove("fw-bold");
    unitImperial.classList.add("fw-bold");
  }

  let dateTime = moment().utc().add(response.data.timezone, "s");

  let currentDayTimeElement = document.querySelector("#current-day-time");
  currentDayTimeElement.innerHTML = dateTime.format("dddd, h:mm a");

  let currentDate = document.querySelector("#current-date");
  currentDate.innerHTML = dateTime.format("MMMM D, YYYY");

  let cityElement = document.querySelector("#current-city");
  cityElement.innerHTML = `${response.data.name}, ${response.data.sys.country}`;

  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = `${Math.round(
    response.data.main.temp
  )}˚${unitTemp}`;

  let descriptionElement = document.querySelector("#current-description");
  descriptionElement.innerHTML = response.data.weather[0].description;

  let windElement = document.querySelector("#current-wind");
  windElement.innerHTML = `${Math.round(
    response.data.wind.speed
  )} ${unitSpeed}`;

  document.getElementById("current-forecast").src = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`;
}

function changeUnits(value) {
  units = value;
  getWeatherByCity();
}

let unitMetric = document.querySelector("#unit-metric");
unitMetric.addEventListener("click", function (event) {
  event.preventDefault();
  changeUnits("metric");
});

let unitImperial = document.querySelector("#unit-imperial");
unitImperial.addEventListener("click", function (event) {
  event.preventDefault();
  changeUnits("imperial");
});

function onSearch(event) {
  event.preventDefault();

  currentCity = document.querySelector("#search-input").value;
  getWeatherByCity();
}

let search = document.querySelector("#btn-search");
search.addEventListener("click", onSearch);

function onCurrent(event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition(function (position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    getWeatherByCity();
  });
}

let localLinks = document.querySelector(".local-links-locations");
localLinks.addEventListener("click", function(event) {
  if (event.target.tagName === "A") {
    event.preventDefault();
    currentCity = event.target.textContent;
    getWeatherByCity();
  }
});

let currentLocation = document.querySelector("#btn-current");
currentLocation.addEventListener("click", onCurrent);

let localCities = document.querySelectorAll(".local-city");
localCities.forEach(function (city) {
  city.addEventListener("click", function (event) {
    event.preventDefault();
    currentCity = event.target.innerText;
    getWeatherByCity();
  });
});

getWeatherByCity();
