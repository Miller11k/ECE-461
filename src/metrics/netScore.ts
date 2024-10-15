import { logger } from '../logFile';

/**
 * Calculates the net score based on various metrics.
 * The score is calculated using weighted contributions from ramp-up time,
 * correctness, bus factor, responsive maintainer score, and license score.
 *
 * @export
 * @param {number} ramp_up_time - Calculated Ramp Up Time Score.
 * @param {number} correctness - Calculated Correctness Score.
 * @param {number} bus_factor - Calculated Bus Factor.
 * @param {number} responsive_maintainer - Responsive Maintainer Score.
 * @param {number} license - Calculated License Score.
 * @returns {Promise<number>} - The calculated net score.
 */
export async function getNetScore(
    ramp_up_time: number,
    correctness: number,
    bus_factor: number,
    responsive_maintainer: number,
    license: number
): Promise<number> {

    // Initialize net score to zero
    let net_score = 0;

    // Add weighted contributions to the net score
    net_score += (0.25) * bus_factor;         // Weighted Bus Factor Score (25%)
    net_score += (0.25) * responsive_maintainer; // Weighted Responsive Maintainer Score (25%)
    net_score += (0.2) * correctness;         // Weighted Correctness score (20%)
    net_score += (0.1) * ramp_up_time;       // Weighted Ramp-Up Time score (10%)
    net_score = license ? net_score + 0.2 : 0;          // Weighted License score (20%)


    // Round the net score to one decimal place
    net_score = parseFloat(net_score.toFixed(1));
    logger.debug(`getNetScore 'Net score rounded. Rounded net score: ${net_score}`);

    return net_score; // Return the final net score
}

/**
 * Calculates the total latency for the net score based on various latency metrics.
 *
 * @export
 * @param {number} ramp_up_latency - Latency for ramp-up time.
 * @param {number} correctness_latency - Latency for correctness.
 * @param {number} bus_factor_latency - Latency for bus factor.
 * @param {number} responsive_maintainer_latency - Latency for responsive maintainer.
 * @param {number} license_latency - Latency for license.
 * @returns {Promise<number>} - The calculated net score latency.
 */
export async function getNetScoreLatency(
    ramp_up_latency: number,
    correctness_latency: number,
    bus_factor_latency: number,
    responsive_maintainer_latency: number,
    license_latency: number
): Promise<number> {
    // Calculate total latency by summing individual latencies
    let netScore_Latency = ramp_up_latency + correctness_latency + bus_factor_latency + responsive_maintainer_latency + license_latency;

    logger.debug(`getNetScoreLatency Net score latency calculated before rounding. Net score latency: ${netScore_Latency}`);

    // Round the total latency to one decimal place
    netScore_Latency = parseFloat(netScore_Latency.toFixed(3));
    logger.debug(`getNetScoreLatency Net score latency rounded. Rounded net score latency: ${netScore_Latency}`);

    return netScore_Latency; // Return the final net score latency
}