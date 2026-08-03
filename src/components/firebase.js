// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"; //This is the core function that connects app to firebase
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDRAFknKEyENpSlcLcsOwBR0xju1AdqVlw",
  authDomain: "learner-s-license-companion.firebaseapp.com",
  projectId: "learner-s-license-companion",
  storageBucket: "learner-s-license-companion.firebasestorage.app",
  messagingSenderId: "628873839094",
  appId: "1:628873839094:web:6165225eee5fcd7838c7d7",
  measurementId: "G-KZMD0WK16X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth()
export const db = getFirestore(app);
export default app