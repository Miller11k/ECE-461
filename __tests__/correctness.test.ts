import { calculateCorrectness } from '../src/metrics/correctness';
import { fetchJsonFromApi } from '../src/API';
import { getGitHubAPILink } from '../src/githubData';
import { getTimestampWithThreeDecimalPlaces } from '../src/metrics/getLatency';

// Mock dependencies
jest.mock('../src/API');
jest.mock('../src/githubData');
jest.mock('../src/metrics/getLatency');

describe('calculateCorrectness', () => {
  const mockURL = 'https://github.com/example/repo';
  const mockRepoData = { open_issues_count: 10 }; // Mock repository data
  const mockClosedPullData = [{ id: 1 }, { id: 2 }, { id: 3 }]; // Mock closed pull requests
  const mockOpenPullData = [{ id: 4 }, { id: 5 }]; // Mock open pull requests
  const mockClosedIssuesData = [{ id: 6 }, { id: 7 }]; // Mock closed issues
  const mockOpenIssuesData = [{ id: 8 }]; // Mock open issues

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a valid correctness score and latency', async () => {
    // Mock API calls
    (getGitHubAPILink as jest.Mock).mockReturnValue('https://api.github.com/repos/example/repo');
    (fetchJsonFromApi as jest.Mock)
      .mockResolvedValueOnce(mockRepoData) // Repository data
      .mockResolvedValueOnce(mockClosedPullData) // Closed PRs
      .mockResolvedValueOnce(mockOpenPullData) // Open PRs
      .mockResolvedValueOnce(mockClosedIssuesData) // Closed issues
      .mockResolvedValueOnce(mockOpenIssuesData); // Open issues

    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValueOnce(1000).mockReturnValueOnce(1006); // Simulate latency

    const result = await calculateCorrectness(mockURL);

    // Update based on actual correctness calculation
    expect(result.score).toBeCloseTo(0.6, 1); // Adjusted score based on calculation
    expect(result.latency).toEqual(6); // Latency of 6ms (1006 - 1000)

    // Ensure that all mocked API calls were made with the correct URLs
    expect(fetchJsonFromApi).toHaveBeenCalledWith('https://api.github.com/repos/example/repo');
    expect(fetchJsonFromApi).toHaveBeenCalledWith('https://api.github.com/repos/example/repo/pulls?state=closed');
    expect(fetchJsonFromApi).toHaveBeenCalledWith('https://api.github.com/repos/example/repo/pulls?state=open');
    expect(fetchJsonFromApi).toHaveBeenCalledWith('https://api.github.com/repos/example/repo/issues?state=closed');
    expect(fetchJsonFromApi).toHaveBeenCalledWith('https://api.github.com/repos/example/repo/issues?state=open');
  });

  it('should calculate correctness score correctly with no issues or PRs', async () => {
    // Mock API calls to simulate no issues and no pull requests
    (getGitHubAPILink as jest.Mock).mockReturnValue('https://api.github.com/repos/example/repo');
    (fetchJsonFromApi as jest.Mock)
      .mockResolvedValueOnce({ open_issues_count: 0 }) // No issues in the repo
      .mockResolvedValueOnce([]) // No closed PRs
      .mockResolvedValueOnce([]) // No open PRs
      .mockResolvedValueOnce([]) // No closed issues
      .mockResolvedValueOnce([]); // No open issues
  
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValueOnce(1000).mockReturnValueOnce(1004); // Simulate latency
  
    const result = await calculateCorrectness(mockURL);
  
    expect(result.score).toEqual(0.7); // Adjusted score based on calculation
    expect(result.latency).toEqual(4); // Latency of 4ms (1004 - 1000)
  });

  it('should calculate a lower score when there are many open issues', async () => {
    const manyOpenIssues = Array.from({ length: 300 }, (_, i) => ({ id: i })); // Increase the number of open issues
  
    (getGitHubAPILink as jest.Mock).mockReturnValue('https://api.github.com/repos/example/repo');
    (fetchJsonFromApi as jest.Mock)
      .mockResolvedValueOnce(mockRepoData) // Repo data with open issues
      .mockResolvedValueOnce(mockClosedPullData) // Closed PRs
      .mockResolvedValueOnce(mockOpenPullData) // Open PRs
      .mockResolvedValueOnce(mockClosedIssuesData) // Closed issues
      .mockResolvedValueOnce(manyOpenIssues); // Simulate many open issues
  
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValueOnce(1000).mockReturnValueOnce(1008); // Simulate latency
  
    const result = await calculateCorrectness(mockURL);
  
    expect(result.score).toEqual(0.5); // Lower score due to many open issues
    expect(result.latency).toEqual(8); // Latency of 8ms (1008 - 1000)
  });
});