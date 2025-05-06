// Serverless function for Vercel
const { getMarsWeather } = require('../services/marsWeatherService');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('API route /api/weather called');
    const weatherData = await getMarsWeather();
    console.log('Weather data retrieved successfully');
    res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error in /api/weather serverless function:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Mars weather data',
      message: error.message
    });
  }
};