import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAk_Gv_YaQdDdBeYLTR8jDG82YOG6Roxyw",
  authDomain: "task-manager-3ee82.firebaseapp.com",
  projectId: "task-manager-3ee82",
  storageBucket: "task-manager-3ee82.firebasestorage.app",
  messagingSenderId: "114721603520",
  appId: "1:114721603520:web:1a01abaa089293459dd225",
  measurementId: "G-6N0VKV3QTW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);