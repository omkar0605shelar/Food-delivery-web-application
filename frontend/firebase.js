// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vingo-food-delivery-2ccbe.firebaseapp.com",
  projectId: "vingo-food-delivery-2ccbe",
  storageBucket: "vingo-food-delivery-2ccbe.firebasestorage.app",
  messagingSenderId: "973953996877",
  appId: "1:973953996877:web:853abd8b60c280a593a404"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app, auth}