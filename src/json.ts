import { logger } from "./logFile";

/**
 * Interface representing a data object used for storing repository metrics.
 * 
 * @interface DataObject
 */
interface DataObject {
    URL: string;                                    // The URL of the repository
    NetScore: number | null;                        // Overall net score of the repository
    NetScore_Latency: number | null;                // Latency for net score
    RampUp: number | null;                          // Ramp-up metric
    RampUp_Latency: number | null;                  // Latency for ramp-up metric
    Correctness: number | null;                     // Correctness metric
    Correctness_Latency: number | null;             // Latency for correctness metric
    BusFactor: number | null;                       // Bus factor metric
    BusFactor_Latency: number | null;               // Latency for bus factor metric
    ResponsiveMaintainer: number | null;            // Responsive maintainer score
    ResponsiveMaintainer_Latency: number | null;    // Latency for responsive maintainer score
    License: number | null;                         // License metric
    License_Latency: number | null;                 // Latency for license metric
}

/**
 * Initializes a DataObject for a given repository with all metrics set to null/empty.
 *
 * @returns {DataObject} An initialized DataObject with null metrics.
 */
export function initJSON(): DataObject {
    
    const defaultData: DataObject = {
        URL: '',
        NetScore: null,
        NetScore_Latency: null,
        RampUp: null,
        RampUp_Latency: null,
        Correctness: null,
        Correctness_Latency: null,
        BusFactor: null,
        BusFactor_Latency: null,
        ResponsiveMaintainer: null,
        ResponsiveMaintainer_Latency: null,
        License: null,
        License_Latency: null
    };
    
    return defaultData;
}

/**
 * Converts a DataObject to a single-line JSON string with spaces between each metric.
 *
 * @param {DataObject} data - The DataObject to be formatted.
 * @returns {string} A single-line JSON string representation of the DataObject with spaces between metrics.
 */
export function formatJSON(data: DataObject): string {    
    let jsonString = JSON.stringify(data);
    jsonString = jsonString.replace(/,(?=\S)/g, ', ');
    return jsonString;
}

/**
 * Extracts the GitHub issues URL (bugs.url) from any version of the package JSON data.
 *
 * @param {any} packageData - The package JSON data.
 * @returns {string | null} The GitHub issues URL if found, or null if not found.
 */
export function extractLastIssuesUrlFromJson(packageData: any): string | null {
    const versions = packageData.versions;
    let lastIssuesUrl: string | null = null;

    // Iterate through versions to find the last issues URL
    for (const version in versions) {
        if (versions.hasOwnProperty(version)) {
            const versionData = versions[version];
            if (versionData.bugs && versionData.bugs.url) {
                lastIssuesUrl = versionData.bugs.url;  // Update to the latest found bugs.url
            }
        }
    }

    if (lastIssuesUrl) {
        logger.debug(`extractLastIssuesUrlFromJson - URL Found Returning last found issues URL URL: ${lastIssuesUrl}`);
        return lastIssuesUrl;
    } else {
        logger.debug('extractLastIssuesUrlFromJson - No URL Found No GitHub issues URL found in any version. Returning null.');
        return null;
    }
}