#!/usr/bin/env node

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// S3 client configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'take-place-model-screenshots';

async function testS3Access() {
  console.log('Testing AWS S3 upload access...');
  console.log('AWS Region:', process.env.AWS_REGION || 'us-east-2');
  console.log('Bucket Name:', BUCKET_NAME);
  console.log('Access Key ID exists:', !!process.env.AWS_ACCESS_KEY_ID);
  console.log('Secret Access Key exists:', !!process.env.AWS_SECRET_ACCESS_KEY);

  try {
    // Try to upload a test file directly
    console.log('\nUploading test file...');
    const testData = Buffer.from('Test file for AWS S3 access - ' + new Date().toISOString());
    const fileName = `test-${Date.now()}.txt`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: testData,
      ContentType: 'text/plain',
      ACL: 'public-read',
    };

    await s3.send(new PutObjectCommand(params));
    
    // Generate the public URL
    const fileUrl = `https://${BUCKET_NAME}.s3.us-east-2.amazonaws.com/${fileName}`;

    console.log('Successfully uploaded test file!');
    console.log('File URL:', fileUrl);
    console.log('Please check if this URL is accessible in your browser.');
    console.log('\nTEST PASSED: AWS S3 upload permission is working correctly.');
    
  } catch (error) {
    console.error('\nERROR testing S3 upload:', error);
    console.error('\nTEST FAILED: Please check your AWS credentials and permissions.');
    process.exit(1);
  }
}

// Run the test
testS3Access(); 