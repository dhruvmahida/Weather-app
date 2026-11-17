# Weather App

A simple weather app built with Node.js, Express and MongoDB. Search any city to see the current weather and a 5 day forecast. Recent searches are saved in MongoDB.

## Features
- Search weather by city name
- Current temperature, humidity, wind speed and description
- 5 day forecast
- Recent searches saved in MongoDB
- API key is kept on the server, not in the browser

## Tech Stack
- HTML, CSS, JavaScript (frontend)
- Node.js and Express (backend)
- MongoDB with Mongoose (database)
- OpenWeatherMap API

## How to Run
1. Clone the repo and open the folder
2. Install packages: `npm install`
3. Create a `.env` file (see `.env.example`):
   ```
   OPENWEATHER_API_KEY=your_key_here
   MONGO_URI=mongodb://127.0.0.1:27017/weatherapp
   ```
4. Make sure MongoDB is running
5. Start the server: `npm start`
6. Open http://localhost:3000

## What I Learned
- Calling an external API with `fetch`
- Building routes with Express
- Saving and reading data with MongoDB
- Keeping API keys safe with environment variables
