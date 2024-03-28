import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD0-6naVPXSMcsW9s_X0dCXJu5C_5g90Dk",
    authDomain: "yookatale-e3eed.firebaseapp.com",
    projectId: "yookatale-e3eed",
    storageBucket: "yookatale-e3eed.appspot.com",
    messagingSenderId: "910776417074",
    appId: "1:910776417074:web:de9e4d3e15d4b3145a352b",
    measurementId: "G-YGT5LE4NPV"
  };

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
