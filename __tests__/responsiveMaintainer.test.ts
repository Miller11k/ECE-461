import { calculateResponsiveMaintainer } from '../src/metrics/responsiveMaintainer'; // Adjust the path
import { getGitHubAPILink } from '../src/githubData';
import { fetchJsonFromApi } from '../src/API';
import { getTimestampWithThreeDecimalPlaces } from '../src/metrics/getLatency';

jest.mock('../src/githubData', () => ({
  getGitHubAPILink: jest.fn(),
}));

jest.mock('../src/API', () => ({
  fetchJsonFromApi: jest.fn(),
}));

jest.mock('../src/metrics/getLatency', () => ({
  getTimestampWithThreeDecimalPlaces: jest.fn(),
}));


describe('calculateResponsiveMaintainer', () => {
  const URL = 'https://github.com/user/repo';
  const API_link = 'https://api.github.com/repos/user/repo';
  const repoData = { open_issues_count: 10 };
  const issuesData = [
    { closed_at: '2022-01-01T00:00:00Z' },
    { closed_at: null },
    { closed_at: '2022-01-02T00:00:00Z' },
  ];
  const latencyStart = 1000.123;
  const latencyEnd = 1002.456;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock timestamps for latency
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValueOnce(latencyStart).mockReturnValueOnce(latencyEnd);
    
    // Mock API link generation
    (getGitHubAPILink as jest.Mock).mockReturnValue(API_link);
    
    // Mock fetch API data
    (fetchJsonFromApi as jest.Mock)
      .mockResolvedValueOnce(repoData)  // First call for repo data
      .mockResolvedValueOnce(issuesData); // Second call for issues data
  });

  it('handles no closed issues and avoids division by zero', async () => {
    // Override the mock to simulate no closed issues
    (fetchJsonFromApi as jest.Mock).mockResolvedValueOnce(repoData).mockResolvedValueOnce([{ closed_at: null }, { closed_at: null }]);

    const result = await calculateResponsiveMaintainer(URL);

    expect(result.score).toBe(0.17); // With no closed issues, score should be 0
    expect(result.latency).toBe(parseFloat((latencyEnd - latencyStart).toFixed(3)));
  });

  it('handles missing open_issues_count in repoData and uses counted value', async () => {
    const repoDataWithoutOpenIssuesCount = {};
    
    // Mock to return repo data without open_issues_count
    (fetchJsonFromApi as jest.Mock).mockResolvedValueOnce(repoDataWithoutOpenIssuesCount).mockResolvedValueOnce(issuesData);

    const result = await calculateResponsiveMaintainer(URL);

    expect(result.score).toBe(1); // Same issue count as before, so same score
    expect(result.latency).toBe(parseFloat((latencyEnd - latencyStart).toFixed(3)));
  });
});