/**
 * AWS Deployment Script for Mars Weather App
 * 
 * This script helps deploy the Mars Weather App to AWS services.
 * It can be used to create necessary AWS resources and deploy the application.
 */

const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  // Uncomment these lines when deploying and add your credentials to .env
  // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Initialize AWS services
const dynamoDB = new AWS.DynamoDB();
const s3 = new AWS.S3();
const eb = new AWS.ElasticBeanstalk();

/**
 * Creates DynamoDB table for storing Mars weather data
 */
async function createDynamoDBTable() {
  const tableName = process.env.DYNAMODB_TABLE_NAME;
  
  const params = {
    TableName: tableName,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };
  
  try {
    const data = await dynamoDB.createTable(params).promise();
    console.log('DynamoDB table created:', data);
    return data;
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log(`Table ${tableName} already exists`);
      return { TableDescription: { TableName: tableName } };
    }
    console.error('Error creating DynamoDB table:', error);
    throw error;
  }
}

/**
 * Creates S3 bucket for storing application files
 */
async function createS3Bucket() {
  const bucketName = `mars-weather-app-${Date.now()}`;
  
  const params = {
    Bucket: bucketName,
    ACL: 'private'
  };
  
  try {
    const data = await s3.createBucket(params).promise();
    console.log('S3 bucket created:', data);
    return bucketName;
  } catch (error) {
    console.error('Error creating S3 bucket:', error);
    throw error;
  }
}

/**
 * Packages the application for deployment
 */
function packageApplication() {
  // This is a placeholder for packaging logic
  // In a real deployment, you would:
  // 1. Zip the application files
  // 2. Upload the zip to S3
  // 3. Return the S3 URL of the zip file
  
  console.log('Packaging application...');
  return 'app-package.zip';
}

/**
 * Creates Elastic Beanstalk application
 */
async function createElasticBeanstalkApp() {
  const appName = 'MarsWeatherApp';
  
  const params = {
    ApplicationName: appName,
    Description: 'Mars Weather Application'
  };
  
  try {
    const data = await eb.createApplication(params).promise();
    console.log('Elastic Beanstalk application created:', data);
    return appName;
  } catch (error) {
    if (error.code === 'ApplicationAlreadyExistsException') {
      console.log(`Application ${appName} already exists`);
      return appName;
    }
    console.error('Error creating Elastic Beanstalk application:', error);
    throw error;
  }
}

/**
 * Creates Elastic Beanstalk environment
 */
async function createElasticBeanstalkEnv(appName, s3BucketName, s3Key) {
  const envName = 'MarsWeatherApp-env';
  
  const params = {
    ApplicationName: appName,
    EnvironmentName: envName,
    SolutionStackName: '64bit Amazon Linux 2 v5.8.0 running Node.js 18',
    OptionSettings: [
      {
        Namespace: 'aws:autoscaling:launchconfiguration',
        OptionName: 'InstanceType',
        Value: 't2.micro'
      },
      {
        Namespace: 'aws:elasticbeanstalk:application:environment',
        OptionName: 'NODE_ENV',
        Value: 'production'
      },
      {
        Namespace: 'aws:elasticbeanstalk:application:environment',
        OptionName: 'NASA_API_KEY',
        Value: process.env.NASA_API_KEY
      },
      {
        Namespace: 'aws:elasticbeanstalk:application:environment',
        OptionName: 'NASA_API_URL',
        Value: process.env.NASA_API_URL
      },
      {
        Namespace: 'aws:elasticbeanstalk:application:environment',
        OptionName: 'DYNAMODB_TABLE_NAME',
        Value: process.env.DYNAMODB_TABLE_NAME
      }
    ],
    // Uncomment when you have a real S3 bucket and application package
    // VersionLabel: 'v1',
    // SourceBundle: {
    //   S3Bucket: s3BucketName,
    //   S3Key: s3Key
    // }
  };
  
  try {
    console.log('Creating Elastic Beanstalk environment...');
    // In a real deployment, you would uncomment this:
    // const data = await eb.createEnvironment(params).promise();
    // console.log('Elastic Beanstalk environment created:', data);
    // return data;
    
    // For now, just return a mock response
    return {
      EnvironmentName: envName,
      EnvironmentId: 'e-abcdefghij',
      ApplicationName: appName,
      Status: 'Launching'
    };
  } catch (error) {
    console.error('Error creating Elastic Beanstalk environment:', error);
    throw error;
  }
}

/**
 * Main deployment function
 */
async function deploy() {
  try {
    console.log('Starting deployment process...');
    
    // Create DynamoDB table
    const table = await createDynamoDBTable();
    console.log(`DynamoDB table ${table.TableDescription.TableName} is ready`);
    
    // Create S3 bucket (commented out for safety)
    // const bucketName = await createS3Bucket();
    // console.log(`S3 bucket ${bucketName} is ready`);
    
    // Package application
    const appPackage = packageApplication();
    console.log(`Application packaged as ${appPackage}`);
    
    // Create Elastic Beanstalk application
    const appName = await createElasticBeanstalkApp();
    console.log(`Elastic Beanstalk application ${appName} is ready`);
    
    // Create Elastic Beanstalk environment
    // const env = await createElasticBeanstalkEnv(appName, bucketName, appPackage);
    // console.log(`Elastic Beanstalk environment ${env.EnvironmentName} is being created`);
    
    console.log('Deployment initiated successfully!');
    console.log('Note: This script is for demonstration purposes. In a real deployment scenario, you would need to:');
    console.log('1. Uncomment the actual AWS service calls');
    console.log('2. Add your AWS credentials to the .env file');
    console.log('3. Run this script with proper permissions');
    
  } catch (error) {
    console.error('Deployment failed:', error);
  }
}

// Execute deployment if this script is run directly
if (require.main === module) {
  deploy();
}

module.exports = {
  createDynamoDBTable,
  createS3Bucket,
  packageApplication,
  createElasticBeanstalkApp,
  createElasticBeanstalkEnv,
  deploy
};