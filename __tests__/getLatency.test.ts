import { getTimestampWithThreeDecimalPlaces } from '../src/metrics/getLatency';
import { logMessage } from '../src/logFile';

// Mock the logMessage function
jest.mock('../src/logFile');

describe('getTimestampWithThreeDecimalPlaces', () => {
  let OriginalDate: typeof Date;

  beforeAll(() => {
    // Save the original Date constructor
    OriginalDate = Date;
  });

  afterAll(() => {
    // Restore the original Date constructor after tests
    global.Date = OriginalDate;
  });

  it('should return the correct timestamp with three decimal places', () => {
    // Mock the Date constructor to return a fixed date
    const mockDate = new OriginalDate('2024-09-21T10:20:30.456Z');
    
    // Mock the implementation of the Date constructor to always return the mock date
    global.Date = jest.fn(() => mockDate) as unknown as typeof Date;

    // Call the function
    const result = getTimestampWithThreeDecimalPlaces();

    // Assert that the result is correct
    expect(result).toBe(1724222430.456); // 1724222430 seconds + 456 ms (converted to fraction)
    
    // Ensure logMessage was called
    expect(logMessage).toHaveBeenCalledWith(
      'getTimestampWithThreeDecimalPlaces',
      ['Getting current timestamp.', 'Starting to calculate timestamp.']
    );
    expect(logMessage).toHaveBeenCalledWith(
      'getTimestampWithThreeDecimalPlaces',
      ['Timestamp calculated.', `Seconds: 1724222430, Milliseconds: 456`]
    );
  });

  it('should handle different dates correctly', () => {
    // Mock a different date
    const mockDate = new OriginalDate('2023-08-01T12:00:00.789Z');
    global.Date = jest.fn(() => mockDate) as unknown as typeof Date;

    // Call the function
    const result = getTimestampWithThreeDecimalPlaces();

    // Assert the result is correct
    expect(result).toBe(1690891200.789); // 1690891200 seconds + 789 ms
  });
});
