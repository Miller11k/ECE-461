import * as fs from 'fs';
import * as path from 'path';

// Environment variables for the log file path and name
const logFilePath = process.env.LOG_FILE || path.join(__dirname, 'app.log');

// LogLevel enum for defining log severity levels
/**
 * Enum for log severity levels.
 * @enum {string}
 */
enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    CRITICAL = 'CRITICAL'
}

/**
 * Ensures the log file exists. If it does not exist, the file is created.
 * @function ensureLogFileExists
 * @returns {void}
 */
function ensureLogFileExists(): void {
    if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, '', 'utf-8');
    }
}

/**
 * Formats the current timestamp in ISO format with UTC timezone.
 * @function formatTimestamp
 * @returns {string} - The formatted timestamp as a string.
 */
function formatTimestamp(): string {
    return new Date().toISOString();
}

/**
 * Writes a log message to the log file with a specified severity level and component.
 * 
 * @function logMessage
 * @param {LogLevel} level - The log level (DEBUG, INFO, WARNING, ERROR, CRITICAL).
 * @param {string} component - The name of the component where the log is generated.
 * @param {string} message - The log message to record.
 * @returns {void}
 * 
 * @example
 * logMessage(LogLevel.INFO, "API Call", "Called GitHub for contributor data");
 */
export function logMessage(level: LogLevel, component: string, message: string): void {
    ensureLogFileExists();  // Ensure the log file exists before writing to it
    const timestamp = formatTimestamp();
    const logEntry = `[${timestamp}][${level}][${component}] ${message}\n`;
    fs.appendFileSync(logFilePath, logEntry, 'utf-8');
}

/**
 * Reads and prints log entries from the log file that match the specified log level.
 * 
 * @function printLogsByLevel
 * @param {LogLevel} level - The log level to filter (DEBUG, INFO, WARNING, ERROR, CRITICAL).
 * @returns {void}
 * 
 * @example
 * printLogsByLevel(LogLevel.ERROR);
 */
export function printLogsByLevel(level: LogLevel): void {
    ensureLogFileExists();  // Ensure the log file exists before reading it

    // Read the entire log file
    const logFileContent = fs.readFileSync(logFilePath, 'utf-8');
    const logEntries = logFileContent.split('\n');

    // Filter and print log entries that match the specified level
    logEntries.forEach((logEntry) => {
        if (logEntry.includes(`[${level}]`)) {
            console.log(logEntry);
        }
    });
}

// Example log messages to demonstrate the logging functionality
logMessage(LogLevel.INFO, "API Call", "Called GitHub for contributor data");
logMessage(LogLevel.ERROR, "Test Link", "URL was unable to connect");
