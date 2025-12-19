// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTCzlclV5vQTgeM-PbpYI9knmbteVWANg",
  authDomain: "notes-8a15a.firebaseapp.com",
  projectId: "notes-8a15a",
  storageBucket: "notes-8a15a.firebasestorage.app",
  messagingSenderId: "332233420790",
  appId: "1:332233420790:web:19ffc351baf408e70461d7",
  measurementId: "G-BGN17X4XR0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);