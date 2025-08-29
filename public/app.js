document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const loadingElement = document.getElementById('loading');
    const weatherDataElement = document.getElementById('weather-data');
    const errorMessageElement = document.getElementById('error-message');
    const refreshButton = document.getElementById('refresh-btn');
    const retryButton = document.getElementById('retry-btn');

    // Elements for displaying weather data
    const solNumber = document.getElementById('sol-number');
    const earthDate = document.getElementById('earth-date');
    const season = document.getElementById('season');
    const tempAvg = document.getElementById('temp-avg');
    const tempMin = document.getElementById('temp-min');
    const tempMax = document.getElementById('temp-max');
    const windAvg = document.getElementById('wind-avg');
    const windMin = document.getElementById('wind-min');
    const windMax = document.getElementById('wind-max');
    const pressureAvg = document.getElementById('pressure-avg');
    const pressureMin = document.getElementById('pressure-min');
    const pressureMax = document.getElementById('pressure-max');
    const lastUpdated = document.getElementById('last-updated');
    const mockDataNoteElement = document.getElementById('mock-data-note');

    // DOM Elements for Mars Images
    const marsImagesContainer = document.getElementById('mars-images-container');
    const marsImagesError = document.getElementById('mars-images-error');
    const fetchImagesBtn = document.getElementById('fetch-images-btn');
    const roverSelect = document.getElementById('rover-select');
    const solInput = document.getElementById('sol-input');
    const marsImagesLoading = document.getElementById('mars-images-loading');

    // Fetch weather data from the API
    async function fetchWeatherData() {
        showLoading();
        
        try {
            const response = await fetch('/api/weather');
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            displayWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            showError();
        }
    }

    // Display weather data in the UI
    function displayWeatherData(data) {
        // Update sol and date information
        solNumber.textContent = data.sol;
        
        // Format the date
        const dateObj = new Date(data.date);
        earthDate.textContent = dateObj.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Update season
        season.textContent = capitalizeFirstLetter(data.season);
        
        // Update temperature data
        tempAvg.textContent = formatValue(data.temperature.average);
        tempMin.textContent = formatValue(data.temperature.min);
        tempMax.textContent = formatValue(data.temperature.max);
        
        // Update wind data
        windAvg.textContent = formatValue(data.windSpeed.average);
        // Ensure windMin and windMax elements exist before setting them
        if (windMin) windMin.textContent = formatValue(data.windSpeed.min);
        if (windMax) windMax.textContent = formatValue(data.windSpeed.max);
        
        // Update pressure data
        pressureAvg.textContent = formatValue(data.pressure.average);
        // Ensure pressureMin and pressureMax elements exist before setting them
        if (pressureMin) pressureMin.textContent = formatValue(data.pressure.min);
        if (pressureMax) pressureMax.textContent = formatValue(data.pressure.max);
        
        // Update last updated timestamp
        const dataTimestamp = new Date(data.date);
        lastUpdated.textContent = dataTimestamp.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'UTC' // Assuming data.date is UTC
        });
        
        // Show the weather data section
        hideLoading();
        weatherDataElement.style.display = 'block';
        errorMessageElement.style.display = 'none';
        
        // Add note if this is mock data or historical data
        if (data.note && data.note.trim() !== '') { // Check if note is not empty
            if (mockDataNoteElement) {
                mockDataNoteElement.textContent = data.note;
                mockDataNoteElement.style.display = 'block';
            }
            console.info('Data Note:', data.note); // Keep console log for debugging
        } else {
            if (mockDataNoteElement) {
                mockDataNoteElement.textContent = '';
                mockDataNoteElement.style.display = 'none';
            }
        }
    }

    // Helper function to format values
    function formatValue(value) {
        if (value === 'N/A' || value === undefined || value === null) {
            return 'N/A';
        }
        return typeof value === 'number' ? value.toFixed(1) : value;
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        if (!string || string === 'N/A') return 'N/A';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Show loading state
    function showLoading() {
        loadingElement.style.display = 'block';
        weatherDataElement.style.display = 'none';
        errorMessageElement.style.display = 'none';
        if (mockDataNoteElement) mockDataNoteElement.style.display = 'none';
    }

    // Hide loading state
    function hideLoading() {
        loadingElement.style.display = 'none';
    }

    // Show error message
    function showError() {
        loadingElement.style.display = 'none';
        weatherDataElement.style.display = 'none';
        errorMessageElement.style.display = 'block';
        if (mockDataNoteElement) mockDataNoteElement.style.display = 'none';
    }

    // Event listeners
    refreshButton.addEventListener('click', fetchWeatherData);
    retryButton.addEventListener('click', fetchWeatherData);

    // Initial data fetch
    fetchWeatherData();

    // --- Mars Images Functionality ---

    function showImageLoading() {
        if(marsImagesLoading) marsImagesLoading.style.display = 'flex';
        if(marsImagesContainer) marsImagesContainer.style.display = 'none';
        if(marsImagesError) marsImagesError.style.display = 'none';
    }

    function hideImageLoading() {
        if(marsImagesLoading) marsImagesLoading.style.display = 'none';
    }

    async function fetchMarsImages() {
        showImageLoading();
        const selectedRover = roverSelect.value;
        const selectedSol = solInput.value;

        if (!selectedSol || parseInt(selectedSol) < 0) {
            if(marsImagesError) marsImagesError.textContent = 'Please enter a valid Sol day.';
            if(marsImagesError) marsImagesError.style.display = 'block';
            hideImageLoading();
            return;
        }

        try {
            const response = await fetch(`/api/mars-images?rover=${selectedRover}&sol=${selectedSol}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }
            const images = await response.json();
            displayMarsImages(images, selectedSol); // Pass sol for caption
        } catch (error) {
            console.error('Error fetching Mars images:', error);
            if(marsImagesError) marsImagesError.textContent = `Failed to fetch images: ${error.message}`;
            if(marsImagesError) marsImagesError.style.display = 'block';
            if(marsImagesContainer) marsImagesContainer.innerHTML = ''; // Clear previous images
            hideImageLoading();
        }
    }

    function displayMarsImages(images, sol) {
        hideImageLoading();
        if(marsImagesContainer) marsImagesContainer.innerHTML = ''; // Clear previous images
        if(marsImagesContainer) marsImagesContainer.style.display = 'grid'; // Assuming grid display

        if (!images || images.length === 0) {
            if(marsImagesError) marsImagesError.textContent = `No images found for Sol ${sol} from this rover. Try a different Sol or rover.`;
            if(marsImagesError) marsImagesError.style.display = 'block';
            return;
        }
        if(marsImagesError) marsImagesError.style.display = 'none';

        images.forEach(image => {
            const imgCard = document.createElement('div');
            imgCard.className = 'image-card';

            const imgElement = document.createElement('img');
            imgElement.src = image.img_src; // Backend attempts https
            imgElement.alt = `Mars image from ${image.camera_full_name} on Sol ${image.sol}, Rover: ${image.rover_name}`;
            imgElement.onerror = () => { // Basic error handling for broken image links
               imgElement.alt = `Failed to load image: ${image.img_src}`;
               imgCard.classList.add('img-error'); // Add class for styling broken image
            };

            const caption = document.createElement('p');
            caption.className = 'image-caption';
            caption.innerHTML = `<b>${image.rover_name} Rover</b><br>
                               Camera: ${image.camera_full_name}<br>
                               Sol: ${image.sol}, Earth Date: ${image.earth_date}`;
            
            imgCard.appendChild(imgElement);
            imgCard.appendChild(caption);
            if(marsImagesContainer) marsImagesContainer.appendChild(imgCard);
        });
    }

    // Event Listener for fetching images
    if(fetchImagesBtn) fetchImagesBtn.addEventListener('click', fetchMarsImages);

});