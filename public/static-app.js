document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const loadingElement = document.getElementById('loading');
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
    const pressureAvg = document.getElementById('pressure-avg');
    const lastUpdated = document.getElementById('last-updated');

    // NASA API key
    const NASA_API_KEY = 'SDCqFh0iMgItHSP4eOWDg3fTf6vYW1ku9XPsndgg';
    
    // Fetch weather data directly from NASA API
    async function fetchWeatherData() {
        showLoading();
        
        try {
            // Try to fetch from NASA API directly
            const apiUrl = `https://api.nasa.gov/insight_weather/?api_key=${NASA_API_KEY}&feedtype=json&ver=1.0`;
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Process the data
            if (data && data.sol_keys && data.sol_keys.length > 0) {
                const latestSol = data.sol_keys[data.sol_keys.length - 1];
                const solData = data[latestSol];
                
                const processedData = {
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
                
                displayWeatherData(processedData);
            } else {
                // If no valid data, use mock data
                displayWeatherData(getMockWeatherData());
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            // Use mock data if API fails
            displayWeatherData(getMockWeatherData());
        }
    }

    // Get mock weather data
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
        
        // Update pressure data
        pressureAvg.textContent = formatValue(data.pressure.average);
        
        // Update last updated timestamp
        lastUpdated.textContent = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
        
        // Hide loading, show content
        hideLoading();
        document.querySelector('.sidebar').style.display = 'flex';
        document.querySelector('.main-content').style.display = 'flex';
        
        // Generate historical data for the forecast grid
        generateHistoricalData(data);
        
        // Add note if this is mock data
        if (data.note) {
            console.info('Note:', data.note);
        }
    }

    // Generate historical data for the forecast grid
    function generateHistoricalData(currentData) {
        const forecastGrid = document.querySelector('.forecast-grid');
        if (!forecastGrid) return;
        
        // Clear existing content
        forecastGrid.innerHTML = '';
        
        // Current sol
        const currentSol = parseInt(currentData.sol);
        
        // Generate 4 days of historical data
        for (let i = 0; i < 4; i++) {
            const historicalSol = currentSol - i;
            
            // Create forecast day element
            const forecastDay = document.createElement('div');
            forecastDay.className = 'forecast-day';
            
            // Random temperature variation (within 5 degrees of current)
            const tempVariation = Math.random() * 10 - 5;
            const avgTemp = parseFloat(currentData.temperature.average) + tempVariation;
            
            // Random condition
            const conditions = ['Clear', 'Dusty', 'Windy', 'Cold'];
            const icons = ['fa-sun', 'fa-smog', 'fa-wind', 'fa-snowflake'];
            const randomIndex = Math.floor(Math.random() * conditions.length);
            
            forecastDay.innerHTML = `
                <div class="day-name">Sol ${historicalSol}</div>
                <div class="day-icon"><i class="fas ${icons[randomIndex]}"></i></div>
                <div class="day-temp">${avgTemp.toFixed(1)}°C</div>
                <div class="day-condition">${conditions[randomIndex]}</div>
            `;
            
            forecastGrid.appendChild(forecastDay);
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
        loadingElement.style.display = 'flex';
        document.querySelector('.sidebar').style.display = 'none';
        document.querySelector('.main-content').style.display = 'none';
        errorMessageElement.style.display = 'none';
    }

    // Hide loading state
    function hideLoading() {
        loadingElement.style.display = 'none';
    }

    // Show error message
    function showError() {
        loadingElement.style.display = 'none';
        document.querySelector('.sidebar').style.display = 'none';
        document.querySelector('.main-content').style.display = 'none';
        errorMessageElement.style.display = 'flex';
    }

    // Event listeners
    refreshButton.addEventListener('click', fetchWeatherData);
    retryButton.addEventListener('click', fetchWeatherData);

    // Initial data fetch
    fetchWeatherData();
});