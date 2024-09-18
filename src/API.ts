import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Fetches JSON data from a given API endpoint, with optional GitHub authentication.
 *
 * This function performs an HTTP GET request to the specified `apiLink` using Axios and returns
 * the response data in JSON format. If a GitHub token is available in the environment variables
 * (under `GITHUB_TOKEN`), it will automatically include it in the request headers for authenticated
 * access to private repositories or to increase rate limits on public GitHub repositories.
 *
 * If an error occurs during the request, the function logs the error and rethrows it
 * for further handling by the caller.
 *
 * @async
 * @function fetchJsonFromApi
 * @param {string} apiLink - The URL of the API endpoint from which to fetch data. For example, this can be
 * a GitHub API endpoint (e.g., `https://api.github.com/repos/{owner}/{repo}/contributors`).
 * @returns {Promise<any>} A promise that resolves to the JSON data from the API response, if successful.
 * The structure of the returned data depends on the API endpoint.
 * @throws {Error} Throws an error if the HTTP request fails. This error will include information
 * about the type of failure (e.g., network issues, invalid endpoint, or rate-limiting).
 *
 * @example
 * // Example usage of fetchJsonFromApi with a public GitHub API endpoint
 * const data = await fetchJsonFromApi('https://api.github.com/repos/lodash/lodash/contributors');
 * console.log(data);
 *
 * @example
 * // Example usage with GitHub authentication (token stored in .env file)
 * const data = await fetchJsonFromApi('https://api.github.com/repos/private/repo/contributors');
 * console.log(data);
 */
export async function fetchJsonFromApi(apiLink: string): Promise<any> {
    // Retrieve the GitHub token from environment variables (if available)
    const token = process.env.GITHUB_TOKEN;

    // Set up request headers for the API call
    const headers: any = {
        'Accept': 'application/vnd.github.v3+json', // Ensure API responds in v3 JSON format
    };

    // Add the Authorization header if a GitHub token is available
    if (token) {
        headers['Authorization'] = `token ${token}`;
    }

    try {
        // Perform the GET request to the API endpoint with the configured headers
        const response = await axios.get(apiLink, { headers });
        return response.data; // Return the data from the API response
    } catch (error) {
        // Log the error message for debugging purposes
        console.error('Error fetching data from API:', error);
        // Rethrow the error so the calling function can handle it appropriately
        throw error;
    }
}
