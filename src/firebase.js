import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_ACCESS_SUPER_CHAT_KEY,
  authDomain: "superchat-4840a.firebaseapp.com",
  projectId: "superchat-4840a",
  storageBucket: "superchat-4840a.appspot.com",
  messagingSenderId: "642692457847",
  appId: "1:642692457847:web:7ee3ff150dd65f39a56d72",
};

// 파이어베이스 초기화
const app = initializeApp(firebaseConfig);
// 구글인증과 파이어스토어DB
const googleAuth = new GoogleAuthProvider();
const db = getFirestore();

const auth = getAuth();

export { auth, googleAuth, db };
