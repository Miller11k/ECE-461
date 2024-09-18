import { test_url, parse_urls } from "./src/url";
import { initJSON } from "./src/json";
import { exit } from "process";
import { fetchJsonFromApi } from './src/API';

/**
 * Parses URLs from a specified file, validates that the file is not empty,
 * and returns an array of valid URLs with extra spaces trimmed and empty lines removed.
 * 
 * @param {string} filename - The path to the file containing URLs.
 * @returns {Promise<string[]>} A promise that resolves to an array of trimmed and validated URLs.
 * 
 * @example
 * const urls = await processUrls('urls.txt');
 * console.log(urls);  // ['https://github.com/user/repo', 'https://npmjs.com/package']
 */
async function processUrls(filename: string): Promise<string[]> {
    // Parse URLs from the file.
    const urls = parse_urls(filename);

    // Check if the file is empty (i.e., no URLs found).
    if (urls.length === 0) {
        console.error('URL file provided is empty.');
        exit(1); // Exit the process with status 1 if the file is empty.
    }

    // Remove extra spaces and empty lines, then return the cleaned array of URLs.
    return urls.map(url => url.trim()).filter(url => url !== '');
}

/**
 * Validates a single URL by testing its accessibility using an HTTP HEAD request.
 * If the URL is inaccessible (i.e., does not respond with a valid HTTP status code),
 * it logs an error message and returns false.
 * 
 * @param {string} url - The URL to test for accessibility.
 * @returns {Promise<boolean>} A promise that resolves to true if the URL is valid, or false if invalid.
 * 
 * @example
 * const isValid = await validateUrl('https://github.com/user/repo');
 * console.log(isValid);  // true if the URL exists, false otherwise
 */
async function validateUrl(url: string): Promise<boolean> {
    try {
        // Test the URL for accessibility using the `test_url` function.
        const exists = await test_url(url);
        
        // Log an error if the URL is invalid.
        if (!exists) {
            console.error('Invalid link:', url);
            return false;
        }

        // Return true if the URL is valid.
        return true;
    } catch (error) {
        // Log any errors that occur during the URL validation process.
        console.error('Error testing the URL:', error);
        return false;
    }
}

/**
 * Initializes a JSON object to store repository information. The object includes various
 * metrics fields (all initialized as null) and assigns the provided URL to the `URL` field.
 * 
 * @param {string} url - The URL to be stored in the JSON object.
 * @returns {Object} An initialized JSON object with the URL set, and other fields initialized to null.
 * 
 * @example
 * const repoJson = createRepoJson('https://github.com/user/repo');
 * console.log(repoJson);
 * // Outputs: 
 * // {
 * //   URL: 'https://github.com/user/repo',
 * //   NetScore: null, RampUp: null, ... 
 * // }
 */
function createRepoJson(url: string): object {
    // Initialize the JSON object with null values for all metrics.
    let repo_JSON = initJSON();
    
    // Set the URL field in the JSON object.
    repo_JSON.URL = url;

    // Return the initialized JSON object with the URL and null metrics.
    return repo_JSON;
}

/**
 * Main function responsible for:
 * 1. Parsing URLs from a provided file.
 * 2. Validating each URL for accessibility.
 * 3. Creating and initializing a JSON object for each valid URL.
 * 
 * The function processes command-line arguments to get the file name, and exits the process
 * with an error message if no file is provided or if any URL is invalid.
 * 
 * @returns {Promise<void>} A promise that resolves when the script completes execution.
 * 
 * @example
 * // Run the script using the following command:
 * // node script.js urls.txt
 * 
 * // Expected output:
 * // - Logs errors if URLs are invalid or the file is empty.
 * // - Successfully processes URLs and creates JSON objects for valid URLs.
 */
async function main(): Promise<void> {
    // Extract command-line arguments, ignoring the first two (node and script name).
    const args = process.argv.slice(2);

    // Ensure that at least one argument (the URL file) is provided.
    if (args.length < 1) {
        console.error("Usage: ./run $URL_FILE");
        exit(1); // Exit the process with an error status if no file is provided.
    }

    // Get the filename from the first argument.
    const filename = args[0];

    try {
        // Process the URLs from the provided file.
        const urls = await processUrls(filename);

        // Iterate over each URL and validate it.
        for (const url of urls) {
            const isValid = await validateUrl(url);
            
            // If any URL is invalid, exit the process.
            if (!isValid) {
                exit(1); // Exit with an error status if a URL is invalid.
            }

            // Create a JSON object for the valid URL.
            const repoJson = createRepoJson(url);
            // Uncomment the following line to see the JSON object output for each valid URL.
            // console.log(repoJson);
        }

    } catch (error) {
        // Catch and log any errors encountered during URL processing.
        console.error('Error processing URLs:', error);
    }
}

// Invoke the main function to execute the script.
main();
