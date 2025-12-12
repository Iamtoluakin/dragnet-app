# Video Update Instructions for DragNet

## Sector-Specific Training Videos

To update the training videos for each sector, you'll need to modify the `src/App.jsx` file.

### Current Video URLs by Sector:

#### 🚔 Police Sector
- **New Video:** https://youtu.be/eeM1Ga76bA4
- **Embed URL:** `https://www.youtube.com/embed/eeM1Ga76bA4`

#### 🏛️ Civil Service Sector  
- **New Video:** https://youtube.com/shorts/3ilFN6NaHVk
- **Embed URL:** `https://www.youtube.com/embed/3ilFN6NaHVk`

#### 🎓 Student Sector
- **New Video:** https://youtube.com/shorts/8amOKakZJwk
- **Embed URL:** `https://www.youtube.com/embed/8amOKakZJwk`

#### 💼 Private Sector
- **Current Video:** Using default police video
- **Recommended:** Add a specific video for private sector

---

## How to Update Videos

### Method 1: Update in Code (Recommended)

1. Open `src/App.jsx`
2. Find the iframe section around line 2483
3. Replace the static video URL with dynamic URLs based on sector:

```jsx
<iframe
  className="w-full h-full"
  src={
    userProfile?.sector === 'police' ? 'https://www.youtube.com/embed/eeM1Ga76bA4' :
    userProfile?.sector === 'civil' ? 'https://www.youtube.com/embed/3ilFN6NaHVk' :
    userProfile?.sector === 'student' ? 'https://www.youtube.com/embed/8amOKakZJwk' :
    'https://www.youtube.com/embed/eeM1Ga76bA4'
  }
  title={`${currentCourse.title} - Training Video`}
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>
```

4. Save the file
5. Build: `npm run build`
6. Deploy: `vercel --prod`

### Method 2: Environment Variables (Future Enhancement)

Create a `.env` file with video URLs:

```
VITE_POLICE_VIDEO_URL=https://www.youtube.com/embed/eeM1Ga76bA4
VITE_CIVIL_VIDEO_URL=https://www.youtube.com/embed/3ilFN6NaHVk
VITE_STUDENT_VIDEO_URL=https://www.youtube.com/embed/8amOKakZJwk
VITE_PRIVATE_VIDEO_URL=https://www.youtube.com/embed/eeM1Ga76bA4
```

Then update the code to use environment variables.

---

## Video Requirements

### Format:
- YouTube or YouTube Shorts
- Publicly accessible
- No age restrictions

### Content Guidelines:
- Duration: 30-60 seconds (YouTube Shorts) or 2-5 minutes (regular YouTube)
- Clear audio and visuals
- Relevant to compliance/anti-corruption training
- Professional and educational tone
- Nigerian context where applicable

### Converting YouTube URLs to Embed Format:

**Regular YouTube URL:**
- From: `https://youtu.be/VIDEO_ID` or `https://www.youtube.com/watch?v=VIDEO_ID`
- To: `https://www.youtube.com/embed/VIDEO_ID`

**YouTube Shorts:**
- From: `https://youtube.com/shorts/VIDEO_ID`
- To: `https://www.youtube.com/embed/VIDEO_ID`

---

## Current Status

✅ App is deployed and working
⏳ Videos need to be updated in code
📝 Need to add narration feature (future enhancement)

## Next Steps

1. Update the video URLs in `src/App.jsx`
2. Test locally: `npm run dev`
3. Build: `npm run build`
4. Deploy: `vercel --prod`
5. Verify videos play correctly for each sector

---

## Testing Videos

After deployment, test that:
1. Police users see the police video
2. Civil service users see the civil service video  
3. Student users see the student video
4. Private sector users see the appropriate video
5. All videos load and play correctly
6. Embeds work on mobile devices

---

**Note:** You can also manage videos through a CMS or database in the future for easier updates without code changes.
