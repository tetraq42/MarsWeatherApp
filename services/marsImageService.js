const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config(); // Ensure environment variables are loaded

/**
 * Fetches and processes images from NASA's Mars Rover Photos API.
 * @param {string} roverName - Name of the rover (e.g., 'curiosity', 'perseverance'). Defaults to 'curiosity'.
 * @param {number} sol - Martian sol (day number). Defaults to a recent Sol if not provided.
 * @param {string[]} cameraList - Optional array of camera names to prioritize.
 * @returns {Promise<Object[]>} Array of processed image objects or throws an error.
 */
async function getMarsImages(roverName = 'curiosity', sol = 3000, cameraList = ['MAST', 'NAVCAM']) {
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY'; // Reuse existing key or use a specific one like NASA_API_KEY_IMAGES
  let images = [];
  let attempts = 0;
  // Try primary cameras first, then a broader search if no images found.
  const initialCameras = cameraList && cameraList.length > 0 ? cameraList : [null]; // null means all cameras

    for (const camera of initialCameras) {
        attempts++;
        let apiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?sol=${sol}&api_key=${apiKey}`;
        if (camera) {
            apiUrl += `&camera=${camera.toLowerCase()}`;
        }
        console.log(`Attempting to fetch images from: ${apiUrl}`);

        try {
            const response = await axios.get(apiUrl);
            if (response.data.photos && response.data.photos.length > 0) {
                images = response.data.photos.slice(0, 5).map(photo => ({
                    id: photo.id,
                    img_src: photo.img_src.replace(/^http:/, 'https:'), // Attempt to use HTTPS
                    camera_full_name: photo.camera.full_name,
                    earth_date: photo.earth_date,
                    rover_name: photo.rover.name,
                    sol: photo.sol
                }));
                if (images.length > 0) break; // Found images, no need to try other cameras
            }
        } catch (error) {
            console.error(`Error fetching images for rover ${roverName}, sol ${sol}, camera ${camera || 'any'}:`, error.message);
            // Don't throw yet, allow trying other cameras or returning empty if all fail
        }
    }

  if (images.length === 0) {
    console.log(`No images found for rover ${roverName}, sol ${sol} after ${attempts} attempts.`);
    // Could throw an error here or return empty array based on desired behavior
    // For now, return empty and let frontend handle it.
  }
  return images;
}

module.exports = {
  getMarsImages,
};
