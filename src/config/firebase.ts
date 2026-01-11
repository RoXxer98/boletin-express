import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 Configuración REAL de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCuyGCrNzlWeGKXdD4GhtJME38cYU9CxJE",
  authDomain: "boletin-express.firebaseapp.com",
  projectId: "boletin-express",
  storageBucket: "boletin-express.firebasestorage.app",
  messagingSenderId: "357556273214",
  appId: "1:357556273214:web:4a0b944dee0c3bc4b9116f",
};

// 🚀 Inicializar Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Firebase Auth
export const auth = getAuth(app);

// 🗄️ Firestore DB
export const db = getFirestore(app);
