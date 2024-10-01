import axios from 'axios';

const API_BASE_URL = 'http://localhost:4654/api/v1';

// Fetch repositories from backend
export const fetchRepositories = async (org: string, page: number) => {
    const response = await axios.get(`${API_BASE_URL}/github/repos?org=${org}&page=${page}`);
    if (response.data?.message) {
        return response.data.data;
    }
    return response.data;
};

// store expanded as true or false
export const storeExpanded = async (orgName: string, repo_id: number, expanded: boolean) => {
    const payload = { repo_id, orgName, expanded };

    const response = await axios.post(`${API_BASE_URL}/github/store`, payload);
    if (response.data?.message) {
        return response.data;
    }

    return response.data;
}