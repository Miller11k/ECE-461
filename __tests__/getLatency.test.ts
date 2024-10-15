import { getTimestampWithThreeDecimalPlaces } from '../src/metrics/getLatency';

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
  
    // The correct Unix timestamp for '2024-09-21T10:20:30.456Z' is 1726914030.456
    expect(result).toBe(1726914030.456);
    
    // Ensure logMessage was called
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
