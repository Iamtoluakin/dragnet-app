import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCkTeK2CSjNoxKs4GGs-y_-GpbZn00jL1c",
  authDomain: "drag-net.firebaseapp.com",
  projectId: "drag-net",
  storageBucket: "drag-net.firebasestorage.app",
  messagingSenderId: "413596633764",
  appId: "1:413596633764:web:3559e4579e5970f056b431",
  measurementId: "G-3WW83NVSHB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
