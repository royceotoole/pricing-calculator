import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from 'nanoid';

// S3 client configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
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
  try {
    // Parse the request data
    const data = await request.json();
    const { dataUrl } = data;
    
    if (!dataUrl) {
      return NextResponse.json(
        { error: "Missing dataUrl parameter" },
        { status: 400 }
      );
    }
    
    // Extract the binary data from the data URL
    const base64Data = dataUrl.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Extract the MIME type
    const mimeMatch = dataUrl.match(/data:([^;]+);/);
    const contentType = mimeMatch ? mimeMatch[1] : 'image/png';
    
    // Generate a unique filename
    const fileExtension = contentType === 'image/jpeg' ? 'jpg' : 'png';
    const fileName = `model-${nanoid(10)}-${Date.now()}.${fileExtension}`;
    
    // Upload to S3
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read' as const, // Properly typed as ObjectCannedACL
    };
    
    await s3.send(new PutObjectCommand(params));
    
    // Generate the public URL
    const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`;
    
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
} 