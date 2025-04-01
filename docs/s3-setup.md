# S3 Setup for Model Screenshots

This document explains how to set up AWS S3 for storing model screenshots from the Take Place pricing calculator.

## Why S3?

We use AWS S3 to store model screenshots because:

1. **Permanent Storage**: S3 provides reliable, permanent storage for the model images
2. **Global Accessibility**: The screenshots can be viewed from anywhere, including by agents in TypeForm
3. **Cross-Device Support**: Clients can submit forms on one device, and agents can view the images on another
4. **Durability**: S3 offers 99.999999999% (11 9's) durability for stored objects

## Setup Steps

### 1. Create an S3 Bucket

1. Log in to your AWS Management Console
2. Navigate to S3 service
3. Click "Create bucket"
4. Enter a name (e.g., `take-place-model-screenshots`)
5. Select your preferred region (e.g., `us-east-1`)
6. Under "Object Ownership", select "ACLs enabled" and "Bucket owner preferred"
7. Under "Block Public Access settings", uncheck "Block all public access"
   - Acknowledge the warning (this is needed for TypeForm to access the images)
8. Configure other settings as needed
9. Click "Create bucket"

### 2. Configure CORS Settings

1. Navigate to your bucket
2. Go to the "Permissions" tab
3. Scroll down to "Cross-origin resource sharing (CORS)"
4. Click "Edit"
5. Paste the following configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

6. Click "Save changes"

### 3. Create an IAM User

1. Navigate to IAM service
2. Click "Users" and then "Create user"
3. Enter a name (e.g., `pricing-calculator-app`)
4. For access type, select "Programmatic access"
5. Click "Next: Permissions"
6. Select "Attach policies directly"
7. Add the following permissions:
   - `s3:PutObject`
   - `s3:GetObject`
   - `s3:PutObjectAcl`
8. Click "Next" and then "Create user"
9. **IMPORTANT**: Save the Access Key ID and Secret Access Key - you'll need these for your application

### 4. Configure Environment Variables

1. Edit your `.env.local` file with the credentials:

```
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=your-region
AWS_BUCKET_NAME=your-bucket-name
```

2. Make sure this file is in your `.gitignore` to keep your credentials secure

## How It Works

1. When a user clicks "Get your custom proposal" in the calculator:
   - The application captures a screenshot of the 3D model
   - The screenshot is uploaded to S3 via the `/api/upload-model-screenshot` endpoint
   - S3 returns a permanent URL for the image
   - This URL is included in the TypeForm parameters as `model_screenshot_url`

2. When an agent views the TypeForm submission:
   - They can see the model screenshot by accessing the URL
   - The image is served directly from S3

## Troubleshooting

If screenshots aren't appearing in TypeForm:

1. Check that the bucket is publicly accessible
2. Verify that CORS is properly configured
3. Ensure the IAM user has the necessary permissions
4. Check for any errors in the browser console
5. Verify that the `model_screenshot_url` parameter is being passed to TypeForm

## Security Considerations

While we have made the bucket publicly accessible to meet our needs, consider implementing more restrictive permissions in a production environment:

1. Use signed URLs with expiration times
2. Restrict access to specific domains
3. Implement an access control layer
4. Use bucket policies to further restrict access

For any questions or issues, please contact your AWS administrator. 