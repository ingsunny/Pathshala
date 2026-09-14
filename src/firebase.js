// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const fireBaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "pathshala-486d4.firebaseapp.com",
  projectId: "pathshala-486d4",
  storageBucket: "pathshala-486d4.appspot.com",
  messagingSenderId: "869664099003",
  appId: "1:869664099003:web:30dca44d35b788115f779e",
};

// Initialize Firebase
const app = initializeApp(fireBaseConfig);

export { app };
