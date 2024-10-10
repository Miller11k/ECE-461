import { fetchJsonFromApi } from './API';
import { logMessage } from './logFile';

/**
 * Converts a GitHub repository URL from git+ssh format to HTTPS format.
 *
 * @param {string} repoUrl - The repository URL (e.g., git+ssh://git@github.com/browserify/browserify.git).
 * @returns {string} The cleaned-up GitHub URL (e.g., https://github.com/browserify/browserify).
 */
function convertGitUrlToHttps(repoUrl: string): string {
    logMessage('convertGitUrlToHttps', ['Converting Git URL to HTTPS format.', `Original URL: ${repoUrl}`]);

    if (repoUrl.startsWith('git+')) {
        // Remove 'git+' and replace 'git@' with 'https://'
        repoUrl = repoUrl.replace('git+ssh://git@', 'https://');
    }
    
    logMessage('convertGitUrlToHttps', ['Removing .git extension if present.', 'Processing the URL.']);
    
    // Remove the '.git' extension if present
    if (repoUrl.endsWith('.git')) {
        repoUrl = repoUrl.slice(0, -4);
    }

    return repoUrl; // Return the cleaned GitHub URL
}

/**
 * Gets the API link for the Node.js repository on GitHub from the provided npm package URL.
 *
 * @param {string} url - The URL of the npm package.
 * @returns {Promise<string>} A promise that resolves to the cleaned GitHub repository URL.
 */
export async function getNodeJsAPILink(url: string): Promise<string> {
    logMessage('getNodeJsAPILink', ['Fetching API link for Node.js repository.', `NPM package URL: ${url}`]);

    let url_parts = url.split('/');
    let repo = url_parts[url_parts.length - 1]; // Extract the repository name
    let registry_url = `https://registry.npmjs.org/${repo}`; // Construct the registry URL
    
    logMessage('getNodeJsAPILink', ['Constructed registry URL.', `Registry URL: ${registry_url}`]);

    try {
        // Fetch JSON data from the npm registry
        const data = await fetchJsonFromApi(registry_url);
        
        // Extract the GitHub repository link from the npm package data
        const repositoryUrl = data?.repository?.url;
        
        logMessage('getNodeJsAPILink', ['Extracted repository URL from package data.', `Repository URL: ${repositoryUrl}`]);

        if (repositoryUrl) {
            const httpsRepoUrl = convertGitUrlToHttps(repositoryUrl); // Convert to HTTPS format
            logMessage('getNodeJsAPILink', ['Returning cleaned GitHub repository URL.', httpsRepoUrl]);
            return httpsRepoUrl; // Return the cleaned GitHub repository URL
        } else {
            logMessage('getNodeJsAPILink', ['No GitHub repository link found or data is incomplete.', 'Returning empty string.']);
            return ''; // Return an empty string if no GitHub link is found
        }
    } catch (error) {
        logMessage('getNodeJsAPILink', ['Error fetching data from npm API.', `Error: ${error}`]);
        return ''; // Return an empty string in case of an error
    }
}