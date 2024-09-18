import * as fs from 'fs';
import { exit } from 'process';

/**
 * Tests if a given URL is accessible by making an HTTP HEAD request.
 * 
 * This function sends a HEAD request to the provided URL to check its accessibility. 
 * A successful response (HTTP status code 200-299) means the URL is accessible.
 * If the request fails or the status code falls outside the success range, the function 
 * returns false. It catches errors during the process and ensures the function resolves 
 * to a boolean result.
 *
 * @export
 * @async
 * @param {string} url - The URL to test for accessibility.
 * @returns {Promise<boolean>} A promise that resolves to true if the URL is accessible (status 200-299), otherwise false.
 * 
 * @example
 * // Example usage:
 * const isAccessible = await test_url('https://github.com/user/repo');
 * console.log(isAccessible); // Outputs: true or false
 */
export async function test_url(url: string): Promise<boolean> {
    try {
        // Send a HEAD request to the URL to check if it's accessible.
        const response = await fetch(url, { method: 'HEAD' });

        // Return true if the response is in the 200-299 range (OK status).
        return response.ok;
    } catch (error) {
        // Catch any errors and return false, indicating the URL is not accessible.
        return false;
    }
}

/**
 * Determines the type of URL based on the domain.
 * 
 * This function analyzes the provided URL and determines if it belongs to GitHub or npmjs domains.
 * It uses a regular expression to identify the domain by looking for 'github.com' or 'npmjs.com'.
 * If neither domain is matched, it returns "other".
 *
 * @export
 * @param {string} url - The URL to evaluate.
 * @returns {string} Returns "github" for GitHub URLs, "npmjs" for npmJS URLs, or "other" if neither is matched.
 * 
 * @example
 * // Example usage:
 * const urlType = url_type('https://github.com/user/repo');
 * console.log(urlType); // Outputs: "github"
 */
export function url_type(url: string): string {
    // Define a regular expression to match either 'github.com' or 'npmjs.com'.
    let regex = new RegExp("(github|npmjs)\\.com", "i");

    // Execute the regular expression on the URL.
    let match = regex.exec(url);
    
    // If a match is found, return the captured group ("github" or "npmjs").
    if (match) {
        return match[1]; // Return "github" or "npmjs" based on the match.
    }

    // If no match is found, return "other".
    return "other";
}

/**
 * Parses a file containing URLs and returns them as an array of strings.
 * 
 * This function reads the contents of a file where each line contains a URL.
 * It returns the URLs as an array of strings. If the file does not exist, the function exits 
 * the process with a status code of 1. If the file is empty, it returns an empty array.
 *
 * @param {string} filename - The path to the file containing the URLs.
 * @returns {string[] | number} An array of URLs if the file exists and has content, or `0` if the file does not exist.
 * 
 * @example
 * // Example usage:
 * const urls = parse_urls('urls.txt');
 * console.log(urls); // Outputs: ['https://github.com/user/repo', ...]
 */
export function parse_urls(filename: string): string[] {
    // Check if the file exists. If not, exit the process with status 1 (error).
    if (!fs.existsSync(filename)) {
        exit(1); // File does not exist, so exit the process with error.
    }
  
    // Read the file content as a UTF-8 string.
    const file_content = fs.readFileSync(filename, 'utf-8');
  
    // If the file content is empty, return an empty array.
    if (!file_content) {
        return [];
    }
  
    // Split the file content by newline to get an array of URLs and return it.
    return file_content.split('\n');
}
