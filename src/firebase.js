
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDYH478uVs3yHHCvbqDr8zbHPduUIfOaro",
  authDomain: "connect-dots-427318.firebaseapp.com",
  projectId: "connect-dots-427318",
  storageBucket: "connect-dots-427318.appspot.com",
  messagingSenderId: "956458045585",
  appId: "1:956458045585:web:b1f8a8766a7ff6b04a2f30",
  measurementId: "G-BCGC785TKJ"
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase);
export const googleAuthProvider = new GoogleAuthProvider();