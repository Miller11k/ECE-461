import { fetchJsonFromApi } from './API';
import { getGitHubAPILink, getContributionCounts } from './github_data';

/**
 * Converts a GitHub repository URL from git+ssh format to HTTPS format.
 * 
 * @param {string} repoUrl - The repository URL in git+ssh format (e.g., 
 *                            git+ssh://git@github.com/browserify/browserify.git).
 * @returns {string} The cleaned-up GitHub URL in HTTPS format (e.g., 
 *                  https://github.com/browserify/browserify).
 */
function convertGitUrlToHttps(repoUrl: string): string {
    // Check if the URL starts with 'git+', indicating it is in git+ssh format
    if (repoUrl.startsWith('git+')) {
        // Replace 'git+ssh://git@' with 'https://'
        repoUrl = repoUrl.replace('git+ssh://git@', 'https://');
    }
    
    // Remove the '.git' extension if it exists at the end of the URL
    if (repoUrl.endsWith('.git')) {
        repoUrl = repoUrl.slice(0, -4);
    }
    
    // Return the cleaned-up HTTPS URL
    return repoUrl;
}

/**
 * Retrieves the API link for the Node.js repository on GitHub from the npm registry.
 * 
 * @param {string} url - The URL of the npm package.
 * @returns {Promise<string>} A promise that resolves to the cleaned GitHub 
 *                            repository URL or an empty string if not found.
 */
export async function getNodeJsAPILink(url: string): Promise<string> {
    // Split the URL to extract the package name
    let url_parts = url.split('/');
    let repo = url_parts[url_parts.length - 1];  // Get the last part as the repo name
    let registry_url = `https://registry.npmjs.org/${repo}`;  // Construct the npm registry URL
    
    try {
        // Fetch data from the npm registry API
        const data = await fetchJsonFromApi(registry_url);

        // Extract the GitHub repository link from the npm package data
        const repositoryUrl = data?.repository?.url;

        if (repositoryUrl) {
            // Convert the repository URL to HTTPS format
            const httpsRepoUrl = convertGitUrlToHttps(repositoryUrl);
            console.log('Clean GitHub Repository URL:', httpsRepoUrl);
            return httpsRepoUrl;  // Return the cleaned GitHub repository URL
        } else {
            console.error('No GitHub repository link found or data is incomplete.');
            return '';  // Return an empty string if no GitHub link is found
        }
    } catch (error) {
        console.error('Error fetching data from npm API:', error);
        return '';  // Return an empty string in case of an error
    }
}
