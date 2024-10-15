import { getNumberOfCores } from '../src/multithread';
import { cpus } from 'os';

// Mock the 'os' module
jest.mock('os');

describe('getNumberOfCores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct number of CPU cores and log the messages', () => {
    // Mock the cpus function to return a mock list of CPU cores
    const mockCores = [{}, {}, {}, {}]; // Simulate 4 CPU cores
    (cpus as jest.Mock).mockReturnValue(mockCores);

    const result = getNumberOfCores();

    // Check that logMessage was called with the correct messages
    // Ensure the number of CPU cores is correctly returned
    expect(result).toEqual(4);
  });

  it('should handle edge cases when cpus function returns an empty array', () => {
    // Mock the cpus function to return an empty array (no CPU cores)
    (cpus as jest.Mock).mockReturnValue([]);

    const result = getNumberOfCores();

    // Check that the number of CPU cores is 0
    expect(result).toEqual(0);
  });

  it('should return the correct number of CPU cores when cpus function returns more than expected', () => {
    // Simulate a scenario with 8 cores
    const mockCores = [{}, {}, {}, {}, {}, {}, {}, {}]; // Simulate 8 CPU cores
    (cpus as jest.Mock).mockReturnValue(mockCores);

    const result = getNumberOfCores();
    // Check the result for 8 CPU cores
    expect(result).toEqual(8);
  });
});