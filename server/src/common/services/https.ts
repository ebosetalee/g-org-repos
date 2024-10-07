import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import logger from "./logger";

export class Https {
    private authorisation: string;
    private axiosInstance: AxiosInstance;

    constructor(baseUrl: string, authorisation: string) {
        this.authorisation = authorisation;
        this.axiosInstance = axios.create({
            baseURL: baseUrl,
            headers: {
                Authorization: `token ${this.authorisation}`,
                "Content-Type": "application/json"
            }
        });
    }

    /**
     * Makes a GET request to a GitHub API endpoint
     * @param endpoint - The specific GitHub API endpoint (e.g. "/orgs/:org/repos")
     * @param config - Optional Axios request configuration
     * @returns - The AxiosResponse containing data from GitHub API
     */
    async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            const response = await this.axiosInstance.get<T>(endpoint, config);
            return response;
        } catch (error) {
            // logger.error(`Error fetching data from at ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * Makes a POST request to a GitHub API endpoint
     * @param endpoint - The specific GitHub API endpoint
     * @param data - The data to send in the POST request
     * @param config - Optional Axios request configuration
     * @returns - The AxiosResponse containing data from GitHub API
     */
    async post<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            const response = await this.axiosInstance.post<T>(endpoint, data, config);
            return response;
        } catch (error) {
            logger.error(`Error posting data at ${endpoint}:`, error);
            throw error;
        }
    }

    // You can add other HTTP methods (PUT, DELETE) similarly, if needed.
}

export interface HttpService<T> {
	get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
	post<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
}

export default Https;
