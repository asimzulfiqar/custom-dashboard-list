export type ViewMode = 'auto' | 'authority' | 'operator';
export type NumberFormat = 'de-grouped' | 'de-plain' | 'en-grouped' | 'en-plain';

export interface FieldMappings {
  wellNameField?: string;
  wellIdField?: string;
  operatorField?: string;
  meterReadingField?: string;
  consumption12hField?: string;
  consumptionYearField?: string;
  lastSeenField?: string;
  statusField?: string;
  dashboardUidField?: string;
  betreiberkennzahlField?: string;
  authorityNameField?: string;
  roleField?: string;
  userNameField?: string;
}

export interface HeaderOptions {
  showHeader: boolean;
  headerTitle: string;
  userName: string;
  authorityName: string;
  betreiberkennzahl: string;
}

export interface WellLinkOptions {
  wellUrlPattern: string;
  targetDashboardUid: string;
  defaultTimeFrom: string;
  defaultTimeTo: string;
  openInNewTab: boolean;
}

export interface QuickLinksOptions {
  // Primary Monitoring Link (Aufsicht/Authority)
  showGroundwaterLink: boolean;
  groundwaterTitle: string;
  groundwaterLinkLabel: string;
  groundwaterUrl: string;

  // Weather / Environmental Station
  showWeatherLink: boolean;
  weatherTitle: string;
  weatherInternalLinkLabel: string;
  weatherInternalUrl: string;
  weatherExternalLinkLabel: string;
  weatherExternalUrl: string;
}

export interface CustomDashboardListOptions {
  viewMode: ViewMode;
  fieldMappings: FieldMappings;
  header: HeaderOptions;
  wellLinks: WellLinkOptions;
  quickLinks: QuickLinksOptions;

  // Formatting & freshness
  numberFormat: NumberFormat;
  readingDecimals: number;
  consumptionDecimals: number;
  meterReadingUnit: string;
  consumption12hUnit: string;
  consumptionYearUnit: string;
  freshnessHoursThreshold: number; // default 24h
  excludedOperators: string; // Comma-separated list or substring of operators to hide
  searchEnabled: boolean;
  defaultExpandedAccordions: boolean;
  showSampleDataOnEmpty: boolean;
}

export interface WellRow {
  id: string;
  name: string;
  operator: string;
  betreiberkennzahl?: string;
  meterReading?: number | null;
  consumption12h?: number | null;
  consumptionYear?: number | null;
  lastSeen?: number | string | Date | null;
  lastSeenFormatted?: string;
  isOnline: boolean;
  dashboardUid?: string;
  targetUrl: string;
}

export interface BetreiberGroup {
  operatorName: string;
  betreiberkennzahl?: string;
  wells: WellRow[];
  totalConsumption12h: number;
  totalConsumptionYear: number;
  onlineCount: number;
  offlineCount: number;
}
