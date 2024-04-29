// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "react-chat-cde9c.firebaseapp.com",
  projectId: "react-chat-cde9c",
  storageBucket: "react-chat-cde9c.appspot.com",
  messagingSenderId: "915460964967",
  appId: "1:915460964967:web:d4e4c2b988647e88900ac2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
