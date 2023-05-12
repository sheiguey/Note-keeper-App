import { initializeApp } from "firebase/app";
import {getFirestore,collection} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAevxRk8NBe78xYLNb9UTp5NBqCxppB0oM",
  authDomain: "react-note-b0b2d.firebaseapp.com",
  projectId: "react-note-b0b2d",
  storageBucket: "react-note-b0b2d.appspot.com",
  messagingSenderId: "62170752314",
  appId: "1:62170752314:web:24a0e6727e1c2315fcdc03"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const notesCollection = collection(db, "Notes");