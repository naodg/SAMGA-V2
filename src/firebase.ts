// src/firebase.ts
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD14pfYMFzHtSZpo4K6j-uzv9H9SbqMbLg",
  authDomain: "samgabeef.firebaseapp.com",
  projectId: "samgabeef",
  storageBucket: "samgabeef.firebasestorage.app",
  messagingSenderId: "211043237282",
  appId: "1:211043237282:web:50294933424dcba04e86fb",
  measurementId: "G-JNZJXH570Z"
};


const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
