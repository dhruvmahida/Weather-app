// Backend for the weather app
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const API_KEY = process.env.OPENWEATHER_API_KEY;

// serve the files inside the public folder (html, css, js)
app.use(express.static('public'));

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err.message));

// every searched city name will be saved using this model
const searchSchema = new mongoose.Schema({
  city: String,
  date: { type: Date, default: Date.now }
});
const Search = mongoose.model('Search', searchSchema);

// route to get weather, example: /weather?city=Surat
app.get('/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.json({ error: 'Please enter a city name' });
  }

  try {
    // current weather
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    // 404 means the city was not found
    if (data.cod == 404) {
      return res.json({ error: 'City not found' });
    }

    // any other problem (for example a wrong or inactive API key)
    if (data.cod != 200) {
      return res.json({ error: 'API error: ' + data.message });
    }

    // 5 day forecast
    const url2 = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
    const response2 = await fetch(url2);
    const data2 = await response2.json();

    // the list has data for every 3 hours, so 8 items = 1 day
    // that is why we take every 8th item
    const forecast = [];
    for (let i = 7; i < data2.list.length; i += 8) {
      forecast.push({
        date: data2.list[i].dt_txt.split(' ')[0],
        temp: Math.round(data2.list[i].main.temp),
        icon: data2.list[i].weather[0].icon
      });
    }

    // save the city name in the database
    Search.create({ city: data.name }).catch(() => { });

    // send the data to the frontend
    res.json({
      city: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      humidity: data.main.humidity,
      wind: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      forecast: forecast
    });
  } catch (err) {
    res.json({ error: 'Something went wrong, please try again' });
  }
});

// last 5 searches
app.get('/history', async (req, res) => {
  // if the database is not connected, send an empty list
  if (mongoose.connection.readyState !== 1) {
    return res.json([]);
  }
  const list = await Search.find().sort({ date: -1 }).limit(5);
  res.json(list);
});

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});