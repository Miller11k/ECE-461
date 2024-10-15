import axios from 'axios';
import { logger } from './logFile';

/**
 * Generates a GitHub API URL based on the provided repository URL and endpoint.
 *
 * @param {string} url - The URL of the GitHub repository (e.g., https://github.com/owner/repo).
 * @param {string} [endpoint=''] - The specific API endpoint to append (e.g., 'contributors', 'branches').
 * @returns {string} The GitHub API URL for the specified endpoint.
 */
export function getGitHubAPILink(url: string, endpoint: string = ''): string {
    let urlParts = url.split('/');  // Split link into parts
    let owner = urlParts[urlParts.length - 2];  // Isolate owner
    let repo = urlParts[urlParts.length - 1];   // Isolate repository name
    
    if (repo.endsWith('.git')) {
        logger.debug(`getGitHubAPILink - Removing .git Repository name contained .git, removing it. Repository after removing .git: ${repo}`);
        repo = repo.slice(0, -4); // Remove the last 4 characters (".git")
    }    
    return `https://api.github.com/repos/${owner}/${repo}${endpoint ? '/' + endpoint : ''}`; // Return API link with endpoint
}

/**
 * Extracts contribution counts from the GitHub API response data.
 *
 * @param {any[]} data - The response data from the GitHub API, where each item represents a contributor.
 * @returns {number[]} An array of contribution counts, one for each contributor.
 */
export function getContributionCounts(data: any[]): number[] {

    let contributionCounts: number[] = [];

    // Iterate over each item in the response data.
    for (const item of data) {


        // Check if the 'contributions' field exists and is a number.
        if (typeof item.contributions === 'number') {

            contributionCounts.push(item.contributions);
        } else {
            logger.error(`getContributionCounts - Invalid Contribution Contributions field is not a number or does not exist. Item: ${JSON.stringify(item)}`);
        }
    }

    logger.debug(`getContributionCounts - Final Counts Extraction of contribution counts completed. Final contribution counts: ${JSON.stringify(contributionCounts)}`);

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

    let page = 1;
    let totalOpenIssues = 0;
    let issuesOnPage = 0;

    do {
        const issuesApiUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=100&page=${page}`;
        try {
            const response = await axios.get(issuesApiUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            issuesOnPage = response.data.length; // Number of open issues on this page
            totalOpenIssues += issuesOnPage;
            page++; // Move to the next page
        } catch (error) {
            logger.error('fetchOpenIssuesCount - API Error', [
                'Error occurred while fetching open issues.',
                `Error details: ${error}`
            ]);
            return totalOpenIssues; // Return the count gathered so far
        }
    } while (issuesOnPage === 100); // Keep going until fewer than 100 issues are returned (end of pages)

    logger.debug(`fetchOpenIssuesCount - Final Count Completed fetching open issues. Total open issues count: ${totalOpenIssues}`);
    
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
    let page = 1;
    let totalClosedIssues = 0;
    let issuesOnPage = 0;
    do {
        const issuesApiUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=closed&per_page=100&page=${page}`;
        try {
            const response = await axios.get(issuesApiUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            issuesOnPage = response.data.length; // Number of closed issues on this page
            totalClosedIssues += issuesOnPage;
            page++; // Move to the next page

        } catch (error) {
            logger.error('fetchClosedIssuesCount - API Error', [
                'Error occurred while fetching closed issues.',
                `Error details: ${error}`
            ]);
            return totalClosedIssues; // Return the count gathered so far
        }
    } while (issuesOnPage === 100); // Keep going until fewer than 100 issues are returned (end of pages)

    logger.debug(`fetchClosedIssuesCount - Final Count Completed fetching closed issues. Total closed issues count: ${totalClosedIssues}`);
    
    return totalClosedIssues;
}