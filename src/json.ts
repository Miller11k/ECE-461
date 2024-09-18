/**
 * Interface representing a data object used for storing repository metrics.
 *
 * This interface outlines the structure of the data object that will hold various repository metrics.
 * Each metric represents an evaluation of the repository's performance in a specific area, such as
 * net score, bus factor, ramp-up, and more. All metrics can be either a number or null (if not yet evaluated).
 * Latency fields represent the time taken to compute each metric.
 * 
 * @interface DataObject
 * @typedef {DataObject}
 * @property {string} URL - The URL of the repository being evaluated.
 * @property {number | null} NetScore - The overall score of the repository, which is a composite of various metrics.
 * @property {number | null} NetScore_Latency - The time taken to calculate the NetScore.
 * @property {number | null} RampUp - A metric representing how quickly a new contributor can start working with the repository.
 * @property {number | null} RampUp_Latency - The time taken to calculate the RampUp metric.
 * @property {number | null} Correctness - A metric indicating the correctness of the repository (e.g., test coverage).
 * @property {number | null} Correctness_Latency - The time taken to calculate the Correctness metric.
 * @property {number | null} BusFactor - A metric indicating how many contributors are critical to maintaining the repository.
 * @property {number | null} BusFactor_Latency - The time taken to calculate the BusFactor metric.
 * @property {number | null} ResponsiveMaintainer - A metric representing how responsive the repository's maintainers are.
 * @property {number | null} ResponsiveMaintainer_Latency - The time taken to calculate the ResponsiveMaintainer metric.
 * @property {number | null} License - A metric evaluating the repository's license.
 * @property {number | null} License_Latency - The time taken to calculate the License metric.
 */
interface DataObject {
    URL: string;
    NetScore: number | null;
    NetScore_Latency: number | null;
    RampUp: number | null;
    RampUp_Latency: number | null;
    Correctness: number | null;
    Correctness_Latency: number | null;
    BusFactor: number | null;
    BusFactor_Latency: number | null;
    ResponsiveMaintainer: number | null;
    ResponsiveMaintainer_Latency: number | null;
    License: number | null;
    License_Latency: number | null;
}

/**
 * Initializes a DataObject for a given repository with all metrics set to null/empty.
 * 
 * This function creates a default object that adheres to the DataObject interface, where all metrics are initially
 * set to `null`, and the `URL` field is set to an empty string. This ensures that each field is explicitly initialized 
 * before any metrics are calculated or assigned. The object can then be populated with actual data as needed.
 *
 * @returns {DataObject} An initialized DataObject with default values.
 *
 * @example
 * // Example usage
 * const repoData = initJSON();
 * console.log(repoData);
 * // Outputs:
 * // {
 * //   URL: '',
 * //   NetScore: null,
 * //   NetScore_Latency: null,
 * //   RampUp: null,
 * //   RampUp_Latency: null,
 * //   Correctness: null,
 * //   Correctness_Latency: null,
 * //   BusFactor: null,
 * //   BusFactor_Latency: null,
 * //   ResponsiveMaintainer: null,
 * //   ResponsiveMaintainer_Latency: null,
 * //   License: null,
 * //   License_Latency: null
 * // }
 */
export function initJSON(): DataObject {
    // Define a default DataObject with all fields initialized to null or empty.
    const defaultData: DataObject = {
        URL: '',  // Set URL to an empty string initially
        NetScore: null,  // Initialize NetScore to null
        NetScore_Latency: null,  // Initialize NetScore_Latency to null
        RampUp: null,  // Initialize RampUp to null
        RampUp_Latency: null,  // Initialize RampUp_Latency to null
        Correctness: null,  // Initialize Correctness to null
        Correctness_Latency: null,  // Initialize Correctness_Latency to null
        BusFactor: null,  // Initialize BusFactor to null
        BusFactor_Latency: null,  // Initialize BusFactor_Latency to null
        ResponsiveMaintainer: null,  // Initialize ResponsiveMaintainer to null
        ResponsiveMaintainer_Latency: null,  // Initialize ResponsiveMaintainer_Latency to null
        License: null,  // Initialize License to null
        License_Latency: null  // Initialize License_Latency to null
    };

    // Return the default object, which will be populated later with actual data.
    return defaultData;
}

/**
 * Formats a DataObject into a string in JSON format.
 *
 * This function takes a `DataObject` and converts it into a JSON string. The resulting string is a well-formatted 
 * representation of the DataObject, which can be useful for logging or storing the object in a human-readable format.
 *
 * @param {DataObject} data - The DataObject to format as a JSON string.
 * @returns {string} A formatted JSON string representing the DataObject.
 *
 * @example
 * // Example usage
 * const repoData = initJSON();
 * const jsonString = formatJSON(repoData);
 * console.log(jsonString);
 * // Outputs: 
 * // {
 * //   "URL": "",
 * //   "NetScore": null,
 * //   "NetScore_Latency": null,
 * //   "RampUp": null,
 * //   "RampUp_Latency": null,
 * //   "Correctness": null,
 * //   "Correctness_Latency": null,
 * //   "BusFactor": null,
 * //   "BusFactor_Latency": null,
 * //   "ResponsiveMaintainer": null,
 * //   "ResponsiveMaintainer_Latency": null,
 * //   "License": null,
 * //   "License_Latency": null
 * // }
 */
export function formatJSON(data: DataObject): string {
    // Convert the DataObject to a JSON string with proper formatting.
    return JSON.stringify(data, null, 2); // Use two spaces for indentation in the output JSON string
}
