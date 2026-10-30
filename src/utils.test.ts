import { formatMetricValue, evaluateFreshness, groupWellsByOperator } from './utils';
import { WellRow } from './types';

describe('formatMetricValue', () => {
  it('formats German grouped numbers properly', () => {
    expect(formatMetricValue(22123, 'de-grouped', 0, 'm³')).toBe('22.123 m³');
    expect(formatMetricValue(21, 'de-grouped', 0, 'm³')).toBe('21 m³');
    expect(formatMetricValue(0, 'de-grouped', 0, 'm³')).toBe('0 m³');
    expect(formatMetricValue(5458.5, 'de-grouped', 1, 'm³')).toBe('5.458,5 m³');
  });

  it('handles null and undefined gracefully with fallback dash', () => {
    expect(formatMetricValue(null, 'de-grouped', 0, 'm³')).toBe('-');
    expect(formatMetricValue(undefined, 'de-grouped', 0, 'm³')).toBe('-');
    expect(formatMetricValue(NaN, 'de-grouped', 0, 'm³')).toBe('-');
  });
});

describe('evaluateFreshness', () => {
  it('marks data received within 24 hours as online', () => {
    const recent = Date.now() - 2 * 60 * 60 * 1000; // 2 hours ago
    const result = evaluateFreshness(recent, 24);
    expect(result.isOnline).toBe(true);
    expect(result.relativeText).toContain('Vor 2 Std.');
  });

  it('marks data older than 24 hours as offline', () => {
    const old = Date.now() - 30 * 60 * 60 * 1000; // 30 hours ago
    const result = evaluateFreshness(old, 24);
    expect(result.isOnline).toBe(false);
    expect(result.relativeText).toContain('Kein Empfang > 24h');
  });

  it('marks null or invalid timestamps as offline', () => {
    expect(evaluateFreshness(null).isOnline).toBe(false);
    expect(evaluateFreshness('invalid').isOnline).toBe(false);
  });
});

describe('groupWellsByOperator', () => {
  it('groups flat rows by operator and aggregates metrics', () => {
    const rows: WellRow[] = [
      {
        id: 'FL-101',
        name: 'Station 01',
        operator: 'Stadtwerke Sektor Nord (GmbH)',
        meterReading: 1000,
        consumption12h: 10,
        consumptionYear: 500,
        isOnline: true,
        targetUrl: '/d/1',
      },
      {
        id: 'FL-102',
        name: 'Station 02',
        operator: 'Stadtwerke Sektor Nord (GmbH)',
        meterReading: 2000,
        consumption12h: 5,
        consumptionYear: 300,
        isOnline: false,
        targetUrl: '/d/2',
      },
      {
        id: 'DS-201',
        name: 'Station 03',
        operator: 'Industriepark Süd Betriebsgesellschaft',
        meterReading: 5000,
        consumption12h: 20,
        consumptionYear: 1200,
        isOnline: true,
        targetUrl: '/d/3',
      },
    ];

    const groups = groupWellsByOperator(rows);
    expect(groups.length).toBe(2);

    const stadtwerke = groups.find((g) => g.operatorName === 'Stadtwerke Sektor Nord (GmbH)')!;
    expect(stadtwerke.wells.length).toBe(2);
    expect(stadtwerke.totalConsumption12h).toBe(15);
    expect(stadtwerke.totalConsumptionYear).toBe(800);
    expect(stadtwerke.onlineCount).toBe(1);
    expect(stadtwerke.offlineCount).toBe(1);

    const industriepark = groups.find((g) => g.operatorName === 'Industriepark Süd Betriebsgesellschaft')!;
    expect(industriepark.wells.length).toBe(1);
    expect(industriepark.totalConsumption12h).toBe(20);
    expect(industriepark.onlineCount).toBe(1);
  });
});
