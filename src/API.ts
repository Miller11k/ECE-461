import axios from 'axios';
import * as dotenv from 'dotenv';
import { logger } from './logFile';
dotenv.config();

/**
 * Fetches JSON data from a given API endpoint.
 *
 * This function performs an HTTP GET request to the specified `apiLink` 
 * and returns the response data in JSON format. If an error occurs during 
 * the request, it logs the error and returns an empty object if the error 
 * is for the "license" endpoint.
 *
 * @async
 * @param {string} apiLink - The URL of the API endpoint from which to fetch data.
 * @returns {Promise<any>} - A promise that resolves to the JSON data 
 * from the API response or an empty object if there is an error for 
 * the "license" endpoint.
 * @throws {Error} - Throws an error if the HTTP request fails and the 
 * endpoint is not "license".
 */
export async function fetchJsonFromApi(apiLink: string): Promise<any> {
    // Get the token from environment variables
    const token = process.env.GITHUB_TOKEN;
    logger.debug(`fetchJsonFromApi - Start Preparing to fetch JSON data from the API. API link: ${apiLink}`);

    // Set up headers for the API request
    const headers: any = {
        'Accept': 'application/vnd.github.v3+json',
    };

    // Add authorization token if available
    if (token) {
        headers['Authorization'] = `token ${token}`;
    } else {
        logger.error('fetchJsonFromApi - Authorization No authorization token found. Proceeding without authorization token.');
    }

    try {
        const response = await axios.get(apiLink, { headers });
        logger.debug('fetchJsonFromApi - Response Received Successfully received data from the API. Data successfully fetched and returned as JSON.');
        return response.data; // Return the response as JSON
    } catch (error: any) {
        logger.error('fetchJsonFromApi - Error Error occurred during the API request. Error message: ${error.message}');

        // If the error is from the license endpoint, return an empty object
        if (apiLink.includes('/license')) {
            logger.error('fetchJsonFromApi - License Error Returning empty object due to error on the license endpoint. No data found or the request failed.');
            return {}; // Return empty dataset if no data can be retrieved
        }

        throw new Error(`API request failed: ${error.message}`); // Rethrow the error for other cases
    }
}