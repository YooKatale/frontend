import axios from 'axios';

const API_URL = 'http://localhost:4400'; 

export const fetchUserRole = async () => {
  const response = await axios.get(`${API_URL}/user/role`, { withCredentials: true });
  return response.data;
};
