# 🎙️ AWS Polly-Only Activation Guide for DragNet

## Current Status
✅ **Backend Code**: Ready (Firebase Functions in `/functions` folder)
✅ **Frontend Code**: Configured for AWS Polly ONLY in `App.jsx` and `/src/utils/pollyNarration.js`
⏳ **Deployment**: Requires AWS + Firebase setup

## 🚨 IMPORTANT: AWS Polly ONLY Mode

Your app is now configured to use **ONLY AWS Polly** for narration.
- ✅ **No browser fallback** - Professional quality only
- ❌ **Narration will not work** until AWS Polly is activated
- 🎯 **Production-ready** - Consistent voice across all devices

## How It Works (AWS Polly ONLY)

### AWS Polly Neural Voice
- **Quality**: Professional-grade neural voice
- **Voice**: Joanna (US English female)
- **Engine**: Neural (most natural-sounding)
- **Consistency**: Same voice on all devices
- **Cost**: ~$16 per 1M characters
- **Free Tier**: 1M neural characters/month (first 12 months)
- **Status**: ⏳ Requires setup (instructions below)

## To Activate AWS Polly (Optional Premium Upgrade)

### Step 1: Get AWS Account (Free Tier Available)
1. Go to https://aws.amazon.com/
2. Click "Create an AWS Account" (Free tier includes 5M chars/month)
3. Verify your email and add payment method (won't be charged for free tier)

### Step 2: Create IAM User for Polly
1. Go to AWS Console → IAM → Users → Create User
2. Name: `dragnet-polly-user`
3. Attach policy: `AmazonPollyReadOnlyAccess`
4. Create access key → Save **Access Key ID** and **Secret Access Key**

### Step 3: Set Firebase Environment Variables
```bash
# In terminal (make sure you're logged into Firebase)
firebase login

# Set AWS credentials
firebase functions:config:set aws.access_key_id="YOUR_AWS_ACCESS_KEY_ID"
firebase functions:config:set aws.secret_access_key="YOUR_AWS_SECRET_ACCESS_KEY"
firebase functions:config:set aws.region="us-east-1"

# Verify configuration
firebase functions:config:get
```

### Step 4: Deploy Firebase Functions
```bash
cd /Users/toluakintunde/Drag-Net/drag-net/drag-net/functions
npm install  # Install dependencies

cd ..
firebase deploy --only functions
```

### Step 5: Update Firebase Config (If Needed)
Make sure your `src/firebase.js` includes:
```javascript
import { getFunctions } from 'firebase/functions';

const functions = getFunctions(app);
export { functions };
```

### Step 6: Test AWS Polly
Once deployed, the app will automatically:
1. Try AWS Polly first ✨
2. Fall back to browser TTS if Polly fails
3. Always work (never breaks)

## Costs Breakdown

### AWS Polly
- **Free Tier**: 5M characters/month standard, 1M neural (first 12 months)
- **After Free Tier**: $16/1M characters (neural)
- **Estimated Usage**: ~100 characters per narration × 1000 users = 100K chars = **$1.60/month**

### Firebase Functions
- **Free Tier**: 2M invocations/month
- **After Free Tier**: $0.40 per 1M invocations
- **Estimated Usage**: 1000 narrations/month = **FREE**

**Total Monthly Cost After Free Tier**: ~$2-5 (very affordable!)

## Why Activate Polly?

| Feature | Browser TTS | AWS Polly Neural |
|---------|-------------|------------------|
| Voice Quality | Good | ⭐ Excellent |
| Consistency | Varies by device | ⭐ Same everywhere |
| Accent Control | Limited | ⭐ Multiple accents |
| Offline Support | ✅ Yes | ❌ No |
| Mobile Support | ✅ Yes | ✅ Yes |
| Cost | FREE | ~$2-5/month |

## Testing Before Activation

**Without AWS Polly setup**, users will see:
- 🎙️ "Listen with AWS Polly" button
- ⚠️ Error message: "AWS Polly is not configured. Please deploy Firebase Functions."
- Button will not work until setup is complete

**After AWS Polly setup**, users will experience:
- ✅ High-quality professional narration
- 🎯 Consistent voice on all devices
- ⭐ Premium audio experience
- 📱 Works on mobile and desktop

## Need Help?

If you want to activate Polly, I can help you with:
1. Setting up AWS account
2. Creating IAM credentials
3. Deploying Firebase Functions
4. Testing the integration

Just let me know! 🚀
