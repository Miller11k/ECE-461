import { cpus } from 'os';
import { logger } from './logFile';

/**
 * Retrieves the number of CPU cores available on the system.
 *
 * @returns {number} The count of CPU cores.
 */
export function getNumberOfCores(): number {
    const cores = cpus().length;

    logger.debug(`Number of CPU cores: ${cores} Returning the core count.`);

    return cores; // Return the count of CPU cores
}