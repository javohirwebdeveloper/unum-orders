// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWhMmrN5DRGibjRTUxj0PYWAnX9QQW-SQ",
  authDomain: "unum-2a3d2.firebaseapp.com",
  projectId: "unum-2a3d2",
  storageBucket: "unum-2a3d2.appspot.com",
  messagingSenderId: "353335559279",
  appId: "1:353335559279:web:e5c4342e2cee07eb90799a",
  measurementId: "G-KBVBYN6DYB",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
