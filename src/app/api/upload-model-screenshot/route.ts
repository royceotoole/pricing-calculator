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
 * API route to upload model screenshots to S3
 */
export async function POST(request: NextRequest) {
  console.log('S3 Upload API route called at', new Date().toISOString());
  console.log('Using bucket:', BUCKET_NAME);
  console.log('Using region:', process.env.AWS_REGION || 'us-east-2');
  console.log('Access key ID exists:', !!process.env.AWS_ACCESS_KEY_ID);
  console.log('Secret access key exists:', !!process.env.AWS_SECRET_ACCESS_KEY);
  
  try {
    // Parse the request data
    let data;
    try {
      data = await request.json();
    } catch (parseError) {
      console.error('Error parsing request JSON:', parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
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
      const base64Data = dataUrl.split(',')[1];
      if (!base64Data) {
        console.error('Error: Invalid data URL format - missing base64 data');
        return NextResponse.json(
          { error: "Invalid data URL format" },
          { status: 400 }
        );
      }
      
      const buffer = Buffer.from(base64Data, 'base64');
      console.log('Converted to buffer, size:', buffer.length);
      
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