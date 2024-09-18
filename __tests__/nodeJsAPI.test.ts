import { getNodeJsAPILink } from '../src/nodejs_data';
import { fetchJsonFromApi } from '../src/API';

// Mock the API module, specifically the `fetchJsonFromApi` function, for testing purposes
jest.mock('../src/API', () => ({
  fetchJsonFromApi: jest.fn(),
}));

/**
 * Test suite for `getNodeJsAPILink`, which fetches npm data and extracts GitHub repository links.
 */
describe('getNodeJsAPILink', () => {
  
  /**
   * Test case to validate that the function correctly fetches npm data
   * and extracts the GitHub repository link from the response.
   * 
   * This test mocks the npm API response to contain a valid GitHub repository URL in `git+ssh` format
   * and ensures that the link is converted and logged in the correct format (HTTPS).
   * 
   * @async
   */
  it('should fetch npm data and extract GitHub repository link', async () => {
    // Mocking the expected response from the npm API with a GitHub repository link
    const mockNpmData = {
      repository: {
        url: 'git+ssh://git@github.com/browserify/browserify.git',  // GitHub repository URL in `git+ssh` format
      },
    };

    // Mock the fetchJsonFromApi to resolve with the mock npm data
    (fetchJsonFromApi as jest.Mock).mockResolvedValue(mockNpmData);

    // Spy on console.log to track what gets logged
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    // Call the function under test with a sample npm package URL
    await getNodeJsAPILink('https://www.npmjs.com/package/browserify');

    // Ensure that the fetchJsonFromApi was called with the correct URL
    expect(fetchJsonFromApi).toHaveBeenCalledWith('https://registry.npmjs.org/browserify');

    // Ensure that the correct GitHub URL (converted to HTTPS format) is logged
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Clean GitHub Repository URL:',
      'https://github.com/browserify/browserify'
    );

    // Ensure that the original repository URL from the npm data is logged
    expect(consoleLogSpy).toHaveBeenCalledWith('Repository URL from npm Data:', mockNpmData);

    // Restore the original console.log behavior
    consoleLogSpy.mockRestore();
  });

  /**
   * Test case to verify that the function handles missing repository links correctly.
   * 
   * This test mocks the npm API response to not contain a `repository` field and ensures that the function
   * logs an appropriate error message.
   * 
   * @async
   */
  it('should handle missing repository link gracefully', async () => {
    // Mocking an empty response from the npm API, i.e., no repository field
    const mockNpmData = {};

    // Mock the fetchJsonFromApi to resolve with this empty data
    (fetchJsonFromApi as jest.Mock).mockResolvedValue(mockNpmData);

    // Spy on console.error to track error logging
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Call the function under test with a non-existent npm package URL
    await getNodeJsAPILink('https://www.npmjs.com/package/nonexistent-package');

    // Ensure that the appropriate error message is logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'No GitHub repository link found or data is incomplete.'
    );

    // Restore the original console.error behavior
    consoleErrorSpy.mockRestore();
  });

  /**
   * Test case to validate that the function handles API call failures correctly.
   * 
   * This test mocks the `fetchJsonFromApi` function to throw an error and ensures that the function
   * logs an appropriate error message.
   * 
   * @async
   */
  it('should log an error if the API call fails', async () => {
    // Mocking an error during the API call
    const mockError = new Error('API request failed');
    (fetchJsonFromApi as jest.Mock).mockRejectedValue(mockError);
  
    // Spy on console.error to track error logging
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  
    // Call the function under test with a non-existent npm package URL
    await getNodeJsAPILink('https://www.npmjs.com/package/nonexistent-package');
  
    // Ensure that the appropriate error message is logged, including the error object
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching data from npm API:', mockError);
  
    // Restore the original console.error behavior
    consoleErrorSpy.mockRestore();
  });
});
