import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCD-rBC1RQeqeLSVQVsGxNRHIArc0CdCiA",
  authDomain: "appmovil-dd84f.firebaseapp.com",
  projectId: "appmovil-dd84f",
  storageBucket: "appmovil-dd84f.appspot.com",
  messagingSenderId: "243514417475",
  appId: "1:243514417475:web:1ec8a46d45db0221da8ff6",
};

//Evita inicializar dos veces
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app); //Para subir imagenes de perfil