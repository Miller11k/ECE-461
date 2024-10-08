import { getGitHubAPILink } from '../githubData';
import { fetchJsonFromApi } from '../API';
import { getTimestampWithThreeDecimalPlaces } from './getLatency';
import { logMessage } from '../logFile';

/**
 * Calculates the Responsive Maintainer score based on the recency of updates.
 * A higher score is given if the package has been updated within the last 6 months.
 * 
 * @param {string} URL - The GitHub repository URL.
 * @returns {Promise<{ score: number; latency: number }>} - The Responsive Maintainer score (0-1) and fetch latency.
 */
export async function calculateResponsiveMaintainer(URL: string): Promise<{ score: number; latency: number }> {
    logMessage('calculateResponsiveMaintainer', ['Starting Responsive Maintainer score calculation.', `Repository URL: ${URL}`]);
    
    // Start latency tracking
    const latency_start = getTimestampWithThreeDecimalPlaces();
    logMessage('calculateResponsiveMaintainer', ['Latency tracking started.']);

    // Construct the GitHub API link for the repository
    const API_link = getGitHubAPILink(URL);
    logMessage('calculateResponsiveMaintainer', ['Constructed API link for repository data.', `API Link: ${API_link}`]);

    // Fetch repository data and issues data concurrently
    const [repoData, issuesData] = await Promise.all([
        fetchJsonFromApi(API_link),
        fetchJsonFromApi(`${API_link}/issues?state=all`)
    ]);
    logMessage('calculateResponsiveMaintainer', ['Fetched repository and issues data successfully.']);

    let openIssuesCount = 0;
    let closedIssuesCount = 0;

    // Count open and closed issues
    for (const issue of issuesData) {
        if (issue.closed_at) {
            closedIssuesCount++;
        } else {
            openIssuesCount++;
        }
    }
    logMessage('calculateResponsiveMaintainer', [`Counted issues - Open: ${openIssuesCount}, Closed: ${closedIssuesCount}`]);

    // Use open_issues_count from repoData if available
    openIssuesCount = repoData.open_issues_count || openIssuesCount;
    logMessage('calculateResponsiveMaintainer', ['Using open issues count from repoData.', `Open Issues Count: ${openIssuesCount}`]);

    // Calculate the ratio of open to closed issues
    const ratio = closedIssuesCount > 0 ? openIssuesCount / closedIssuesCount : 0; // Avoid division by zero
    const score = parseFloat((1 / (1 + ratio)).toFixed(2)); // Calculate score
    logMessage('calculateResponsiveMaintainer', ['Calculated Responsive Maintainer score.', `Score: ${score}`]);

    // Calculate latency in milliseconds
    const latencyMs = parseFloat((getTimestampWithThreeDecimalPlaces() - latency_start).toFixed(3));
    logMessage('calculateResponsiveMaintainer', ['Calculated fetch latency.', `Latency: ${latencyMs} ms`]);

    return { score, latency: latencyMs }; // Return score and latency
}