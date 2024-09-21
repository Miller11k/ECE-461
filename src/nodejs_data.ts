import { fetchJsonFromApi } from './API';
import { getGitHubAPILink, getContributionCounts } from './github_data';

/**
 * Converts a GitHub repository URL from git+ssh format to HTTPS format.
 * @param {string} repoUrl - The repository URL (e.g., git+ssh://git@github.com/browserify/browserify.git).
 * @returns {string} The cleaned-up GitHub URL (e.g., https://github.com/browserify/browserify).
 */
function convertGitUrlToHttps(repoUrl: string): string {
    if (repoUrl.startsWith('git+')) {
        // Remove 'git+' and replace 'git@' with 'https://'
        repoUrl = repoUrl.replace('git+ssh://git@', 'https://');
    }
    // Remove the '.git' extension
    if (repoUrl.endsWith('.git')) {
        repoUrl = repoUrl.slice(0, -4);
    }
    return repoUrl;
}
/**
 * Gets the API link for the Node.js repository on GitHub.
 * @param {string} url - The URL of the npm package.
 * @returns {Promise<string>}
 */
export async function getNodeJsAPILink(url: string): Promise<string> {
    let url_parts = url.split('/');
    let repo = url_parts[url_parts.length - 1];
    let registry_url = `https://registry.npmjs.org/${repo}`;
    
    try {
        const data = await fetchJsonFromApi(registry_url);

        // Extract GitHub repository link from the npm package data
        const repositoryUrl = data?.repository?.url;

        if (repositoryUrl) {
            const httpsRepoUrl = convertGitUrlToHttps(repositoryUrl);
            // console.log('Clean GitHub Repository URL:', httpsRepoUrl);
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
