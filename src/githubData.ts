import axios from 'axios';
import { logMessage } from './logFile';

/**
 * Generates a GitHub API URL based on the provided repository URL and endpoint.
 *
 * @param {string} url - The URL of the GitHub repository (e.g., https://github.com/owner/repo).
 * @param {string} [endpoint=''] - The specific API endpoint to append (e.g., 'contributors', 'branches').
 * @returns {string} The GitHub API URL for the specified endpoint.
 */
export function getGitHubAPILink(url: string, endpoint: string = ''): string {
    logMessage('getGitHubAPILink - Initializing', [
        'Starting to generate GitHub API URL.',
        `Received URL: ${url}, Endpoint: ${endpoint}`
    ]);

    let urlParts = url.split('/');  // Split link into parts
    logMessage('getGitHubAPILink - URL Split', [
        'Successfully split the URL into parts.',
        `URL Parts: ${JSON.stringify(urlParts)}`
    ]);

    let owner = urlParts[urlParts.length - 2];  // Isolate owner
    logMessage('getGitHubAPILink - Owner Extracted', [
        'Extracted repository owner.',
        `Owner: ${owner}`
    ]);

    let repo = urlParts[urlParts.length - 1];   // Isolate repository name
    logMessage('getGitHubAPILink - Repository Extracted', [
        'Extracted repository name.',
        `Repository: ${repo}`
    ]);

    // Check if repo contains ".git" and remove it if necessary
    logMessage('getGitHubAPILink - Checking for .git', [
        'Checking if the repository name contains .git.',
        `Repository before check: ${repo}`
    ]);
    
    if (repo.endsWith('.git')) {
        logMessage('getGitHubAPILink - Removing .git', [
            'Repository name contained .git, removing it.',
            `Repository after removing .git: ${repo}`
        ]);
        repo = repo.slice(0, -4); // Remove the last 4 characters (".git")
    }

    logMessage('getGitHubAPILink - URL Construction', [
        'Constructing the final API URL.',
        `Final API URL: https://api.github.com/repos/${owner}/${repo}${endpoint ? '/' + endpoint : ''}`
    ]);
    
    return `https://api.github.com/repos/${owner}/${repo}${endpoint ? '/' + endpoint : ''}`; // Return API link with endpoint
}

/**
 * Extracts contribution counts from the GitHub API response data.
 *
 * @param {any[]} data - The response data from the GitHub API, where each item represents a contributor.
 * @returns {number[]} An array of contribution counts, one for each contributor.
 */
export function getContributionCounts(data: any[]): number[] {
    logMessage('getContributionCounts - Initialization', [
        'Starting to extract contribution counts from API response data.',
        `Received data length: ${data.length}`
    ]);

    let contributionCounts: number[] = [];

    // Iterate over each item in the response data.
    for (const item of data) {
        logMessage('getContributionCounts - Iterating Item', [
            'Processing an item from the API response.',
            `Current item: ${JSON.stringify(item)}`
        ]);

        // Check if the 'contributions' field exists and is a number.
        if (typeof item.contributions === 'number') {
            logMessage('getContributionCounts - Valid Contribution', [
                'Found valid contributions field.',
                `Contributions: ${item.contributions}`
            ]);
            contributionCounts.push(item.contributions);
        } else {
            logMessage('getContributionCounts - Invalid Contribution', [
                'Contributions field is not a number or does not exist.',
                `Item: ${JSON.stringify(item)}`
            ]);
        }
    }

    logMessage('getContributionCounts - Final Counts', [
        'Extraction of contribution counts completed.',
        `Final contribution counts: ${JSON.stringify(contributionCounts)}`
    ]);

    return contributionCounts; // Return the array of contribution counts.
}

/**
 * Fetches the number of open issues for a given GitHub repository.
 *
 * @param {string} owner - The GitHub owner of the repository.
 * @param {string} repo - The name of the repository.
 * @returns {Promise<number>} - The number of open issues.
 */
