import axios from 'axios';

const API_BASE_URL = 'http://localhost:4654/api/v1'; // Your backend API base URL

// Fetch repositories from backend
export const fetchRepositories = async (org: string, page: number) => {
  const response = await axios.get(`${API_BASE_URL}/github/repos?org=${org}&page=${page}`);
  if (response.data?.message){
    return response.data.data;
  }
  return response.data;
};