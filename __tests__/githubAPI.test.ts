import { getContributionCounts, getGitHubAPILink } from '../src/github_data';
import { fetchJsonFromApi } from '../src/API';

// Mocking the fetchJsonFromApi function for testing purposes
jest.mock('../src/API', () => ({
  fetchJsonFromApi: jest.fn(),
}));

/**
 * Test suite for GitHub API integration and contribution counting functionality.
 */
describe('GitHub API Tests', () => {
  /**
   * Tests fetching GitHub contributors data and counting their contributions.
   * 
   * This test mocks the response from the GitHub API with contributor data,
   * verifies that the data is correctly fetched, and checks if the contributions 
   * are properly counted.
   * 
   * @async
   */
  it('should fetch GitHub contributors and count contributions', async () => {
    // Mocking the API response with sample contributor data
    const mockGitHubData = [
      { contributions: 148 },  // Mock contributor with 148 contributions
      { contributions: 96 },   // Mock contributor with 96 contributions
      { contributions: 63 },   // Mock contributor with 63 contributions
      { contributions: 1 },    // Mock contributor with 1 contribution
    ];

    // Mock the API to resolve with the mocked data
    (fetchJsonFromApi as jest.Mock).mockResolvedValue(mockGitHubData);

    // Fetch GitHub contributors data using the API mock
    const githubData = await fetchJsonFromApi(
      getGitHubAPILink('https://github.com/cloudinary/cloudinary_npm', 'contributors')
    );

    // Check that the data returned is an array and has the expected length
    expect(Array.isArray(githubData)).toBe(true);  // Expect the result to be an array
    expect(githubData.length).toBe(mockGitHubData.length);  // Expect the array length to match the mock data

    // Process the contributions using the getContributionCounts function
    const contributions = getContributionCounts(githubData);

    // Verify the expected contribution counts are correct
    expect(contributions).toEqual([148, 96, 63, 1]);  // Check that the contribution counts match
  });
});

/**
 * Test suite for the `getGitHubAPILink` function, which constructs the correct GitHub API URL.
 */
describe('getGitHubAPILink', () => {
    /**
     * Tests that the API URL is correctly constructed without an additional endpoint.
     * 
     * Ensures the function constructs the base API URL for a given GitHub repository URL.
     */
    it('should construct the correct API URL without an endpoint', () => {
        const url = 'https://github.com/cloudinary/cloudinary_npm';  // Test GitHub repo URL
        const expectedApiUrl = 'https://api.github.com/repos/cloudinary/cloudinary_npm';  // Expected API URL
        const apiUrl = getGitHubAPILink(url);  // Call the function to get the API URL
        expect(apiUrl).toBe(expectedApiUrl);  // Ensure the returned API URL matches the expected value
    });

    /**
     * Tests that the API URL is correctly constructed with an additional endpoint (e.g., 'contributors').
     * 
     * Ensures the function constructs the API URL with the specified endpoint for a given GitHub repository URL.
     */
    it('should construct the correct API URL with an endpoint', () => {
        const url = 'https://github.com/cloudinary/cloudinary_npm';  // Test GitHub repo URL
        const endpoint = 'contributors';  // Endpoint to append to the API URL
        const expectedApiUrl = 'https://api.github.com/repos/cloudinary/cloudinary_npm/contributors';  // Expected API URL with endpoint
        const apiUrl = getGitHubAPILink(url, endpoint);  // Call the function with the endpoint
        expect(apiUrl).toBe(expectedApiUrl);  // Ensure the returned API URL matches the expected value
    });
});
