import { logger } from '../logFile';

/**
 * Gets the current timestamp in seconds with three decimal places of precision.
 * 
 * @returns {number} The current timestamp in seconds.
 */
export function getTimestampWithThreeDecimalPlaces(): number {

    const now = new Date(); // Get the current date and time
    const milliseconds = now.getMilliseconds(); // Get the milliseconds part
    const seconds = Math.floor(now.getTime() / 1000); // Get the total seconds since the epoch

    logger.debug(`getTimestampWithThreeDecimalPlaces. Timestamp calculated. Seconds: ${seconds}, Milliseconds: ${milliseconds}`);

    // Return the timestamp in seconds, including milliseconds as a fraction
    return seconds + milliseconds / 1000;
}