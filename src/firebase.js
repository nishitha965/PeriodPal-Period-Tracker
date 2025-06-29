import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDOtmU1sdZDDx2_8plLaohwh-VylbjkmpA",
  authDomain: "period-tracker-907e2.firebaseapp.com",
  projectId: "period-tracker-907e2",
  storageBucket: "period-tracker-907e2.firebasestorage.app",
  messagingSenderId: "450193548293",
  appId: "1:450193548293:web:55e07cb2aaf93fce19286c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

export { db };