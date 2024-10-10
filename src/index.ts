import { exit } from "process";
import { get_valid_urls } from "./URL";
import { getMetrics } from "./metrics/getMetrics";
import { logMessage } from './logFile';
import { checkGitHubToken, checkLogFile } from "./checkEnv";

/**
 * Main function to process command line arguments, fetch valid URLs,
 * gather metrics for each valid URL, and output the results.
 */
async function main() {
    logMessage('main - Start', ['Starting the main function.', 'Processing command line arguments.']);
    let args = process.argv.slice(2);
    logMessage('main - Arguments', [`Arguments received: ${JSON.stringify(args)}`, 'Checking if the number of arguments is correct.']);

    // Check for invalid number of arguments
    if (args.length !== 1) {
        logMessage('main - Invalid Arguments', ['Invalid number of arguments provided.', `Arguments length: ${args.length}`]);
        exit(1);
    }

    // Check for GitHub Token
    logMessage('main - Environment', ['Checking for GitHub Token in environment.', 'Checking for GitHub Token in environment.']);
    if(!checkGitHubToken()){
        exit(1);
    }

    // Check for Log File
    logMessage('main - Environment', ['Checking for Log File in environment.', 'Checking for Log File in environment.']);
    if(!checkLogFile()){
        exit(1);
    }

    let filename = args[0];
    logMessage('main - Filename', [`Filename received: ${filename}`, 'Proceeding to fetch valid URLs.']);

    logMessage('main - Fetching Valid URLs', ['Fetching valid URLs from the provided filename.', 'Awaiting results from get_valid_urls.']);
    let valid_urls = await get_valid_urls(filename);
    logMessage('main - Valid URLs', [`Valid URLs fetched: ${JSON.stringify(valid_urls)}`, 'Proceeding to gather metrics for each valid URL.']);

    let repo_stats = [];

    for (let i = 0; i < valid_urls.length; i++) {
        logMessage('main - Processing URL', [`Processing URL: ${valid_urls[i]}`, 'Awaiting metrics retrieval.']);
        repo_stats.push(await getMetrics(valid_urls[i]));
        logMessage('main - Metrics Retrieved', [`Metrics retrieved for URL: ${valid_urls[i]}`, 'Storing metrics in repository stats.']);
    }

    for (let i = 0; i < repo_stats.length; i++) {
        logMessage('main - Outputting Stats', [`Outputting stats for repository: ${repo_stats[i]}`, 'Printing metrics to console.']);
        console.log(repo_stats[i]);
    }

    logMessage('main - End', ['Main function completed successfully.', 'Exiting the application.']);
}

// Execute the main function
main();
