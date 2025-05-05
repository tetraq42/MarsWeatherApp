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
        windMin.textContent = formatValue(data.windSpeed.min);
        windMax.textContent = formatValue(data.windSpeed.max);
        
        // Update pressure data
        pressureAvg.textContent = formatValue(data.pressure.average);
        pressureMin.textContent = formatValue(data.pressure.min);
        pressureMax.textContent = formatValue(data.pressure.max);
        
        // Update last updated timestamp
        lastUpdated.textContent = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        
        // Show the weather data section
        hideLoading();
        weatherDataElement.style.display = 'block';
        errorMessageElement.style.display = 'none';
        
        // Add note if this is mock data
        if (data.note) {
            console.info('Note:', data.note);
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
    }

    // Event listeners
    refreshButton.addEventListener('click', fetchWeatherData);
    retryButton.addEventListener('click', fetchWeatherData);

    // Initial data fetch
    fetchWeatherData();
});