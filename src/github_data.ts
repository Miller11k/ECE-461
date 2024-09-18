import * as sqlite3 from 'sqlite3';
import { fetchJsonFromApi } from "./API";

/**
 * Generates a GitHub API URL based on the provided repository URL and a specific API endpoint.
 *
 * This function extracts the repository owner and name from a standard GitHub repository URL (e.g., 
 * `https://github.com/owner/repo`) and constructs the corresponding GitHub API URL. 
 * It appends an optional API endpoint, such as 'contributors' or 'branches', to the base URL.
 *
 * @param {string} url - The URL of the GitHub repository (e.g., `https://github.com/owner/repo`).
 * It must be a standard repository URL.
 * @param {string} [endpoint=''] - The specific API endpoint to append (e.g., 'contributors', 'branches'). 
 * Defaults to an empty string if no endpoint is provided.
 * @returns {string} The GitHub API URL for the specified repository and endpoint.
 *
 * @example
 * // Example usage to get the contributors API endpoint for a repo
 * const apiLink = getGitHubAPILink('https://github.com/lodash/lodash', 'contributors');
 * console.log(apiLink); // Outputs: "https://api.github.com/repos/lodash/lodash/contributors"
 *
 * @example
 * // Example usage to get the base API URL for a repo (no specific endpoint)
 * const apiLink = getGitHubAPILink('https://github.com/expressjs/express');
 * console.log(apiLink); // Outputs: "https://api.github.com/repos/expressjs/express"
 */
export function getGitHubAPILink(url: string, endpoint: string = ''): string {
    // Split the URL to extract the repository owner and name
    let urlParts = url.split('/');  // Split link into parts
    let owner = urlParts[urlParts.length - 2];  // Isolate owner
    let repo = urlParts[urlParts.length - 1];   // Isolate repository name

    // Construct and return the GitHub API URL with the specified endpoint
    return `https://api.github.com/repos/${owner}/${repo}${endpoint ? '/' + endpoint : ''}`;
}

/**
 * Extracts contribution counts from the GitHub API response data.
 *
 * This function takes an array of contributor objects (returned by the GitHub API) and
 * extracts the number of contributions for each contributor. The `contributions` field
 * is expected to be a number representing the total number of commits made by each contributor.
 *
 * The function returns an array of contribution counts, ordered in the same way as the input array.
 * It ignores any contributors where the `contributions` field is missing or not a valid number.
 *
 * @param {any[]} data - The response data from the GitHub API. Each object in the array 
 * represents a contributor and should include a `contributions` field with the number of commits.
 * @returns {number[]} An array of contribution counts, with one entry for each valid contributor.
 * If a contributor has a missing or invalid `contributions` field, they are skipped.
 *
 * @example
 * // Example usage with mock GitHub API data
 * const contributors = [
 *   { login: 'user1', contributions: 100 },
 *   { login: 'user2', contributions: 50 },
 *   { login: 'user3', contributions: 30 }
 * ];
 * const counts = getContributionCounts(contributors);
 * console.log(counts); // Outputs: [100, 50, 30]
 *
 * @example
 * // Handling cases where the `contributions` field is missing or invalid
 * const contributors = [
 *   { login: 'user1', contributions: 100 },
 *   { login: 'user2', contributions: 'invalid' },  // Invalid contribution count
 *   { login: 'user3', contributions: 30 }
 * ];
 * const counts = getContributionCounts(contributors);
 * console.log(counts); // Outputs: [100, 30]
 */
export function getContributionCounts(data: any[]): number[] {
    // Initialize an empty array to store contribution counts
    let contributionCounts: number[] = [];

    // Iterate over each item in the response data
    for (const item of data) {
        // Check if the 'contributions' field exists and is a valid number
        if (typeof item.contributions === 'number') {
            contributionCounts.push(item.contributions);
        }
    }

    // Return the array of contribution counts
    return contributionCounts;
}
