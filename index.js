const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { getMarsWeather } = require('./services/marsWeatherService');
const { setupAWS } = require('./config/awsConfig');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize AWS configuration
setupAWS();

// Routes
app.get('/api/weather', async (req, res) => {
  try {
    const weatherData = await getMarsWeather();
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching Mars weather data:', error);
    res.status(500).json({ error: 'Failed to fetch Mars weather data' });
  }
});

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Mars Weather App server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the application`);
});