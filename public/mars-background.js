document.addEventListener('DOMContentLoaded', () => {
    console.log('Mars background script loaded');
    
    // NASA API key
    const NASA_API_KEY = 'SDCqFh0iMgItHSP4eOWDg3fTf6vYW1ku9XPsndgg';
    
    // Function to fetch Mars image from NASA API
    async function fetchMarsImage() {
        try {
            // Use Mars Rover Photos API with MAST, MAHLI, FHAZ, or RHAZ cameras for high-res color images
            // Use a random sol between 1000 and 3000 for more variety
            const randomSol = Math.floor(Math.random() * 2000) + 1000;
            const cameras = ['MAST', 'MAHLI', 'FHAZ', 'RHAZ'];
            const randomCamera = cameras[Math.floor(Math.random() * cameras.length)];
            
            const roverUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${randomSol}&camera=${randomCamera}&api_key=${NASA_API_KEY}`;
            
            console.log(`Fetching Mars rover images from sol ${randomSol} using ${randomCamera} camera...`);
            const response = await fetch(roverUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Check if we have photos
            if (data.photos && data.photos.length > 0) {
                // Get a random photo from the results
                const randomIndex = Math.floor(Math.random() * data.photos.length);
                const photo = data.photos[randomIndex];
                
                console.log('Selected photo:', photo);
                
                // Set the background image
                document.body.style.setProperty('--mars-background-image', `url('${photo.img_src}')`);
                
                // Set the Mars image in the main content area
                const marsImageElement = document.getElementById('mars-image');
                if (marsImageElement) {
                    marsImageElement.src = photo.img_src;
                    marsImageElement.alt = `Mars surface captured by ${photo.rover.name} rover`;
                    
                    // Add a timestamp parameter to force image refresh
                    marsImageElement.src = `${photo.img_src}?t=${new Date().getTime()}`;
                }
                
                // Format the Earth date properly
                const earthDate = new Date(photo.earth_date);
                const formattedDate = earthDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                
                // Set image caption with detailed information
                const captionElement = document.getElementById('mars-image-caption');
                if (captionElement) {
                    captionElement.innerHTML = `
                        Image captured by ${photo.rover.name} rover on ${formattedDate} (Sol ${photo.sol})<br>
                        Camera: ${photo.camera.full_name} (${photo.camera.name})
                    `;
                }
                
                // Set the background image using inline style
                document.body.style.backgroundImage = `url('${photo.img_src}?t=${new Date().getTime()}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundAttachment = 'fixed';
                document.body.style.backgroundRepeat = 'no-repeat';
                
                // Apply the background to the ::before pseudo-element
                const style = document.createElement('style');
                style.textContent = `
                    body::before {
                        background-image: url('${photo.img_src}?t=${new Date().getTime()}');
                    }
                `;
                document.head.appendChild(style);
                
                console.log('Mars image set successfully');
                
                // Add detailed image attribution
                const attributionContainer = document.getElementById('mars-image-attribution');
                if (attributionContainer) {
                    attributionContainer.innerHTML = `
                        Mars image courtesy of NASA/JPL-Caltech - Captured by ${photo.rover.name} rover on ${formattedDate} (Sol ${photo.sol})
                    `;
                }
                
                return photo;
            } else {
                console.log('No photos found for the selected parameters, trying another camera...');
                // Try another camera
                const anotherCamera = cameras.filter(c => c !== randomCamera)[0];
                const fallbackUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${randomSol}&camera=${anotherCamera}&api_key=${NASA_API_KEY}`;
                
                const fallbackResponse = await fetch(fallbackUrl);
                if (!fallbackResponse.ok) {
                    throw new Error('Fallback request failed');
                }
                
                const fallbackData = await fallbackResponse.json();
                if (fallbackData.photos && fallbackData.photos.length > 0) {
                    // Recursively call the function with the new data
                    return handlePhotoData(fallbackData);
                } else {
                    throw new Error('No Mars photos found in any camera');
                }
            }
        } catch (error) {
            console.error('Error fetching Mars image:', error);
            // Use a fallback image - high quality Mars image
            const fallbackImage = 'https://mars.nasa.gov/system/resources/detail_files/25611_PIA24420-web.jpg';
            
            // Apply the fallback background
            document.body.style.backgroundImage = `url('${fallbackImage}')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundRepeat = 'no-repeat';
            
            // Set the Mars image in the main content area
            const marsImageElement = document.getElementById('mars-image');
            if (marsImageElement) {
                marsImageElement.src = fallbackImage;
                marsImageElement.alt = 'Mars surface (fallback image)';
            }
            
            // Set fallback caption
            const captionElement = document.getElementById('mars-image-caption');
            if (captionElement) {
                captionElement.textContent = 'Mars surface image from NASA archives (Perseverance rover)';
            }
            
            // Apply to ::before as well
            const style = document.createElement('style');
            style.textContent = `
                body::before {
                    background-image: url('${fallbackImage}');
                }
            `;
            document.head.appendChild(style);
            
            // Add fallback attribution
            const attributionContainer = document.getElementById('mars-image-attribution');
            if (attributionContainer) {
                attributionContainer.textContent = 'Mars image courtesy of NASA/JPL-Caltech - Perseverance rover';
            }
            
            return null;
        }
    }
    
    // Helper function to handle photo data
    function handlePhotoData(data) {
        if (data.photos && data.photos.length > 0) {
            // Get a random photo from the results
            const randomIndex = Math.floor(Math.random() * data.photos.length);
            const photo = data.photos[randomIndex];
            
            console.log('Selected photo:', photo);
            
            // Set the background image
            document.body.style.setProperty('--mars-background-image', `url('${photo.img_src}')`);
            
            // Set the Mars image in the main content area
            const marsImageElement = document.getElementById('mars-image');
            if (marsImageElement) {
                marsImageElement.src = `${photo.img_src}?t=${new Date().getTime()}`;
                marsImageElement.alt = `Mars surface captured by ${photo.rover.name} rover`;
            }
            
            // Format the Earth date properly
            const earthDate = new Date(photo.earth_date);
            const formattedDate = earthDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            // Set image caption with detailed information
            const captionElement = document.getElementById('mars-image-caption');
            if (captionElement) {
                captionElement.innerHTML = `
                    Image captured by ${photo.rover.name} rover on ${formattedDate} (Sol ${photo.sol})<br>
                    Camera: ${photo.camera.full_name} (${photo.camera.name})
                `;
            }
            
            // Set the background image using inline style
            document.body.style.backgroundImage = `url('${photo.img_src}?t=${new Date().getTime()}')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundRepeat = 'no-repeat';
            
            // Apply the background to the ::before pseudo-element
            const style = document.createElement('style');
            style.textContent = `
                body::before {
                    background-image: url('${photo.img_src}?t=${new Date().getTime()}');
                }
            `;
            document.head.appendChild(style);
            
            console.log('Mars image set successfully');
            
            // Add detailed image attribution
            const attributionContainer = document.getElementById('mars-image-attribution');
            if (attributionContainer) {
                attributionContainer.innerHTML = `
                    Mars image courtesy of NASA/JPL-Caltech - Captured by ${photo.rover.name} rover on ${formattedDate} (Sol ${photo.sol})
                `;
            }
            
            return photo;
        } else {
            throw new Error('No Mars photos found in the API response');
        }
    }
    
    // Function to create a simple temperature trend graph
    function createTemperatureTrendGraph() {
        const trendGraph = document.querySelector('.trend-graph');
        if (!trendGraph) return;
        
        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 100 50');
        
        // Create path for the temperature line
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Generate random data points for demonstration
        const points = [];
        for (let i = 0; i < 24; i++) {
            const x = i * (100 / 23);
            const y = 25 + Math.sin(i * 0.5) * 10 + (Math.random() * 5 - 2.5);
            points.push(`${x},${y}`);
        }
        
        // Create the path data
        const pathData = `M ${points.join(' L ')}`;
        path.setAttribute('d', pathData);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#ff7b54');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        
        // Add a gradient
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'tempGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '0%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#ff5757');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#ffcb45');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.appendChild(gradient);
        
        svg.appendChild(defs);
        path.setAttribute('stroke', 'url(#tempGradient)');
        
        // Add the path to the SVG
        svg.appendChild(path);
        
        // Add the SVG to the trend graph
        trendGraph.appendChild(svg);
    }
    
    // Add refresh functionality to the refresh button
    const refreshButton = document.getElementById('refresh-btn');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            // Fetch a new Mars image when refresh is clicked
            fetchMarsImage();
        });
    }
    
    // Fetch and set the Mars background image
    fetchMarsImage();
    
    // Create temperature trend graph
    createTemperatureTrendGraph();
});