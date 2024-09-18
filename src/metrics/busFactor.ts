import { getGitHubAPILink, getContributionCounts } from './../github_data';
import { fetchJsonFromApi } from './../API';

/**
 * Calculates the Bus Factor of a repository based on the contribution distribution.
 * The Bus Factor represents the minimum number of key contributors required
 * to maintain the project, relative to the total number of contributors.
 * 
 * The Bus Factor is calculated by determining the minimal number of contributors
 * that account for the majority of contributions (95% by default) and
 * assessing the remaining contributor count as the project's robustness
 * against losing key contributors.
 * 
 * @param {any[]} data - Array containing contributor information from GitHub API.
 * Each element represents a contributor with their commit counts.
 * @returns {number} - The calculated Bus Factor, rounded to the nearest tenth.
 */
export function getBusFactor(data: any[]): number {
  let threshold = 0.95;   // Define a threshold to cover 95% of total contributions
  // Note: A threshold of 0.975 might apply in some cases, based on sample numbers

  let num_committers = data.length; // Get number of contributors in the repo

  let commit_count = getContributionCounts(data); // Get an array of commit counts per contributor

  let total_commits = 0;  // Initialize total commits at 0
  for (let i = 0; i < num_committers; i++) {  // Loop through each committer
    total_commits += commit_count[i]; // Sum all commit counts
  }

  let current_percentage = 0.0; // Initialize percentage of contributions covered at 0
  let i = 0;  // Counter for contributors covering the critical percentage of commits

  // Calculate the minimum number of contributors required to maintain 95% of the project
  while (current_percentage < threshold && i < num_committers) {  // Until the threshold is met or all contributors are accounted for
    current_percentage += (commit_count[i] / total_commits); // Add the percentage contribution of each contributor
    i++; // Move to the next contributor
  }

  // Calculate Bus Factor as the inverse of how many people must keep working (lower Bus Factor means more reliance on fewer people)
  let bus_factor = 1 - (i / num_committers);  // Subtract from 1 to represent the Bus Factor as a percentage of total contributors

  return Math.round(bus_factor * 10) / 10;  // Return the Bus Factor rounded to the nearest tenth
}

/**
 * Fetches contributor data for the Lodash repository, calculates the Bus Factor,
 * and logs the result to the console.
 * 
 * Uses GitHub API to retrieve contributor data from the Lodash repo and calculates
 * the Bus Factor using the getBusFactor function.
 * 
 * @async
 * @function calculateBusFactor1
 * @returns {Promise<void>} Logs the Bus Factor to the console if successful, or an error if the API call fails.
 */
async function calculateBusFactor1() {
  try {
    // Fetch contributor data from Lodash GitHub repository
    let data = await fetchJsonFromApi(getGitHubAPILink("https://github.com/lodash/lodash", "contributors"));
    // Calculate Bus Factor for Lodash
    let bus_factor = getBusFactor(data);
    // Output Bus Factor to console
    console.log(`Bus Factor Lodash: ${bus_factor}`);
  } catch (error) {
    // Log any errors encountered during API fetch or processing
    console.error('Error fetching data:', error);
  }
}

/**
 * Fetches contributor data for the Cloudinary NPM repository, calculates the Bus Factor,
 * and logs the result to the console.
 * 
 * Uses GitHub API to retrieve contributor data from the Cloudinary NPM repo and calculates
 * the Bus Factor using the getBusFactor function.
 * 
 * @async
 * @function calculateBusFactor2
 * @returns {Promise<void>} Logs the Bus Factor to the console if successful, or an error if the API call fails.
 */
async function calculateBusFactor2() {
  try {
    // Fetch contributor data from Cloudinary NPM GitHub repository
    let data = await fetchJsonFromApi(getGitHubAPILink("https://github.com/cloudinary/cloudinary_npm", "contributors"));
    // Calculate Bus Factor for Cloudinary NPM
    let bus_factor = getBusFactor(data);
    // Output Bus Factor to console
    console.log(`Bus Factor Cloudinary_NPM: ${bus_factor}`);
  } catch (error) {
    // Log any errors encountered during API fetch or processing
    console.error('Error fetching data:', error);
  }
}

/**
 * Fetches contributor data for the Nodist repository, calculates the Bus Factor,
 * and logs the result to the console.
 * 
 * Uses GitHub API to retrieve contributor data from the Nodist repo and calculates
 * the Bus Factor using the getBusFactor function.
 * 
 * @async
 * @function calculateBusFactor3
 * @returns {Promise<void>} Logs the Bus Factor to the console if successful, or an error if the API call fails.
 */
async function calculateBusFactor3() {
  try {
    // Fetch contributor data from Nodist GitHub repository
    let data = await fetchJsonFromApi(getGitHubAPILink("https://github.com/nullivex/nodist", "contributors"));
    // Calculate Bus Factor for Nodist
    let bus_factor = getBusFactor(data);
    // Output Bus Factor to console
    console.log(`Bus Factor Nodist: ${bus_factor}`);
  } catch (error) {
    // Log any errors encountered during API fetch or processing
    console.error('Error fetching data:', error);
  }
}

// Calculate Bus Factors for three repositories (Lodash, Cloudinary NPM, and Nodist)
calculateBusFactor1();
calculateBusFactor2();
calculateBusFactor3();
