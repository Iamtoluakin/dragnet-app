import emailjs from '@emailjs/browser';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ─── EmailJS credentials ─────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID        = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_SCORE_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_WELCOME_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_WELCOME_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY        = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Save a user's sign-up email to Firestore.
 * Called once after successful sign-up / sign-in.
 */
export async function saveUserEmail(name, email, sector) {
  try {
    await addDoc(collection(db, 'users'), {
      name,
      email,
      sector,
      signedUpAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Failed to save user email:', err);
  }

  // Send welcome email
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_WELCOME_TEMPLATE_ID,
      {
        to_name:  name,
        to_email: email,
        sector:   sector,
      },
      EMAILJS_PUBLIC_KEY
    );
    console.log('Welcome email sent to', email);
  } catch (err) {
    console.error('Failed to send welcome email:', err);
  }
}

/**
 * Record a sign-in event to Firestore.
 * Called every time an existing user signs in.
 */
export async function recordSignIn(name, email) {
  try {
    await addDoc(collection(db, 'signIns'), {
      name,
      email,
      signedInAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Failed to record sign-in:', err);
  }
}

/**
 * Save a quiz score to Firestore and email it to the user.
 * @param {string} name        - User's name
 * @param {string} email       - User's email
 * @param {string} courseTitle - Name of the course / quiz
 * @param {number} score       - Score achieved (e.g. 8)
 * @param {number} total       - Total possible score (e.g. 10)
 */
export async function saveAndEmailScore(name, email, courseTitle, score, total) {
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 70;

  // 1. Save to Firestore
  try {
    await addDoc(collection(db, 'quizResults'), {
      name,
      email,
      courseTitle,
      score,
      total,
      percentage,
      passed,
      completedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Failed to save quiz result:', err);
  }

  // 2. Send email via EmailJS
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_SCORE_TEMPLATE_ID,
      {
        to_name:      name,
        to_email:     email,
        course_title: courseTitle,
        score:        `${score}/${total}`,
        percentage:   `${percentage}%`,
        result:       passed ? '✅ PASSED' : '❌ Not Yet Passed',
        message:      passed
          ? `Well done! You passed the "${courseTitle}" module with ${percentage}%. Keep it up!`
          : `You scored ${percentage}% on "${courseTitle}". A passing score is 70%. Review the material and try again — you can do it!`,
      },
      EMAILJS_PUBLIC_KEY
    );
    console.log('Score email sent to', email);
  } catch (err) {
    console.error('Failed to send score email:', err);
  }
}
