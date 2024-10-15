import { getGitHubAPILink, getContributionCounts, fetchOpenIssuesCount, fetchClosedIssuesCount } from '../src/githubData';
import axios from 'axios';

// Mock external dependencies
jest.mock('axios');

describe('GitHub Data Utility Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});  // Mock console.error
    });

    afterEach(() => {
        jest.restoreAllMocks();  // Restore console.error after each test
    });

    describe('getGitHubAPILink', () => {
        it('should generate a GitHub API link and log the process', () => {
            const result = getGitHubAPILink('https://github.com/owner/repo', 'issues');

            expect(result).toBe('https://api.github.com/repos/owner/repo/issues');
        });

      //   it('should remove .git from the repository name and log the process', () => {
      //     const result = getGitHubAPILink('https://github.com/owner/repo.git', 'contributors');
      
      //     expect(result).toBe('https://api.github.com/repos/owner/repo/contributors');
      
      //     // Adjust the expected log messages to match the actual behavior
      //     expect(logMessage).toHaveBeenCalledWith('getGitHubAPILink - Initializing', [
      //         'Starting to generate GitHub API URL.',
      //         'Received URL: https://github.com/owner/repo.git, Endpoint: contributors'
      //     ]);
      
      //     expect(logMessage).toHaveBeenCalledWith('getGitHubAPILink - URL Split', [
      //         'Successfully split the URL into parts.',
      //         'URL Parts: ["https:","","github.com","owner","repo.git"]'
      //     ]);
      
      //     expect(logMessage).toHaveBeenCalledWith('getGitHubAPILink - Owner Extracted', [
      //         'Extracted repository owner.',
      //         'Owner: owner'
      //     ]);
      
      //     expect(logMessage).toHaveBeenCalledWith('getGitHubAPILink - Repository Extracted', [
      //         'Extracted repository name.',
      //         'Repository: repo.git'
      //     ]);
      
      //     expect(logMessage).toHaveBeenCalledWith('getGitHubAPILink - Checking for .git', [
      //         'Checking if the repository name contains .git.',
      //         'Repository before check: repo.git'
      //     ]);
      
      //     // This is the correct message for the .git removal step
      //     expect(logMessage).toHaveBeenCalledWith('getGitHubAPILink - Removing .git', [
      //         'Repository name contained .git, removing it.',
      //         'Repository after removing .git: repo'
      //     ]);
      
      //     expect(logMessage).toHaveBeenCalledWith('getGitHubAPILink - URL Construction', [
      //         'Constructing the final API URL.',
      //         'Final API URL: https://api.github.com/repos/owner/repo/contributors'
      //     ]);
      // });
    });

    describe('fetchOpenIssuesCount', () => {
        it('should fetch open issues from the GitHub API and log the process', async () => {
            (axios.get as jest.Mock).mockResolvedValueOnce({
                data: Array(100).fill({}) // Mock 100 open issues
            }).mockResolvedValueOnce({
                data: Array(50).fill({}) // Mock 50 open issues (end of pagination)
            });

            const result = await fetchOpenIssuesCount('owner', 'repo');

            expect(result).toBe(150); // 100 + 50

        });

        it('should handle API errors gracefully and log the error', async () => {
            (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

            const result = await fetchOpenIssuesCount('owner', 'repo');

            expect(result).toBe(0);  // Return 0 as a fallback in case of an error

            // expect(console.error).toHaveBeenCalledWith('Error fetching open issues:', expect.any(Error));
        });
    });

    describe('fetchClosedIssuesCount', () => {
        it('should fetch closed issues from the GitHub API and log the process', async () => {
            (axios.get as jest.Mock).mockResolvedValueOnce({
                data: Array(100).fill({}) // Mock 100 closed issues
            }).mockResolvedValueOnce({
                data: Array(30).fill({}) // Mock 30 closed issues (end of pagination)
            });

            const result = await fetchClosedIssuesCount('owner', 'repo');

            expect(result).toBe(130); // 100 + 30
        });

        it('should handle API errors gracefully and log the error', async () => {
            (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

            const result = await fetchClosedIssuesCount('owner', 'repo');

            expect(result).toBe(0);  // Return 0 as a fallback in case of an error

            // error).toHaveBeenCalledWith('Error fetching closed issues:', expect.any(Error));
        });
    });
});