const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { getMarsWeather } = require('./services/marsWeatherService');
const { getMarsImages } = require('./services/marsImageService'); // Added image service
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

app.get('/api/mars-images', async (req, res) => {
  try {
    const rover = req.query.rover || 'curiosity';
    // A default Sol known to have images, or let frontend specify.
    // For now, using a Sol that often has Curiosity images.
    const sol = parseInt(req.query.sol) || 3900; // Example Sol, can be made more dynamic
    
    // Example camera preferences, can also be from query params
    const preferredCameras = ['MAST', 'NAVCAM_RIGHT', 'NAVCAM_LEFT']; 

    console.log(`Received request for /api/mars-images: rover=${rover}, sol=${sol}`);
    const imageResults = await getMarsImages(rover, sol, preferredCameras);
    
    if (imageResults.length === 0) {
       // Attempt with a different, more recent rover if Curiosity has no images for the sol
       // This is a simple example of fallback logic.
       if (rover === 'curiosity') {
           console.log(`No images for Curiosity on sol ${sol}, trying Perseverance latest`);
           const perseveranceImages = await getMarsImages('perseverance', null, ['MEDA_RSM']); // null sol for latest
            if (perseveranceImages.length > 0) {
               res.json(perseveranceImages);
               return;
           }
       }
      // If still no images, send empty or a specific status
      // For now, sending empty array and client can handle 'no images found'.
    }
    res.json(imageResults);
  } catch (error) {
    console.error('Error fetching Mars images from API route:', error);
    res.status(500).json({ error: 'Failed to fetch Mars images', message: error.message });
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