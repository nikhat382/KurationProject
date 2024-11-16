// src/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Replace with your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCm_xPEtf66iw3rjbvYoZwNhC0v2uiN1YU",
    authDomain: "assignment-81f54.firebaseapp.com",
    projectId: "assignment-81f54",
    storageBucket: "assignment-81f54.firebasestorage.app",
    messagingSenderId: "805192205251",
    appId: "1:805192205251:web:5219f4eee838595471f376",
    measurementId: "G-3ZKMFCMCHL"
  
};

// Initialize Firebase and Authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
