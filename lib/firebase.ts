// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Configure Firestore with explicit settings for nam5 region
const db = getFirestore(app);

// Add connection state listener
if (typeof window !== 'undefined') {
  const connectedRef = ref(app, '.info/connected');
  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      console.log('Firebase: Connected to nam5 region');
    } else {
      console.log('Firebase: Not connected to nam5 region');
    }
  });

  // Enable offline persistence with specific settings
  enableIndexedDbPersistence(db, {
    synchronizeTabs: true  // Enable multi-tab support
  })
    .then(() => {
      console.log("Firebase: Offline persistence enabled with multi-tab support");
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Firebase: Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('Firebase: The current browser does not support all of the features required to enable persistence.');
      } else {
        console.error('Firebase: Error enabling persistence:', err);
      }
    });
}

export { db }; 