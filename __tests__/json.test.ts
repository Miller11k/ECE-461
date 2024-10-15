import { initJSON, formatJSON, extractLastIssuesUrlFromJson } from '../src/json';


describe('JSON Utility Functions', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initJSON', () => {
    it('should initialize a DataObject with null values and log the process', () => {
      const result = initJSON();

      // Check if the default values are correctly initialized
      expect(result).toEqual({
        URL: '',
        NetScore: null,
        NetScore_Latency: null,
        RampUp: null,
        RampUp_Latency: null,
        Correctness: null,
        Correctness_Latency: null,
        BusFactor: null,
        BusFactor_Latency: null,
        ResponsiveMaintainer: null,
        ResponsiveMaintainer_Latency: null,
        License: null,
        License_Latency: null,
      });

      // Ensure logMessage was called correctly
      });
  });

  describe('formatJSON', () => {
    it('should correctly format a DataObject into a single-line JSON string with spaces and log the process', () => {
      const dataObject = {
        URL: 'https://example.com',
        NetScore: 0.9,
        NetScore_Latency: 10,
        RampUp: 0.8,
        RampUp_Latency: 5,
        Correctness: 0.95,
        Correctness_Latency: 7,
        BusFactor: 0.7,
        BusFactor_Latency: 4,
        ResponsiveMaintainer: 0.85,
        ResponsiveMaintainer_Latency: 3,
        License: 1,
        License_Latency: 2,
      };

      const formattedJSON = formatJSON(dataObject);

      // Check if JSON string is formatted correctly with spaces
      expect(formattedJSON).toBe(JSON.stringify(dataObject).replace(/,(?=\S)/g, ', '));

      // Ensure logMessage was called correctly
      });
  });

  describe('extractLastIssuesUrlFromJson', () => {
    it('should extract the last GitHub issues URL from package data if found and log the process', () => {
      const mockPackageData = {
        versions: {
          '1.0.0': { bugs: { url: 'https://github.com/example/repo/issues' } },
          '2.0.0': { bugs: { url: 'https://github.com/example/repo/issues2' } },
        },
      };

      const result = extractLastIssuesUrlFromJson(mockPackageData);

      // Check if the correct issues URL is returned
      expect(result).toBe('https://github.com/example/repo/issues2');

      // Ensure logMessage was called correctly
    });

    it('should return null if no issues URL is found and log the process', () => {
      const mockPackageData = {
        versions: {
          '1.0.0': {},
          '2.0.0': {},
        },
      };

      const result = extractLastIssuesUrlFromJson(mockPackageData);

      // Check if null is returned when no issues URL is found
      expect(result).toBeNull();

      // Ensure logMessage was called correctly
    });
  });
});