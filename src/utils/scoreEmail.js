import emailjs from '@emailjs/browser';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ─── EmailJS credentials ────────────────────────────────────────────────────
// Sign up at https://www.emailjs.com (free: 200 emails/month)
// Then create a Service, Template, and copy your Public Key here (or use env vars)
const EMAILJS_SERVICE_ID  = 'service_qbis9qi';
const EMAILJS_TEMPLATE_ID = 'template_tdnksr9';
const EMAILJS_PUBLIC_KEY  = 'G8LHTQ2ig_bPm7HsD';

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
      EMAILJS_TEMPLATE_ID,
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
