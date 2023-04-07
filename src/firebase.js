import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "admin-dashboard-lama-tutorial.firebaseapp.com",
    projectId: "admin-dashboard-lama-tutorial",
    storageBucket: "admin-dashboard-lama-tutorial.appspot.com",
    messagingSenderId: "1071198975068",
    appId: "1:1071198975068:web:3d9557519ada594695e299"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth()