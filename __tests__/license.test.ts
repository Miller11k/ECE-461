import * as fs from 'fs';
import { getLicenseScore } from '../src/metrics/license';

jest.setTimeout(60000 * 2); // 2 minutes

describe('getLicenseScore with real URLs', () => {
  const mockMITURL = 'https://github.com/jquery/jquery'; // MIT licensed repository
  const mockGPLURL = 'https://github.com/librenms/librenms'; // GPL licensed repository
  const mockNoLicenseURL = 'https://github.com/Coop8/Coop8'; // A repository without a LICENSE file
  const mockRepoDir = './temp-repo';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (fs.existsSync(mockRepoDir)) {
      fs.rmSync(mockRepoDir, { recursive: true, force: true }); // Clean up the directory after each test
    }
  });

  it('should return a score of 1 for an MIT-licensed repository', async () => {
    const { score, latency } = await getLicenseScore(mockMITURL);

    expect(score).toEqual(1); // MIT is a compatible license
    expect(latency).toBeGreaterThan(0); // Latency should be a real positive value
  });

  it('should return a score of 1 for a GPL-licensed repository', async () => {
    const { score, latency } = await getLicenseScore(mockGPLURL);

    expect(score).toEqual(1); // GPL is a compatible license
    expect(latency).toBeGreaterThan(0); // Latency should be a real positive value
  });

  it('should return a score of 0 for a repository without a LICENSE file', async () => {
    const { score, latency } = await getLicenseScore(mockNoLicenseURL);

    expect(score).toEqual(0); // No license, so score should be 0
    expect(latency).toBeGreaterThan(0); // Latency should be a real positive value
  });

  it('should clean up the temporary repository directory after cloning', async () => {
    const tempRepoDir = './temp-repo';
    const { score, latency } = await getLicenseScore(mockMITURL);

    expect(fs.existsSync(tempRepoDir)).toBe(false); // Ensure the directory is cleaned up
  });

  it('should handle errors gracefully for invalid repositories', async () => {
    const invalidURL = 'https://github.com/invalid/repo-does-not-exist';

    await expect(getLicenseScore(invalidURL)).rejects.toThrow(); // Expect an error to be thrown
  });
});