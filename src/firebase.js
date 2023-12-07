import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_ACCESS_SUPER_CHAT_KEY,
  authDomain: "superchat-4840a.firebaseapp.com",
  projectId: "superchat-4840a",
  storageBucket: "superchat-4840a.appspot.com",
  messagingSenderId: "642692457847",
  appId: "1:642692457847:web:7ee3ff150dd65f39a56d72",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
