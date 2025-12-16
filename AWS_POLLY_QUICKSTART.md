# 🚀 AWS Polly Quick Start (5 Minutes)

## ✅ What's Already Done
- ✅ Backend code ready (`/functions` folder)
- ✅ Frontend integrated (App.jsx uses AWS Polly only)
- ✅ No browser fallback (professional quality only)

## 🎯 What You Need To Do (3 Steps)

### Step 1: Get AWS Credentials (2 min)
```bash
# 1. Create AWS account (if you don't have one)
https://aws.amazon.com/free

# 2. Go to IAM Console
https://console.aws.amazon.com/iam/

# 3. Create user: "dragnet-polly"
# 4. Attach policy: "AmazonPollyReadOnlyAccess"
# 5. Create access key → Save credentials
```

### Step 2: Configure Firebase (1 min)
```bash
# Login to Firebase
firebase login

# Set AWS credentials
firebase functions:config:set aws.access_key_id="PASTE_YOUR_KEY_HERE"
firebase functions:config:set aws.secret_access_key="PASTE_YOUR_SECRET_HERE"
firebase functions:config:set aws.region="us-east-1"
```

### Step 3: Deploy Functions (2 min)
```bash
# Install dependencies
cd /Users/toluakintunde/Drag-Net/drag-net/drag-net/functions
npm install

# Deploy to Firebase
cd ..
firebase deploy --only functions
```

## ✨ That's It!

Your narration will now use AWS Polly's professional neural voice (Joanna).

## 💰 Costs

**Free Tier (First 12 months)**:
- 1 million neural characters/month FREE
- ~10,000 scenario narrations/month

**After Free Tier**:
- $16 per 1 million characters
- ~$1.60 per 100,000 characters
- Estimated: $2-5/month for typical usage

## 🧪 Test It

1. Open your app: http://localhost:5173/ or https://your-app.vercel.app
2. Sign up → Complete onboarding → Start a course
3. Click "🎙️ Listen with AWS Polly" button
4. Hear Joanna's professional neural voice!

## ❓ Troubleshooting

**Error: "AWS Polly is not configured"**
- Run: `firebase functions:config:get` to check config
- Make sure you deployed: `firebase deploy --only functions`
- Check Firebase Console → Functions tab for errors

**Error: "Access Denied"**
- Check IAM permissions include `polly:SynthesizeSpeech`
- Verify credentials are correct

**Error: "Function not found"**
- Run `firebase deploy --only functions` again
- Check Firebase project is set: `firebase use`

## 📚 Full Documentation

See `AWS_POLLY_SETUP.md` for detailed setup instructions.
See `POLLY_ACTIVATION_GUIDE.md` for complete guide.

---

**Need Help?** Check the Firebase Functions logs:
```bash
firebase functions:log
```
