// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoFbOGvHZcSHovfphpvXNbyZbfXgWIecI",
  authDomain: "scholarship-management-s-7ed08.firebaseapp.com",
  projectId: "scholarship-management-s-7ed08",
  storageBucket: "scholarship-management-s-7ed08.firebasestorage.app",
  messagingSenderId: "1092670240827",
  appId: "1:1092670240827:web:602fa1e6ca4bb33201441e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);