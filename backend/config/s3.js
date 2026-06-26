const { S3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();

const region = process.env.AWS_REGION || 'us-east-1';

// Initialize the AWS S3 Client
// In production on EC2: Uses IAM Role from instance profile automatically.
// In local development: Uses local environment credentials or ~/.aws/credentials file.
const s3Client = new S3Client({
  region: region
});

console.log(`AWS S3 Client initialized in region: ${region}`);

module.exports = s3Client;
