# Mars Weather App

A web application that displays current and historical weather data from Mars, built with Node.js and designed to be deployed on AWS.

## Features

- Display current Mars weather conditions including temperature, wind speed, and atmospheric pressure
- Historical weather data tracking
- Responsive design for desktop and mobile devices
- AWS cloud deployment ready

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript
- **Data Source**: NASA Mars Weather API
- **Cloud Services**: AWS (DynamoDB, Elastic Beanstalk, S3)
- **Other Tools**: Axios for API requests, dotenv for environment variables

## Project Structure

```
MarsWeatherApp/
├── config/
│   └── awsConfig.js       # AWS configuration and utilities
├── models/
│   └── weatherModel.js    # Data model for Mars weather
├── public/
│   ├── index.html         # Main HTML page
│   ├── styles.css         # CSS styles
│   └── app.js             # Frontend JavaScript
├── services/
│   └── marsWeatherService.js  # Service for fetching Mars weather data
├── .env                   # Environment variables (not committed to version control)
├── .gitignore             # Git ignore file
├── aws-deploy.js          # AWS deployment script
├── index.js               # Main application entry point
├── package.json           # Project dependencies and scripts
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- AWS account (for deployment)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/mars-weather-app.git
   cd mars-weather-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   NASA_API_KEY=your_nasa_api_key
   NASA_API_URL=https://api.nasa.gov/insight_weather
   AWS_REGION=us-east-1
   DYNAMODB_TABLE_NAME=MarsWeatherData
   ```

   You can get a NASA API key from: https://api.nasa.gov/

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## AWS Deployment

### Option 1: Manual Deployment

1. Set up your AWS credentials in the `.env` file:
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

2. Run the deployment script:
   ```
   node aws-deploy.js
   ```

### Option 2: AWS Elastic Beanstalk CLI

1. Install the EB CLI:
   ```
   pip install awsebcli
   ```

2. Initialize your EB application:
   ```
   eb init
   ```

3. Create an environment and deploy:
   ```
   eb create mars-weather-env
   ```

4. Open the deployed application:
   ```
   eb open
   ```

## Notes

- The NASA InSight mission, which provided Mars weather data, has concluded its operations. This application may use historical or simulated data when live data is unavailable.
- For production deployment, ensure you set up proper security measures for your AWS resources.

## License

This project is licensed under the ISC License.

## Acknowledgments

- NASA for providing Mars weather data through their public APIs
- AWS for cloud infrastructure services