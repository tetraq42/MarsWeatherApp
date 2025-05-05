const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Sets up AWS SDK configuration
 */
function setupAWS() {
  // Configure AWS SDK
  AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
    // Uncomment these lines when deploying to production and add your credentials to .env
    // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  console.log('AWS SDK configured successfully');
  return AWS;
}

/**
 * Creates a DynamoDB instance
 */
function getDynamoDB() {
  return new AWS.DynamoDB.DocumentClient();
}

/**
 * Saves weather data to DynamoDB
 * @param {Object} weatherData - The weather data to save
 */
async function saveWeatherData(weatherData) {
  const dynamoDB = getDynamoDB();
  const tableName = process.env.DYNAMODB_TABLE_NAME;

  const params = {
    TableName: tableName,
    Item: {
      id: `weather-${Date.now()}`,
      timestamp: new Date().toISOString(),
      data: weatherData,
    },
  };

  try {
    await dynamoDB.put(params).promise();
    console.log('Weather data saved to DynamoDB');
    return true;
  } catch (error) {
    console.error('Error saving weather data to DynamoDB:', error);
    return false;
  }
}

module.exports = {
  setupAWS,
  getDynamoDB,
  saveWeatherData,
};