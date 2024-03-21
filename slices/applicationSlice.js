"use client";

import axios from 'axios';
import { DB_URL } from '@config/config';

const API_BASE_URL = DB_URL;

export const sendDatabaseLink = async (databaseLink) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/sendDatabaseLink`, { databaseLink });
    return response.data;
  } catch (error) {
    throw new Error('Error sending database link: ' + error.message);
  }
};
