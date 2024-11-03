// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAXzbh6BFVzyUhc6hr3i20eCcjaa0_gHZ4",
  authDomain: "smit-hackathon-8180d.firebaseapp.com",
  projectId: "smit-hackathon-8180d",
  storageBucket: "smit-hackathon-8180d.firebasestorage.app",
  messagingSenderId: "605806035058",
  appId: "1:605806035058:web:df219440d2599953f142eb",
  measurementId: "G-BWS3ZFERHM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app)
export { analytics, auth, firestore, storage };
