import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from 'nanoid';

// S3 client configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',  // Default to us-east-2 rather than us-east-1
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'take-place-model-screenshots';

/**
 * Directly test if we can access S3 with credentials
 */
async function testS3Connection() {
  try {
    console.log('Testing S3 connection...');
    // Simple test file to verify connection
    const testParams = {
      Bucket: BUCKET_NAME,
      Key: `test-connection-${Date.now()}.txt`,
      Body: Buffer.from('Test S3 connection'),
      ContentType: 'text/plain',
      ACL: 'public-read' as const,
    };
    
    await s3.send(new PutObjectCommand(testParams));
    console.log('S3 connection test successful!');
    return true;
  } catch (error) {
    console.error('S3 connection test failed:', error);
    return false;
  }
}

/**
 * API route to upload model screenshots to S3
 */
export async function POST(request: NextRequest) {
  const now = new Date().toISOString();
  console.log('S3 Upload API route called at', now);
  console.log('Using bucket:', BUCKET_NAME);
  console.log('Using region:', process.env.AWS_REGION || 'us-east-2');
  console.log('Access key ID exists:', !!process.env.AWS_ACCESS_KEY_ID);
  console.log('Secret access key exists:', !!process.env.AWS_SECRET_ACCESS_KEY);
  
  // Test S3 connection first to catch credential issues early
  const connectionTestResult = await testS3Connection();
  if (!connectionTestResult) {
    console.error('Failed to connect to S3 bucket with provided credentials');
    return NextResponse.json(
      { error: "S3 connection test failed - check credentials and bucket permissions" },
      { status: 500 }
    );
  }
  
  try {
    // Parse the request data
    let data;
    try {
      const textBody = await request.text();
      console.log('Request body received, length:', textBody.length);
      
      try {
        data = JSON.parse(textBody);
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        console.log('First 100 characters of body:', textBody.substring(0, 100));
        return NextResponse.json(
          { error: "Invalid JSON in request body" },
          { status: 400 }
        );
      }
    } catch (parseError) {
      console.error('Error reading request body:', parseError);
      return NextResponse.json(
        { error: "Could not read request body" },
        { status: 400 }
      );
    }
    
    const { dataUrl } = data;
    
    if (!dataUrl) {
      console.log('Error: Missing dataUrl parameter');
      return NextResponse.json(
        { error: "Missing dataUrl parameter" },
        { status: 400 }
      );
    }
    
    console.log('Data URL received, length:', dataUrl.length);
    
    // Extract the binary data from the data URL
    try {
      if (!dataUrl.startsWith('data:image/')) {
        console.error('Error: Invalid data URL format - not an image');
        return NextResponse.json(
          { error: "Invalid data URL format - not an image" },
          { status: 400 }
        );
      }
      
      // Inspect image data
      console.log('Data URL type:', dataUrl.substring(0, 30) + '...');
      console.log('Is PNG with transparency:', dataUrl.startsWith('data:image/png'));
      
      const base64Data = dataUrl.split(',')[1];
      if (!base64Data) {
        console.error('Error: Invalid data URL format - missing base64 data');
        return NextResponse.json(
          { error: "Invalid data URL format - missing base64 data" },
          { status: 400 }
        );
      }
      
      const buffer = Buffer.from(base64Data, 'base64');
      console.log('Converted to buffer, size:', buffer.length);
      
      if (buffer.length === 0) {
        console.error('Error: Empty buffer after base64 conversion');
        return NextResponse.json(
          { error: "Empty buffer after base64 conversion" },
          { status: 400 }
        );
      }
      
      // Extract the MIME type
      const mimeMatch = dataUrl.match(/data:([^;]+);/);
      const contentType = mimeMatch ? mimeMatch[1] : 'image/png';
      console.log('Content type:', contentType);
      
      // Generate a unique filename
      const fileExtension = contentType === 'image/jpeg' ? 'jpg' : 'png';
      const fileName = `model-${nanoid(10)}-${Date.now()}.${fileExtension}`;
      console.log('Generated filename:', fileName);
      
      // Upload to S3
      const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read' as const, // Properly typed as ObjectCannedACL
      };
      
      console.log('Sending to S3...');
      try {
        await s3.send(new PutObjectCommand(params));
        console.log('Successfully uploaded to S3');
        
        // Generate the public URL - make sure to use us-east-2 consistently
        const fileUrl = `https://${BUCKET_NAME}.s3.us-east-2.amazonaws.com/${fileName}`;
        console.log('Generated URL:', fileUrl);
        
        return NextResponse.json({ url: fileUrl });
      } catch (s3Error) {
        console.error('S3 client error during upload:', s3Error);
        return NextResponse.json(
          { error: "S3 upload failed", details: String(s3Error) },
          { status: 500 }
        );
      }
    } catch (processingError) {
      console.error('Error processing data URL:', processingError);
      return NextResponse.json(
        { error: "Failed to process image data", details: String(processingError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return NextResponse.json(
      { error: "Failed to upload image", details: String(error) },
      { status: 500 }
    );
  }
} 