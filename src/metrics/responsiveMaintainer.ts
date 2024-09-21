import { getGitHubAPILink } from '../github_data';
import { fetchJsonFromApi } from '../API';
import { getTimestampWithThreeDecimalPlaces } from './getLatency';
import { logMessage } from '../log_file';

/**
 * Calculates the Responsive Maintainer score based on the recency of updates.
 * If the package has been updated within the last 6 months, give a higher score.
 * @param {string} URL - The GitHub repository URL.
 * @returns {Promise<{ score: number; latency: number }>} The Responsive Maintainer score (0-1) and fetch latency.
 */
export async function calculateResponsiveMaintainer(URL: string): Promise<{ score: number, latency: number }> {
    logMessage('calculateResponsiveMaintainer', ['Starting Responsive Maintainer score calculation.', `Repository URL: ${URL}`]);
    
    const latency_start = getTimestampWithThreeDecimalPlaces();
    logMessage('calculateResponsiveMaintainer', ['Latency tracking started.']);

    const API_link = getGitHubAPILink(URL);
    logMessage('calculateResponsiveMaintainer', ['Constructed API link for repository data.', `API Link: ${API_link}`]);

    // Fetch repository data and issues data in one call
    const [repoData, issuesData] = await Promise.all([
        fetchJsonFromApi(API_link),
        fetchJsonFromApi(`${API_link}/issues?state=all`)
    ]);
    logMessage('calculateResponsiveMaintainer', ['Fetched repository and issues data successfully.']);

    let openIssuesCount = 0;
    let closedIssuesCount = 0;

    for (const issue of issuesData) {
        if (issue.closed_at) {
            closedIssuesCount++;
        } else {
            openIssuesCount++;
        }
    }
    logMessage('calculateResponsiveMaintainer', [`Counted issues - Open: ${openIssuesCount}, Closed: ${closedIssuesCount}`]);

    // If open_issues_count from repoData is available, use it
    openIssuesCount = repoData.open_issues_count || openIssuesCount;
    logMessage('calculateResponsiveMaintainer', ['Using open issues count from repoData.', `Open Issues Count: ${openIssuesCount}`]);

    const ratio = closedIssuesCount > 0 ? openIssuesCount / closedIssuesCount : 0; // Avoid division by zero
    const score = parseFloat((1 / (1 + ratio)).toFixed(2));
    logMessage('calculateResponsiveMaintainer', ['Calculated Responsive Maintainer score.', `Score: ${score}`]);

    // Calculate latency in milliseconds
    const latencyMs = parseFloat((getTimestampWithThreeDecimalPlaces() - latency_start).toFixed(2));
    logMessage('calculateResponsiveMaintainer', ['Calculated fetch latency.', `Latency: ${latencyMs} ms`]);

    return { score, latency: latencyMs };
}

// Sample Call
// async function main() {
//     const url = 'https://github.com/lodash/lodash'; // Replace with your desired URL
//     const { score, latency } = await calculateResponsiveMaintainer(url); // Calculate Responsive Maintainer score and latency
//     console.log(`Responsive Maintainer Score: ${score}`);
//     console.log(`Fetch Latency: ${latency} seconds`);
// }
// main();