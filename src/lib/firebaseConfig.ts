// Firebase web configuration parameters
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAiQBlf7fDFkHAR_4T5SSnh_3DKs4uXklw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "velocity-ai-6d77f.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "velocity-ai-6d77f",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "velocity-ai-6d77f.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "215606488005",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:215606488005:web:47224a3a419f0c633cb9ac",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-CBZHQPLH3H"
};
