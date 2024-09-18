import { test_url, parse_urls } from "./../src/url";
import { initJSON } from "../src/json";
import { exit } from "process";

/**
 * Parses URLs from the specified file and validates them.
 *
 * This function reads a file containing URLs, trims any whitespace, and removes empty lines.
 * It throws an error if the file is empty or does not contain any valid URLs.
 *
 * @param {string} filename - The path to the file containing URLs, each on a new line.
 * @returns {Promise<string[]>} A promise that resolves to an array of valid, non-empty, trimmed URLs.
 * If the file is empty or contains only invalid entries, the function exits with a status of 1.
 *
 * @example
 * // Example usage to process URLs from a file
 * const urls = await processUrls('urls.txt');
 * console.log(urls); // Outputs: ['https://example.com', 'https://another-example.com']
 */
async function processUrls(filename: string): Promise<string[]> {
    const urls = parse_urls(filename);

    if (urls.length === 0) {
        console.error('URL file provided is empty.');
        exit(1);
    }

    return urls.map(url => url.trim()).filter(url => url !== ''); // Remove empty lines
}

/**
 * Validates a single URL by checking if it exists.
 *
 * This function tests whether the provided URL is reachable by calling `test_url`.
 * If the URL is invalid or unreachable, it logs an error message and returns false.
 *
 * @param {string} url - The URL to test for existence and validity.
 * @returns {Promise<boolean>} A promise that resolves to true if the URL exists, or false if it does not.
 * If an error occurs during testing, the function logs the error and also returns false.
 *
 * @example
 * // Example usage to validate a URL
 * const isValid = await validateUrl('https://example.com');
 * console.log(isValid); // Outputs: true if valid, false if invalid
 */
async function validateUrl(url: string): Promise<boolean> {
    try {
        const exists = await test_url(url);
        if (!exists) {
            console.error('Invalid link:', url);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error testing the URL:', error);
        return false;
    }
}

/**
 * Initializes and returns a JSON object representing a repository with the provided URL.
 *
 * This function creates a new JSON object using `initJSON()` and sets its `URL` field
 * to the provided URL. The returned object can be used to represent metadata for a repository.
 *
 * @param {string} url - The URL of the repository to include in the JSON object.
 * @returns {Object} A JSON object with the `URL` field set to the provided URL.
 *
 * @example
 * // Example usage to create a repository JSON object
 * const repoJson = createRepoJson('https://example.com/repo');
 * console.log(repoJson); // Outputs: { URL: 'https://example.com/repo' }
 */
function createRepoJson(url: string): object {
    let repo_JSON = initJSON(); // Initialize JSON object
    repo_JSON.URL = url; // Set the URL field
    return repo_JSON;
}

/**
 * Main function to parse, validate, and process URLs from a file.
 *
 * This function coordinates the entire process of reading URLs from a file,
 * validating each one, and creating a repository JSON object for each valid URL.
 * If any URL is invalid, the process exits with an error. The function expects
 * the filename to be provided as a command-line argument.
 *
 * @returns {Promise<void>} A promise that resolves when the script finishes execution.
 *
 * @example
 * // Example usage from the command line:
 * // $ node script.js urls.txt
 *
 * @throws {Error} If the command-line argument (filename) is missing or if an error occurs during URL processing.
 */
async function main(): Promise<void> {
    const args = process.argv.slice(2); // Get command-line arguments
    if (args.length < 1) {
        console.error("Usage: ./ run $URL_FILE");
        exit(1);
    }

    const filename = args[0]; // The filename provided as a command-line argument

    try {
        const urls = await processUrls(filename);

        for (const url of urls) {
            const isValid = await validateUrl(url);
            if (!isValid) {
                exit(1); // Exit if any URL is invalid
            }

            const repoJson = createRepoJson(url);
            // You can handle repoJson further here if needed
        }

    } catch (error) {
        console.error('Error processing URLs:', error);
    }
}

// Call the main function to start the process
main();
