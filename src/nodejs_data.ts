import { fetchJsonFromApi } from './API';
import { getGitHubAPILink, getContributionCounts } from './github_data';

/**
 * Converts a GitHub repository URL from git+ssh format to HTTPS format.
 * 
 * This function takes a repository URL in git+ssh format (commonly used in package.json files) 
 * and converts it to a standard HTTPS format that can be used for making API requests. It removes 
 * the "git+ssh://" prefix and the ".git" extension, which are typically unnecessary for API calls.
 * 
 * @param {string} repoUrl - The repository URL in git+ssh format (e.g., git+ssh://git@github.com/browserify/browserify.git).
 * @returns {string} The cleaned-up GitHub URL in HTTPS format (e.g., https://github.com/browserify/browserify).
 * 
 * @example
 * // Example usage:
 * const cleanUrl = convertGitUrlToHttps('git+ssh://git@github.com/user/repo.git');
 * console.log(cleanUrl); // Outputs: https://github.com/user/repo
 */
function convertGitUrlToHttps(repoUrl: string): string {
    // Check if the URL starts with 'git+', indicating a git+ssh format.
    if (repoUrl.startsWith('git+')) {
        // Replace the 'git+ssh://git@' portion with 'https://'.
        repoUrl = repoUrl.replace('git+ssh://git@', 'https://');
    }
    
    // If the URL ends with '.git', remove the '.git' extension for a clean URL.
    if (repoUrl.endsWith('.git')) {
        repoUrl = repoUrl.slice(0, -4); // Slice off the last four characters (".git").
    }
    
    // Return the cleaned-up URL in HTTPS format.
    return repoUrl;
}

/**
 * Fetches and logs the GitHub repository link for a given npm package.
 * 
 * This function extracts the repository name from a given npm package URL, fetches the package data from 
 * the npm registry, and retrieves the GitHub repository link from the npm metadata. It then converts the 
 * repository link to a clean HTTPS format and logs it to the console.
 * 
 * @param {string} url - The URL of the npm package (e.g., https://www.npmjs.com/package/browserify).
 * @returns {Promise<void>} A promise that resolves once the API data has been fetched and logged.
 * 
 * @example
 * // Example usage:
 * await getNodeJsAPILink('https://www.npmjs.com/package/browserify');
 */
export async function getNodeJsAPILink(url: string): Promise<void> {
    // Split the URL into parts by '/' to isolate the package name.
    let url_parts = url.split('/');
    
    // Extract the package name, which is the last part of the URL.
    let repo = url_parts[url_parts.length - 1];

    // Construct the npm registry API URL to fetch the package metadata.
    let registry_url = `https://registry.npmjs.org/${repo}`;
    
    try {
        // Fetch the package data from the npm registry API.
        const data = await fetchJsonFromApi(registry_url);

        // Log the entire npm data for debugging or inspection.
        console.log('Repository URL from npm Data:', data);
        
        // Extract the GitHub repository link from the npm package data, if available.
        const repositoryUrl = data?.repository?.url;

        // If the repository URL exists, convert it to HTTPS format.
        if (repositoryUrl) {
            const httpsRepoUrl = convertGitUrlToHttps(repositoryUrl); // Convert to clean HTTPS format.
            console.log('Clean GitHub Repository URL:', httpsRepoUrl); // Log the cleaned-up URL.
        } else {
            // Log an error if no repository URL is found in the npm data.
            console.error('No GitHub repository link found or data is incomplete.');
        }

    } catch (error) {
        // Log any errors encountered during the API call.
        console.error('Error fetching data from npm API:', error);
    }
}
