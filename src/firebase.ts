import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyAPmYqb2QqInOaRH-3RYbqJs0-NnZRb768",
  authDomain: "gen-lang-client-0724546995.firebaseapp.com",
  projectId: "gen-lang-client-0724546995",
  storageBucket: "gen-lang-client-0724546995.firebasestorage.app",
  messagingSenderId: "55074823343",
  appId: "1:55074823343:web:e1783b2617df32ad0d885a"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
