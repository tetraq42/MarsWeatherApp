const axios = require('axios');
const { saveWeatherData } = require('../config/awsConfig');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Fetches Mars weather data from NASA's InSight API
 * @returns {Promise<Object>} Weather data from Mars
 */
async function getMarsWeather() {
  try {
    // NASA's InSight API for Mars weather
    // Note: As of late 2023, the InSight mission has concluded, so this API might not return current data
    // You may need to switch to a different data source or use historical data
    
    // Use environment variables or fallback to hardcoded values if they're not set
    const apiUrl = process.env.NASA_API_URL || 'https://api.nasa.gov/insight_weather';
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    
    console.log('Attempting to fetch data from NASA API...');
    console.log(`API URL: ${apiUrl}`);
    console.log(`Using API Key: ${apiKey.substring(0, 3)}...`); // Log only first few chars for security
    
    const response = await axios.get(apiUrl, {
      params: {
        api_key: apiKey,
        feedtype: 'json',
        ver: '1.0'
      }
    });

    console.log('NASA API response received');
    
    // Process the data
    const weatherData = processWeatherData(response.data);
    
    // Save to DynamoDB (optional, can be enabled in production)
    // await saveWeatherData(weatherData);
    
    return weatherData;
  } catch (error) {
    console.error('Error fetching Mars weather data:', error.message);
    if (error.response) {
      console.error('API response error:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    
    // If the API fails, return mock data for development purposes
    console.log('Falling back to mock data');
    return getMockWeatherData();
  }
}

/**
 * Processes raw weather data from NASA API
 * @param {Object} rawData - Raw data from NASA API
 * @returns {Object} Processed weather data
 */
function processWeatherData(rawData) {
  console.log('Processing weather data');
  
  // If the API returns valid data, process it
  if (rawData && rawData.sol_keys && rawData.sol_keys.length > 0) {
    console.log(`Found ${rawData.sol_keys.length} sols of data`);
    const latestSol = rawData.sol_keys[rawData.sol_keys.length - 1];
    const solData = rawData[latestSol];
    
    return {
      sol: latestSol,
      date: solData.First_UTC,
      temperature: {
        average: solData.AT?.av || 'N/A',
        min: solData.AT?.mn || 'N/A',
        max: solData.AT?.mx || 'N/A',
      },
      windSpeed: {
        average: solData.HWS?.av || 'N/A',
        min: solData.HWS?.mn || 'N/A',
        max: solData.HWS?.mx || 'N/A',
      },
      pressure: {
        average: solData.PRE?.av || 'N/A',
        min: solData.PRE?.mn || 'N/A',
        max: solData.PRE?.mx || 'N/A',
      },
      season: solData.Season || 'N/A',
    };
  }
  
  console.log('No valid data found, using mock data');
  // If no valid data, return mock data
  return getMockWeatherData();
}

/**
 * Provides mock Mars weather data for development or when API fails
 * @returns {Object} Mock weather data
 */
function getMockWeatherData() {
  return {
    sol: '3000',
    date: new Date().toISOString(),
    temperature: {
      average: -20,
      min: -80,
      max: 0,
    },
    windSpeed: {
      average: 4.2,
      min: 0.5,
      max: 17.8,
    },
    pressure: {
      average: 730,
      min: 705,
      max: 768,
    },
    season: 'winter',
    note: 'This is mock data as the actual API request failed or returned no data',
  };
}

module.exports = {
  getMarsWeather,
};