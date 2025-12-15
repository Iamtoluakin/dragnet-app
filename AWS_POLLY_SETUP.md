# AWS Polly Narration Setup Guide

This guide explains how to set up AWS Polly for voice narration in DragNet.

## Prerequisites

1. **AWS Account** - You need an AWS account with Polly access
2. **Firebase Project** - Your Firebase project must be on the Blaze (pay-as-you-go) plan
3. **AWS Credentials** - IAM user with Polly permissions

## Step 1: Create AWS IAM User

1. Go to AWS IAM Console
2. Create a new user with programmatic access
3. Attach the `AmazonPollyReadOnlyAccess` policy (or create custom policy)
4. Save the **Access Key ID** and **Secret Access Key**

### Custom IAM Policy (Recommended)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "polly:SynthesizeSpeech"
      ],
      "Resource": "*"
    }
  ]
}
```

## Step 2: Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

## Step 3: Initialize Firebase Functions

```bash
cd /Users/toluakintunde/Drag-Net/drag-net/drag-net
firebase init functions

# Select:
# - Use an existing project (select your DragNet project)
# - JavaScript
# - Use ESLint: No (or Yes if you prefer)
# - Install dependencies: Yes
```

## Step 4: Install Dependencies

```bash
cd functions
npm install
```

## Step 5: Configure AWS Credentials

Set your AWS credentials as Firebase environment variables:

```bash
firebase functions:config:set aws.access_key_id="YOUR_AWS_ACCESS_KEY_ID"
firebase functions:config:set aws.secret_access_key="YOUR_AWS_SECRET_ACCESS_KEY"
firebase functions:config:set aws.region="us-east-1"
```

**Important:** Never commit AWS credentials to your repository!

## Step 6: Deploy Functions

```bash
firebase deploy --only functions
```

This will deploy two functions:
- `textToSpeech` - Returns audio as base64
- `textToSpeechUrl` - Returns a signed URL (recommended for better performance)

## Step 7: Update Firebase Config in Your App

Make sure your `firebase.js` includes the Functions SDK:

```javascript
import { getFunctions } from 'firebase/functions';

const functions = getFunctions(app);
```

## Step 8: Test Locally (Optional)

```bash
# In functions directory
firebase emulators:start --only functions

# In another terminal, test the function
firebase functions:shell
```

## Usage in App

The narration is already integrated! The app will:

1. **Try AWS Polly first** (high-quality neural voices)
2. **Fallback to browser Web Speech API** if Polly fails

### Manual Usage Example

```javascript
import { narrate, stopAudio } from './utils/pollyNarration';

// Use Polly
await narrate("Hello, this is AWS Polly speaking!", {
  voiceId: 'Joanna', // US English female
  languageCode: 'en-US'
}, true);

// Use browser TTS
await narrate("Fallback to browser", {}, false);

// Stop narration
stopAudio();
```

## Available Voices

### Neural Voices (Recommended)
- **Joanna** (en-US, Female) - Default
- **Matthew** (en-US, Male)
- **Amy** (en-GB, Female)
- **Brian** (en-GB, Male)
- **Aditi** (en-IN, Female) - Good for Nigerian English
- **Raveena** (en-IN, Female)

### Standard Voices
- All neural voices also available in standard quality
- Lower cost but less natural

## Costs

AWS Polly Pricing (as of 2024):
- **Neural voices**: $16 per 1 million characters
- **Standard voices**: $4 per 1 million characters
- **Free tier**: 5 million characters/month for standard, 1 million for neural (first 12 months)

## Troubleshooting

### Function deployment fails
```bash
# Check Firebase plan
firebase projects:list

# Upgrade to Blaze plan if needed
# Go to Firebase Console > Project Settings > Usage and billing
```

### AWS credentials not working
```bash
# Verify config
firebase functions:config:get

# Reset if needed
firebase functions:config:unset aws
# Then set again
```

### CORS errors
The Firebase Functions automatically handle CORS. If you see errors:
```bash
# Redeploy functions
firebase deploy --only functions --force
```

### Audio not playing
- Check browser console for errors
- Verify Firebase Storage rules allow reads
- Ensure HTTPS is used (required for getUserMedia)

## Security Notes

1. **Never expose AWS credentials** in client-side code
2. **Use Firebase Functions** to call AWS Polly securely
3. **Implement rate limiting** in production to prevent abuse
4. **Monitor costs** in AWS Console regularly

## Alternative: ElevenLabs or Google Cloud TTS

If you prefer other TTS services:
- **ElevenLabs**: More natural voices, higher cost
- **Google Cloud TTS**: Similar to Polly, integrates with Firebase
- **Azure Cognitive Services**: Another good option

## Production Checklist

- [ ] AWS credentials configured in Firebase
- [ ] Functions deployed successfully
- [ ] Tested narration on staging
- [ ] Set up cost alerts in AWS
- [ ] Implemented rate limiting (optional)
- [ ] Added error logging and monitoring

## Support

For issues:
1. Check Firebase Functions logs: `firebase functions:log`
2. Check AWS CloudWatch logs
3. Review browser console for client errors

