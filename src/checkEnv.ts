import * as dotenv from 'dotenv';
import { logger } from './logFile';

// Load environment variables from .env file
dotenv.config();

/**
 * Checks if the GitHub token is set in the .env file.
 * 
 * @returns {number} - Returns 1 if the GitHub token is set, otherwise 0.
 */
export function checkGitHubToken(): boolean {
    const tokenExists = !!process.env.GITHUB_TOKEN; // Check if token exists (convert to boolean)
    
    // Log the result of the token check
    logger.debug(`checkEnv - Checking GitHub Token GitHub token is ${tokenExists ? 'set' : 'not set'}, returning ${tokenExists ? `true` : `false`}`);

    return tokenExists ? true : false; // Return 1 if token is set, otherwise 0
}

/**
 * Checks if the log file path is set in the .env file.
 * 
 * @returns {number} - Returns 1 if the log file path is set, otherwise 0.
 */
export function checkLogFile(): boolean {
    const logFileExists = !!process.env.LOG_FILE; // Check if log file path exists (convert to boolean)

    // Log the result of the log file check
    logger.debug(`checkEnv - Checking Log File Log file is ${logFileExists}, returning ${logFileExists ? 'true' : 'false'}`);

    return logFileExists ? true : false; // Return 1 if log file is set, otherwise 0
}