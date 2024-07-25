// firebase.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD1Tw_jGD0WEBXeH162zssr5eOqKKUtJVo",
    authDomain: "event-2b554.firebaseapp.com",
    projectId: "event-2b554",
    storageBucket: "event-2b554.appspot.com",
    messagingSenderId: "464834432321",
    appId: "1:464834432321:web:8c32c9e475dbcad201a5c0"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, query, where, getDocs, orderBy, onSnapshot };
