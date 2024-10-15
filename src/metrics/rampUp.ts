import { getGitHubAPILink } from '../githubData';
import { fetchJsonFromApi } from '../API';
import { getTimestampWithThreeDecimalPlaces } from './getLatency';
import { logger } from '../logFile';

/**
 * Calculates the RampUp score and fetch latency for GitHub repositories.
 * The smaller the repository size, the higher the score.
 * 
 * @param {string} repoURL - The GitHub repository URL.
 * @returns {Promise<{ score: number, latency: number }>} - The RampUp score and latency.
 */
export async function calculateRampUp(repoURL: string): Promise<{ score: number, latency: number }> {
    // Start latency tracking
    const latency_start = getTimestampWithThreeDecimalPlaces();
    const MAX_SIZE_KB = 50000; // Arbitrary maximum repository size in KB (50MB)
    
    // Construct GitHub API URL for repository information
    const apiLink = getGitHubAPILink(repoURL);

    // Fetch repository data from GitHub
    let repoData;
    try {
        repoData = await fetchJsonFromApi(apiLink);
        logger.debug(`calculateRampUp Fetched repository data successfully.${repoData}`);
    } catch (error) {
        logger.error(`calculateRampUp Error fetching repository data from GitHub.${error}`);
        throw new Error('Error fetching repository data from GitHub');
    }

    // Calculate repo size in KB
    const sizeInKb = repoData.size || 0;
    if (sizeInKb <= 0) {
        logger.error(`calculateRampUp 'Invalid repository size detected. Defaulting size to 0. Size: ${sizeInKb}`);
    }

    // Calculate the RampUp score (between 0 and 1)
    const score = parseFloat((1 - Math.min(sizeInKb / MAX_SIZE_KB, 1)).toFixed(1));
    logger.debug('calculateRampUp Calculated RampUp score.', `Score: ${score}`);

    // Calculate latency in milliseconds
    const latencyMs = parseFloat((getTimestampWithThreeDecimalPlaces() - latency_start).toFixed(3));
    logger.debug(`calculateRampUp', ['Calculated fetch latency. Latency: ${latencyMs} ms`);

    return { score, latency: latencyMs }; // Return score and latency
}