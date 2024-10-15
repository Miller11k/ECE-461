import { getBusFactor } from '../src/metrics/busFactor';
import { fetchJsonFromApi } from '../src/API';
import { getGitHubAPILink, getContributionCounts } from '../src/githubData';
import { getTimestampWithThreeDecimalPlaces } from '../src/metrics/getLatency';

// Mock dependencies
jest.mock('../src/API');
jest.mock('../src/githubData');
jest.mock('../src/metrics/getLatency');

describe('getBusFactor', () => {
  const mockURL = 'https://github.com/example/repo';
  const mockContributorData = [
    { commits: 50 },
    { commits: 30 },
    { commits: 20 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 0 if no contributor data is fetched', async () => {
    (getGitHubAPILink as jest.Mock).mockReturnValue('https://api.github.com/repos/example/repo/contributors');
    (fetchJsonFromApi as jest.Mock).mockResolvedValue([]);
    (getContributionCounts as jest.Mock).mockReturnValue([]);
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValueOnce(1000).mockReturnValueOnce(1005);

    const result = await getBusFactor(mockURL);

    expect(result.score).toEqual(0);
    expect(result.latency).toEqual(5); // Latency of 5ms (1005 - 1000)
    expect(getGitHubAPILink).toHaveBeenCalledWith(mockURL, 'contributors');
    expect(fetchJsonFromApi).toHaveBeenCalledWith('https://api.github.com/repos/example/repo/contributors');
  });

  it('should return correct Bus Factor for contributors', async () => {
    const adjustedContributorData = [
      { commits: 90 }, // First contributor does most of the work
      { commits: 5 },  // Second contributor
      { commits: 5 }   // Third contributor
    ];
  
    (getGitHubAPILink as jest.Mock).mockReturnValue('https://api.github.com/repos/example/repo/contributors');
    (fetchJsonFromApi as jest.Mock).mockResolvedValue(adjustedContributorData);
    (getContributionCounts as jest.Mock).mockReturnValue([90, 5, 5]);
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValueOnce(1000).mockReturnValueOnce(1005);
  
    const result = await getBusFactor(mockURL);
  
    expect(result.score).toBeCloseTo(0.3, 1); // Bus factor is now 0.3 because the first contributor is enough
    expect(result.latency).toEqual(5); // Latency of 5ms (1005 - 1000)
    expect(getGitHubAPILink).toHaveBeenCalledWith(mockURL, 'contributors');
    expect(fetchJsonFromApi).toHaveBeenCalledWith('https://api.github.com/repos/example/repo/contributors');
  });

  it('should handle a single contributor with all commits', async () => {
    (getGitHubAPILink as jest.Mock).mockReturnValue('https://api.github.com/repos/example/repo/contributors');
    (fetchJsonFromApi as jest.Mock).mockResolvedValue([{ commits: 100 }]);
    (getContributionCounts as jest.Mock).mockReturnValue([100]);
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValueOnce(1000).mockReturnValueOnce(1005);

    const result = await getBusFactor(mockURL);

    expect(result.score).toEqual(0); // Only one contributor, Bus Factor is 0
    expect(result.latency).toEqual(5); // Latency of 5ms (1005 - 1000)
  });

  it('should handle errors gracefully', async () => {
    (getGitHubAPILink as jest.Mock).mockReturnValue('https://api.github.com/repos/example/repo/contributors');
    (fetchJsonFromApi as jest.Mock).mockRejectedValue(new Error('API Error'));
    (getTimestampWithThreeDecimalPlaces as jest.Mock).mockReturnValueOnce(1000).mockReturnValueOnce(1005);

    await expect(getBusFactor(mockURL)).rejects.toThrow('API Error');
  });
});