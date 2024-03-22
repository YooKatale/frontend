"use client";

import { getDatabase, ref, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import  firebaseConfig  from '@config/firebaseConfig';

const app = initializeApp(firebaseConfig, "yookatale");


const db = getDatabase(app);

const databaseRef = ref(db, 'databaseLinks');

export const sendDatabaseLink = async (databaseLink) => {
  try {
   
    await set(databaseRef, { databaseLink });
    return { success: true };
  } catch (error) {
    throw new Error('Error sending database link: ' + error.message);
  }
};


