import axios from 'axios';
import {getSecureItem, SECURE_STORAGE_KEYS} from "@/utils/secureStoreUtils";

class HttpService {
    /**
     * Prepare the api instance with interceptors
     * @returns {import('axios').AxiosInstance}
     */
    static api() {
        const api = axios.create({
            baseURL: "https://36c5-2402-4000-b1c2-b100-510b-306f-c4eb-7a0c.ngrok-free.app",
        });

        // Response interceptor
        // api.interceptors.response.use(
        //     (response) => response,
        //     async (error) => {
        //         // You can handle refresh token logic here if needed
        //         return Promise.reject(error);
        //     }
        // );

        // Request interceptor
        api.interceptors.request.use(async (config) => {
            try {
                const token = await getSecureItem(SECURE_STORAGE_KEYS.ACCESS_TOKEN);
                if (token && config.headers) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Error getting token:', error);
            }
            return config;
        });

        return api;
    }

    /**
     * GET request processor
     * @param {string} url - The endpoint URL
     * @returns {Promise<any>} The response data
     */
    static async get(url) {
        const api = this.api();
        return await api.get(url, {
            withCredentials: true,
        });
    }

    /**
     * POST request processor
     * @param {string} url - The endpoint URL
     * @param {object} data - The data to send
     * @returns {Promise<any>} The response data
     */
    static async post(url, data) {
        const api = this.api();
        return await api.post(url, data, {
            withCredentials: true,
        });
    }

    /**
     * PATCH request processor
     * @param {string} url - The endpoint URL
     * @param {object} data - The data to send
     * @returns {Promise<any>} The response data
     */
    static async patch(url, data) {
        const api = this.api();
        return await api.patch(url, data, {
            withCredentials: true,
        });
    }

    /**
     * DELETE request processor
     * @param {string} url - The endpoint URL
     * @returns {Promise<any>} The response data
     */
    static async delete(url) {
        const api = this.api();
        return await api.delete(url, {
            withCredentials: true,
        });
    }

    /**
     * PUT request processor
     * @param {string} url - The endpoint URL
     * @param {object} data - The data to send
     * @returns {Promise<any>} The response data
     */
    static async put(url, data) {
        const api = this.api();
        return await api.put(url, data, {
            withCredentials: true,
        });
    }
}

export default HttpService;