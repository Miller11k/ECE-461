import { getMetrics } from '../src/metrics/getMetrics';
import { getBusFactor } from '../src/metrics/busFactor';
import { getLicenseScore } from '../src/metrics/license';
import { formatJSON, initJSON } from '../src/json';
import { URLType } from '../src/URL';
import { getNodeJsAPILink } from '../src/npmjsData';
import { calculateCorrectness } from '../src/metrics/correctness';
import { calculateRampUp } from '../src/metrics/rampUp';
import { calculateResponsiveMaintainer } from '../src/metrics/responsiveMaintainer';
import { getNetScore, getNetScoreLatency } from '../src/metrics/netScore';
import { getNumberOfCores } from '../src/multithread';

// Mock dependencies
jest.mock('../src/metrics/busFactor');
jest.mock('../src/metrics/license');
jest.mock('../src/metrics/correctness');
jest.mock('../src/metrics/rampUp');
jest.mock('../src/metrics/responsiveMaintainer');
jest.mock('../src/metrics/netScore');
jest.mock('../src/npmjsData');
jest.mock('../src/json');
jest.mock('../src/URL');
jest.mock('../src/multithread');

describe('getMetrics', () => {
  const mockURL = 'https://github.com/example/repo';
  const mockNpmURL = 'https://www.npmjs.com/package/example';
  const mockNodeJsAPIURL = 'https://registry.npmjs.org/example';
  const mockRepoData = {
    BusFactor: 0.5,
    BusFactor_Latency: 10,
    Correctness: 0.7,
    Correctness_Latency: 8,
    License: 1,
    License_Latency: 6,
    RampUp: 0.9,
    RampUp_Latency: 7,
    ResponsiveMaintainer: 0.6,
    ResponsiveMaintainer_Latency: 9,
    NetScore: 0.75,
    NetScore_Latency: 40
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct metrics for a GitHub repository URL', async () => {
    // Mock the dependencies
    (initJSON as jest.Mock).mockReturnValue({}); // Mock empty JSON initialization
    (getNumberOfCores as jest.Mock).mockReturnValue(4); // Mock number of cores
    (URLType as jest.Mock).mockReturnValue('github'); // Mock URL type detection
    (getBusFactor as jest.Mock).mockResolvedValue({ score: 0.5, latency: 10 });
    (calculateCorrectness as jest.Mock).mockResolvedValue({ score: 0.7, latency: 8 });
    (getLicenseScore as jest.Mock).mockResolvedValue({ score: 1, latency: 6 });
    (calculateRampUp as jest.Mock).mockResolvedValue({ score: 0.9, latency: 7 });
    (calculateResponsiveMaintainer as jest.Mock).mockResolvedValue({ score: 0.6, latency: 9 });
    (getNetScore as jest.Mock).mockResolvedValue(0.75);
    (getNetScoreLatency as jest.Mock).mockResolvedValue(40);
    (formatJSON as jest.Mock).mockReturnValue(JSON.stringify(mockRepoData));

    const result = await getMetrics(mockURL);

    expect(initJSON).toHaveBeenCalled();
    expect(getNumberOfCores).toHaveBeenCalled();
    expect(getBusFactor).toHaveBeenCalledWith(mockURL);
    expect(calculateCorrectness).toHaveBeenCalledWith(mockURL);
    expect(getLicenseScore).toHaveBeenCalledWith(mockURL);
    expect(calculateRampUp).toHaveBeenCalledWith(mockURL);
    expect(calculateResponsiveMaintainer).toHaveBeenCalledWith(mockURL);
    expect(getNetScore).toHaveBeenCalledWith(0.9, 0.7, 0.5, 0.6, 1);
    expect(getNetScoreLatency).toHaveBeenCalledWith(7, 8, 10, 9, 6);
    expect(formatJSON).toHaveBeenCalledWith(expect.any(Object)); // Ensure the JSON is formatted
    expect(result).toEqual(JSON.stringify(mockRepoData));
  });

  it('should convert npmjs URL to Node.js API link and return the correct metrics', async () => {
    // Mock the dependencies
    (initJSON as jest.Mock).mockReturnValue({}); // Mock empty JSON initialization
    (getNumberOfCores as jest.Mock).mockReturnValue(4); // Mock number of cores
    (URLType as jest.Mock).mockReturnValue('npmjs'); // Mock URL type detection
    (getNodeJsAPILink as jest.Mock).mockResolvedValue(mockNodeJsAPIURL); // Mock npmjs to Node.js API link conversion
    (getBusFactor as jest.Mock).mockResolvedValue({ score: 0.5, latency: 10 });
    (calculateCorrectness as jest.Mock).mockResolvedValue({ score: 0.7, latency: 8 });
    (getLicenseScore as jest.Mock).mockResolvedValue({ score: 1, latency: 6 });
    (calculateRampUp as jest.Mock).mockResolvedValue({ score: 0.9, latency: 7 });
    (calculateResponsiveMaintainer as jest.Mock).mockResolvedValue({ score: 0.6, latency: 9 });
    (getNetScore as jest.Mock).mockResolvedValue(0.75);
    (getNetScoreLatency as jest.Mock).mockResolvedValue(40);
    (formatJSON as jest.Mock).mockReturnValue(JSON.stringify(mockRepoData));

    const result = await getMetrics(mockNpmURL);

    expect(initJSON).toHaveBeenCalled();
    expect(getNodeJsAPILink).toHaveBeenCalledWith(mockNpmURL); // Ensure npmjs URL was converted
    expect(getBusFactor).toHaveBeenCalledWith(mockNodeJsAPIURL);
    expect(calculateCorrectness).toHaveBeenCalledWith(mockNodeJsAPIURL);
    expect(getLicenseScore).toHaveBeenCalledWith(mockNodeJsAPIURL);
    expect(calculateRampUp).toHaveBeenCalledWith(mockNodeJsAPIURL);
    expect(calculateResponsiveMaintainer).toHaveBeenCalledWith(mockNodeJsAPIURL);
    expect(getNetScore).toHaveBeenCalledWith(0.9, 0.7, 0.5, 0.6, 1);
    expect(getNetScoreLatency).toHaveBeenCalledWith(7, 8, 10, 9, 6);
    expect(formatJSON).toHaveBeenCalledWith(expect.any(Object)); // Ensure the JSON is formatted
    expect(result).toEqual(JSON.stringify(mockRepoData));
  });

  it('should handle errors gracefully during metrics calculation', async () => {
    // Mock the dependencies to simulate an error during the calculation
    (initJSON as jest.Mock).mockReturnValue({}); // Mock empty JSON initialization
    (getNumberOfCores as jest.Mock).mockReturnValue(4); // Mock number of cores
    (URLType as jest.Mock).mockReturnValue('github'); // Mock URL type detection
    (getBusFactor as jest.Mock).mockRejectedValue(new Error('Bus Factor calculation failed'));

    await expect(getMetrics(mockURL)).rejects.toThrow('Bus Factor calculation failed');
  });
});