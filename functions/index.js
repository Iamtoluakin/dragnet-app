const functions = require('firebase-functions');
const { PollyClient, SynthesizeSpeechCommand } = require('@aws-sdk/client-polly');
const admin = require('firebase-admin');

admin.initializeApp();

// Initialize AWS Polly client
const pollyClient = new PollyClient({
  region: functions.config().aws?.region || 'us-east-1',
  credentials: {
    accessKeyId: functions.config().aws?.access_key_id,
    secretAccessKey: functions.config().aws?.secret_access_key,
  },
});

/**
 * Cloud Function to convert text to speech using AWS Polly
 * POST request with body: { text: string, voiceId?: string, languageCode?: string }
 */
exports.textToSpeech = functions.https.onCall(async (data, context) => {
  try {
    // Validate input
    if (!data.text || typeof data.text !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a "text" argument.'
      );
    }

    // Limit text length to prevent abuse (adjust as needed)
    if (data.text.length > 3000) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Text exceeds maximum length of 3000 characters.'
      );
    }

    const params = {
      Text: data.text,
      OutputFormat: 'mp3',
      VoiceId: data.voiceId || 'Joanna', // Default to Joanna (US English female)
      Engine: 'neural', // Use neural engine for better quality
      LanguageCode: data.languageCode || 'en-US',
    };

    // Call AWS Polly
    const command = new SynthesizeSpeechCommand(params);
    const response = await pollyClient.send(command);

    // Convert audio stream to base64
    const audioStream = response.AudioStream;
    const chunks = [];
    
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    
    const audioBuffer = Buffer.concat(chunks);
    const audioBase64 = audioBuffer.toString('base64');

    // Return audio as base64 string
    return {
      success: true,
      audio: audioBase64,
      contentType: 'audio/mpeg',
    };
  } catch (error) {
    console.error('Error in textToSpeech function:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to generate speech',
      error.message
    );
  }
});

/**
 * Alternative: Return a pre-signed URL instead of base64 (more efficient for large audio)
 * Requires storing audio in Firebase Storage or S3 first
 */
exports.textToSpeechUrl = functions.https.onCall(async (data, context) => {
  try {
    if (!data.text || typeof data.text !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a "text" argument.'
      );
    }

    if (data.text.length > 3000) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Text exceeds maximum length of 3000 characters.'
      );
    }

    const params = {
      Text: data.text,
      OutputFormat: 'mp3',
      VoiceId: data.voiceId || 'Joanna',
      Engine: 'neural',
      LanguageCode: data.languageCode || 'en-US',
    };

    const command = new SynthesizeSpeechCommand(params);
    const response = await pollyClient.send(command);

    // Store in Firebase Storage
    const bucket = admin.storage().bucket();
    const fileName = `narration/${Date.now()}-${Math.random().toString(36).substring(7)}.mp3`;
    const file = bucket.file(fileName);

    // Convert stream to buffer and upload
    const audioStream = response.AudioStream;
    const chunks = [];
    
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    
    const audioBuffer = Buffer.concat(chunks);
    
    await file.save(audioBuffer, {
      metadata: {
        contentType: 'audio/mpeg',
      },
    });

    // Get signed URL (valid for 1 hour)
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    return {
      success: true,
      url: url,
      contentType: 'audio/mpeg',
    };
  } catch (error) {
    console.error('Error in textToSpeechUrl function:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to generate speech',
      error.message
    );
  }
});
