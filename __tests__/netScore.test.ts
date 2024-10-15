import { getNetScore, getNetScoreLatency } from '../src/metrics/netScore';


describe('getNetScore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate the correct net score based on given metrics', async () => {
    const ramp_up_time = 0.8;
    const correctness = 0.9;
    const bus_factor = 0.7;
    const responsive_maintainer = 0.85;
    const license = 1.0;

    const result = await getNetScore(ramp_up_time, correctness, bus_factor, responsive_maintainer, license);

    // Net score formula:
    // 0.2 * license + 0.25 * bus_factor + 0.25 * responsive_maintainer + 0.2 * correctness + 0.1 * ramp_up_time
    // = (0.2 * 1.0) + (0.25 * 0.7) + (0.25 * 0.85) + (0.2 * 0.9) + (0.1 * 0.8)
    // = 0.2 + 0.175 + 0.2125 + 0.18 + 0.08 = 0.8475, rounded to 0.8

    expect(result).toEqual(0.8); // Final rounded net score
  });

  it('should handle a case with all zeros and return 0', async () => {
    const ramp_up_time = 0;
    const correctness = 0;
    const bus_factor = 0;
    const responsive_maintainer = 0;
    const license = 0;

    const result = await getNetScore(ramp_up_time, correctness, bus_factor, responsive_maintainer, license);

    expect(result).toEqual(0); // Zero scores should yield a zero net score
  });

  it('should handle a mix of low and high values and return the correct score', async () => {
    const ramp_up_time = 0.5;
    const correctness = 0.2;
    const bus_factor = 0.9;
    const responsive_maintainer = 0.3;
    const license = 0.0;

    const result = await getNetScore(ramp_up_time, correctness, bus_factor, responsive_maintainer, license);

    // Formula:
    // 0.2 * 0.8 + 0.25 * 0.9 + 0.25 * 0.3 + 0.2 * 0.2 + 0.1 * 0.5
    // = 0.16 + 0.225 + 0.075 + 0.04 + 0.05 = 0.55

    expect(result).toEqual(0.0); // Final rounded score
  });

  it('should return zero net score if license is zero', async () => {
    const ramp_up_time = 0.5;
    const correctness = 0.2;
    const bus_factor = 0.9;
    const responsive_maintainer = 0.3;
    const license = 0.0;

    const result = await getNetScore(ramp_up_time, correctness, bus_factor, responsive_maintainer, license);

    expect(result).toEqual(0); // Zero license should yield a zero net score
  });

  it('should return one net score if all metrics are one', async () => {
    const ramp_up_time = 1.0;
    const correctness = 1.0;
    const bus_factor = 1.0;
    const responsive_maintainer = 1.0;
    const license = 1.0;

    const result = await getNetScore(ramp_up_time, correctness, bus_factor, responsive_maintainer, license);

    expect(result).toEqual(1); // All ones should yield a one net score
  });
});

describe('getNetScoreLatency', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate the correct net score latency based on given latencies', async () => {
    const ramp_up_latency = 10.5;
    const correctness_latency = 8.3;
    const bus_factor_latency = 6.7;
    const responsive_maintainer_latency = 9.2;
    const license_latency = 4.1;

    const result = await getNetScoreLatency(
      ramp_up_latency,
      correctness_latency,
      bus_factor_latency,
      responsive_maintainer_latency,
      license_latency
    );

    // Total latency = 10.5 + 8.3 + 6.7 + 9.2 + 4.1 = 38.8
    expect(result).toEqual(38.8); // Final rounded net score latency
  });

  it('should handle zero latencies and return 0', async () => {
    const ramp_up_latency = 0;
    const correctness_latency = 0;
    const bus_factor_latency = 0;
    const responsive_maintainer_latency = 0;
    const license_latency = 0;

  const result = await getNetScoreLatency(
    ramp_up_latency,
    correctness_latency,
    bus_factor_latency,
    responsive_maintainer_latency,
    license_latency
  );


    expect(result).toEqual(0); // Zero latencies should yield a zero net score latency
  });

  it('should handle a mix of latencies and return the correct latency sum', async () => {
    const ramp_up_latency = 1.2;
    const correctness_latency = 3.4;
    const bus_factor_latency = 5.6;
    const responsive_maintainer_latency = 7.8;
    const license_latency = 9.1;

  const result = await getNetScoreLatency(
    ramp_up_latency,
    correctness_latency,
    bus_factor_latency,
    responsive_maintainer_latency,
    license_latency
  );


    // Total latency = 1.2 + 3.4 + 5.6 + 7.8 + 9.1 = 27.1
    expect(result).toEqual(27.1); // Final rounded latency score
  });
});