export async function fetchOpenIssuesCount(owner: string, repo: string): Promise<number> {
    logMessage('fetchOpenIssuesCount - Initialization', [
        'Starting to fetch open issues count for the repository.',
        `Owner: ${owner}, Repository: ${repo}`
    ]);

    let page = 1;
    logMessage('fetchOpenIssuesCount - Page Initialization', [
        'Initializing page count for API requests.',
        `Starting with page: ${page}`
    ]);

    let totalOpenIssues = 0;
    logMessage('fetchOpenIssuesCount - Total Open Issues', [
        'Initializing total open issues counter.',
        `Total open issues so far: ${totalOpenIssues}`
    ]);

    let issuesOnPage = 0;
    logMessage('fetchOpenIssuesCount - Issues on Page', [
        'Initializing issues count for the current page.',
        `Issues on current page: ${issuesOnPage}`
    ]);

    do {
        const issuesApiUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=100&page=${page}`;
        logMessage('fetchOpenIssuesCount - API URL', [
            'Constructing API URL for fetching issues.',
            `API URL: ${issuesApiUrl}`
        ]);

        try {
            logMessage('fetchOpenIssuesCount - API Call', [
                'Making API call to fetch open issues.',
                `Fetching from URL: ${issuesApiUrl}`
            ]);

            const response = await axios.get(issuesApiUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            logMessage('fetchOpenIssuesCount - API Response', [
                'Received response from API.',
                `Response data length: ${response.data.length}`
            ]);

            issuesOnPage = response.data.length; // Number of open issues on this page
            logMessage('fetchOpenIssuesCount - Issues Count on Page', [
                'Count of open issues on the current page.',
                `Issues on page ${page}: ${issuesOnPage}`
            ]);

            totalOpenIssues += issuesOnPage;
            logMessage('fetchOpenIssuesCount - Total Open Issues Update', [
                'Updating total open issues counter.',
                `Total open issues now: ${totalOpenIssues}`
            ]);

            page++; // Move to the next page
            logMessage('fetchOpenIssuesCount - Next Page', [
                'Incrementing page count for the next request.',
                `Next page will be: ${page}`
            ]);
        } catch (error) {
            logMessage('fetchOpenIssuesCount - API Error', [
                'Error occurred while fetching open issues.',
                `Error details: ${error}`
            ]);
            console.error('Error fetching open issues:', error);
            return totalOpenIssues; // Return the count gathered so far
        }
    } while (issuesOnPage === 100); // Keep going until fewer than 100 issues are returned (end of pages)

    logMessage('fetchOpenIssuesCount - Final Count', [
        'Completed fetching open issues.',
        `Total open issues count: ${totalOpenIssues}`
    ]);
    
    return totalOpenIssues;
}

/**
 * Fetches the number of closed issues for a given GitHub repository.
 *
 * @param {string} owner - The GitHub owner of the repository.
 * @param {string} repo - The name of the repository.
 * @returns {Promise<number>} - The number of closed issues.
 */
export async function fetchClosedIssuesCount(owner: string, repo: string): Promise<number> {
    logMessage('fetchClosedIssuesCount - Initialization', [
        'Starting to fetch closed issues count for the repository.',
        `Owner: ${owner}, Repository: ${repo}`
    ]);

    let page = 1;
    logMessage('fetchClosedIssuesCount - Page Initialization', [
        'Initializing page count for API requests.',
        `Starting with page: ${page}`
    ]);

    let totalClosedIssues = 0;
    logMessage('fetchClosedIssuesCount - Total Closed Issues', [
        'Initializing total closed issues counter.',
        `Total closed issues so far: ${totalClosedIssues}`
    ]);

    let issuesOnPage = 0;
    logMessage('fetchClosedIssuesCount - Issues on Page', [
        'Initializing issues count for the current page.',
        `Issues on current page: ${issuesOnPage}`
    ]);

    do {
        const issuesApiUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=closed&per_page=100&page=${page}`;
        logMessage('fetchClosedIssuesCount - API URL', [
            'Constructing API URL for fetching closed issues.',
            `API URL: ${issuesApiUrl}`
        ]);

        try {
            logMessage('fetchClosedIssuesCount - API Call', [
                'Making API call to fetch closed issues.',
                `Fetching from URL: ${issuesApiUrl}`
            ]);

            const response = await axios.get(issuesApiUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            logMessage('fetchClosedIssuesCount - API Response', [
                'Received response from API.',
                `Response data length: ${response.data.length}`
            ]);

            issuesOnPage = response.data.length; // Number of closed issues on this page
            logMessage('fetchClosedIssuesCount - Issues Count on Page', [
                'Count of closed issues on the current page.',
                `Issues on page ${page}: ${issuesOnPage}`
            ]);

            totalClosedIssues += issuesOnPage;
            logMessage('fetchClosedIssuesCount - Total Closed Issues Update', [
                'Updating total closed issues counter.',
                `Total closed issues now: ${totalClosedIssues}`
            ]);

            page++; // Move to the next page
            logMessage('fetchClosedIssuesCount - Next Page', [
                'Incrementing page count for the next request.',
                `Next page will be: ${page}`
            ]);
        } catch (error) {
            logMessage('fetchClosedIssuesCount - API Error', [
                'Error occurred while fetching closed issues.',
                `Error details: ${error}`
            ]);
            console.error('Error fetching closed issues:', error);
            return totalClosedIssues; // Return the count gathered so far
        }
    } while (issuesOnPage === 100); // Keep going until fewer than 100 issues are returned (end of pages)

    logMessage('fetchClosedIssuesCount - Final Count', [
        'Completed fetching closed issues.',
        `Total closed issues count: ${totalClosedIssues}`
    ]);
    
    return totalClosedIssues;
}