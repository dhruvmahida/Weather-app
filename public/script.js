// get the html elements we need
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const message = document.getElementById('message');
const result = document.getElementById('result');
const forecast = document.getElementById('forecast');
const history = document.getElementById('history');

// when the search button is clicked
searchBtn.addEventListener('click', function () {
  getWeather(cityInput.value);
});

// function to get the weather
async function getWeather(city) {
  if (city.trim() === '') {
    message.textContent = 'Please enter a city name';
    return;
  }

  message.textContent = 'Loading...';

  // ask our own server for the data
  const response = await fetch('/weather?city=' + city);
  const data = await response.json();

  // if there is an error, show it and stop
  if (data.error) {
    message.textContent = data.error;
    return;
  }

  message.textContent = '';
  showWeather(data);
  loadHistory();
}

// show the weather on the screen
function showWeather(data) {
  result.innerHTML =
    '<h2>' + data.city + ', ' + data.country + '</h2>' +
    '<img src="https://openweathermap.org/img/wn/' + data.icon + '@2x.png">' +
    '<div class="temp">' + data.temp + '°C</div>' +
    '<p>' + data.description + '</p>' +
    '<p>Humidity: ' + data.humidity + '% | Wind: ' + data.wind + ' m/s</p>';

  // show the 5 forecast days
  forecast.innerHTML = '';
  for (let i = 0; i < data.forecast.length; i++) {
    const day = data.forecast[i];
    forecast.innerHTML +=
      '<div class="day">' +
      '<div>' + day.date.slice(5) + '</div>' +
      '<img src="https://openweathermap.org/img/wn/' + day.icon + '.png">' +
      '<div>' + day.temp + '°C</div>' +
      '</div>';
  }
}

// get the previous searches from the database
async function loadHistory() {
  const response = await fetch('/history');
  const list = await response.json();

  history.innerHTML = '';
  for (let i = 0; i < list.length; i++) {
    const btn = document.createElement('button');
    btn.textContent = list[i].city;
    // clicking the button searches that city again
    btn.addEventListener('click', function () {
      getWeather(btn.textContent);
    });
    history.appendChild(btn);
  }
}

// show the history as soon as the page opens
loadHistory();
