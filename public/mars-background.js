document.addEventListener('DOMContentLoaded', () => {
    // NASA API key
    const NASA_API_KEY = 'SDCqFh0iMgItHSP4eOWDg3fTf6vYW1ku9XPsndgg';
    
    // Function to fetch Mars image from NASA API
    async function fetchMarsImage() {
        try {
            // Options for different Mars image sources:
            
            // 1. Mars Rover Photos API (Curiosity, Opportunity, Spirit)
            const roverUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${NASA_API_KEY}`;
            
            // 2. NASA Image and Video Library API with Mars search
            const libraryUrl = `https://images-api.nasa.gov/search?q=mars%20surface&media_type=image`;
            
            // Using the Mars Rover API for this example
            const response = await fetch(roverUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Check if we have photos
            if (data.photos && data.photos.length > 0) {
                // Get a random photo from the results
                const randomIndex = Math.floor(Math.random() * Math.min(data.photos.length, 25));
                const photo = data.photos[randomIndex];
                
                // Set the background image
                document.body.style.setProperty('--mars-background-image', `url('${photo.img_src}')`);
                document.body.classList.add('has-mars-background');
                
                // Add image attribution if container exists
                const attributionContainer = document.getElementById('mars-image-attribution');
                if (attributionContainer) {
                    attributionContainer.innerHTML = `
                        Mars image captured by ${photo.rover.name} rover on 
                        ${new Date(photo.earth_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                        (Sol ${photo.sol})
                    `;
                }
                
                // Set the background image using inline style as fallback
                document.body.style.backgroundImage = `url('${photo.img_src}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundAttachment = 'fixed';
                document.body.style.backgroundRepeat = 'no-repeat';
                
                // Apply the background to the ::before pseudo-element for better control
                const style = document.createElement('style');
                style.textContent = `
                    body::before {
                        background-image: url('${photo.img_src}');
                    }
                `;
                document.head.appendChild(style);
                
                console.log('Mars background image set successfully');
                return photo;
            } else {
                throw new Error('No Mars photos found in the API response');
            }
        } catch (error) {
            console.error('Error fetching Mars image:', error);
            // Use a fallback image
            const fallbackImage = 'https://mars.nasa.gov/system/resources/detail_files/25611_PIA24420-web.jpg';
            
            // Apply the fallback background
            document.body.style.backgroundImage = `url('${fallbackImage}')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundRepeat = 'no-repeat';
            
            // Apply to ::before as well
            const style = document.createElement('style');
            style.textContent = `
                body::before {
                    background-image: url('${fallbackImage}');
                }
            `;
            document.head.appendChild(style);
            
            return null;
        }
    }
    
    // Fetch and set the Mars background image
    fetchMarsImage();
});