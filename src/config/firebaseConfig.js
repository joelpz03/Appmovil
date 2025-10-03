import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCD-rBC1RQeqeLSVQVsGxNRHIArc0CdCiA",
  authDomain: "appmovil-dd84f.firebaseapp.com",
  projectId: "appmovil-dd84f",
  storageBucket: "appmovil-dd84f.firebasestorage.app",
  messagingSenderId: "243514417475",
  appId: "1:243514417475:web:1ec8a46d45db0221da8ff6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);