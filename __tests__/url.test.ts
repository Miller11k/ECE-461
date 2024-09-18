import { url_type, test_url, parse_urls } from "../src/url";
import * as fs from 'fs';
import { exit } from 'process';

// Mocking `fs.existsSync` and `fs.readFileSync` for the tests
jest.mock('fs');

// Mocking the `process.exit` to prevent the actual process from exiting during the test
jest.mock('process', () => ({
  exit: jest.fn(),
}));

// Mocking the global `fetch` API to simulate HTTP responses
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true, // Simulate a successful HTTP response
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    redirected: false,
    url: '',
    type: 'default',
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
    json: jest.fn(),
    text: jest.fn(),
  } as unknown as Response) // Casting the object to match the `Response` type
);

/**
 * Test suite for the `test_url` function.
 * Verifies if a given URL is accessible by making an HTTP request.
 */
describe('test_url', () => {

  /**
   * Test case to check that `test_url` returns `true` for a successful URL.
   *
   * @async
   * @returns {Promise<void>}
   */
  it('should return true for a successful URL request', async () => {
    const url = 'https://github.com';
    const result = await test_url(url); // Call the test_url function
    expect(result).toBe(true); // Expect true since the mock response is successful
  });

  /**
   * Test case to verify that `test_url` returns `false` for an invalid URL.
   *
   * @async
   * @returns {Promise<void>}
   */
  it('should return false for a failed URL request', async () => {
    // Mock the fetch API to return a failed HTTP response (404)
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false, // Simulate a 404 error response
        status: 404,
        statusText: 'Not Found',
        headers: new Headers(),
        redirected: false,
        url: '',
        type: 'default',
        clone: jest.fn(),
        body: null,
        bodyUsed: false,
        json: jest.fn(),
        text: jest.fn(),
      } as unknown as Response)
    );

    const url = 'https://invalid-url.com'; // Invalid URL
    const result = await test_url(url);
    expect(result).toBe(false); // Expect false since the response is 404
  });

  /**
   * Test case to verify that `test_url` handles fetch errors gracefully.
   *
   * @async
   * @returns {Promise<void>}
   */
  it('should return false if fetch throws an error', async () => {
    // Mock fetch to throw an error (simulating network failure)
    (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.reject('Network error'));

    const url = 'https://error-url.com'; // Simulated URL
    const result = await test_url(url);
    expect(result).toBe(false); // Expect false when an error is thrown
  });
});

/**
 * Test suite for the `url_type` function.
 * Determines the type of URL (GitHub, npmjs, or other).
 */
describe('url_type', () => {

  /**
   * Test case to check that `url_type` correctly identifies a GitHub URL.
   *
   * @returns {void}
   */
  it('should return "github" for a GitHub URL', () => {
    const url = 'https://github.com/user/repo';
    const result = url_type(url); // Call the url_type function
    expect(result).toBe('github'); // Expect "github" for a GitHub URL
  });

  /**
   * Test case to check that `url_type` correctly identifies an npmjs URL.
   *
   * @returns {void}
   */
  it('should return "npmjs" for an npmjs URL', () => {
    const url = 'https://www.npmjs.com/package/express';
    const result = url_type(url); // Call the url_type function
    expect(result).toBe('npmjs'); // Expect "npmjs" for an npmjs URL
  });

  /**
   * Test case to verify that `url_type` returns "other" for non-GitHub/npmjs URLs.
   *
   * @returns {void}
   */
  it('should return "other" for a non-GitHub/npmjs URL', () => {
    const url = 'https://www.example.com'; // A generic URL
    const result = url_type(url); // Call the url_type function
    expect(result).toBe('other'); // Expect "other" for URLs that aren't GitHub or npmjs
  });
});

/**
 * Test suite for the `parse_urls` function.
 * Reads a file containing URLs and returns them as an array.
 */
describe('parse_urls', () => {

  /**
   * Test case to verify that the function exits with code 1 if the file does not exist.
   *
   * @returns {void}
   */
  it('should exit with code 1 if the file does not exist', () => {
    // Mock fs.existsSync to simulate that the file doesn't exist
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    // Call parse_urls with a non-existent file
    parse_urls('non_existent_file.txt');

    // Expect the process to exit with code 1 due to missing file
    expect(exit).toHaveBeenCalledWith(1);
  });

  /**
   * Test case to verify that `parse_urls` returns an empty array if the file is empty.
   *
   * @returns {void}
   */
  it('should return an empty array if the file is empty', () => {
    // Mock fs.existsSync to simulate that the file exists
    // Mock fs.readFileSync to simulate an empty file
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('');

    // Call parse_urls with an empty file
    const result = parse_urls('empty_file.txt');

    // Expect an empty array since the file has no URLs
    expect(result).toEqual([]);
  });

  /**
   * Test case to verify that `parse_urls` correctly returns an array of URLs when the file contains valid URLs.
   *
   * @returns {void}
   */
  it('should return an array of URLs when the file contains URLs', () => {
    // Mock fs.existsSync to simulate that the file exists
    // Mock fs.readFileSync to return a string with multiple URLs
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('https://github.com\nhttps://www.npmjs.com');

    // Call parse_urls with a file containing URLs
    const result = parse_urls('urls_file.txt');

    // Expect an array containing the URLs read from the file
    expect(result).toEqual(['https://github.com', 'https://www.npmjs.com']);
  });
});
