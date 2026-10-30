import { DataFrame, Field } from '@grafana/data';
import {
  BetreiberGroup,
  CustomDashboardListOptions,
  FieldMappings,
  NumberFormat,
  WellRow,
} from './types';

/**
 * Format a number according to German (or English) formatting rules.
 */
export function formatMetricValue(
  value: number | null | undefined,
  format: NumberFormat = 'de-grouped',
  decimals = 0,
  unit = ''
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '-';
  }

  const rounded = Number(value.toFixed(decimals));
  let formatted: string;

  switch (format) {
    case 'de-grouped':
      formatted = rounded.toLocaleString('de-DE', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      break;
    case 'de-plain':
      formatted = rounded.toString().replace('.', ',');
      break;
    case 'en-grouped':
      formatted = rounded.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      break;
    case 'en-plain':
    default:
      formatted = rounded.toString();
      break;
  }

  return unit ? `${formatted} ${unit}`.trim() : formatted;
}

/**
 * Check if a timestamp is within the freshness threshold.
 */
export function evaluateFreshness(
  timestamp: number | string | Date | null | undefined,
  thresholdHours = 24
): { isOnline: boolean; relativeText: string; formattedDate: string } {
  if (!timestamp) {
    return {
      isOnline: false,
      relativeText: 'Keine Daten empfangen',
      formattedDate: '-',
    };
  }

  let timeMs =
    typeof timestamp === 'number'
      ? timestamp
      : new Date(timestamp).getTime();

  if (isNaN(timeMs) || timeMs <= 0) {
    return {
      isOnline: false,
      relativeText: 'Ungültiger Zeitstempel',
      formattedDate: '-',
    };
  }

  // Auto-normalize Unix epoch seconds vs milliseconds vs nanoseconds
  if (timeMs < 1e11) {
    timeMs *= 1000; // seconds -> ms
  } else if (timeMs > 1e14) {
    timeMs = Math.floor(timeMs / 1e6); // nanoseconds -> ms
  }

  const now = Date.now();
  const diffMs = now - timeMs;
  const diffHours = diffMs / (1000 * 60 * 60);

  // Allow slight future clock skew (up to -1 hour) from server/device clock drift
  const isOnline = diffHours >= -1 && diffHours <= thresholdHours;

  const dateObj = new Date(timeMs);
  const formattedDate = dateObj.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let relativeText = '';
  if (diffHours < 1) {
    const mins = Math.max(1, Math.round(diffMs / (1000 * 60)));
    relativeText = `Vor ${mins} Min.`;
  } else if (diffHours < 24) {
    const hrs = Math.round(diffHours);
    relativeText = `Vor ${hrs} Std.`;
  } else {
    const days = Math.round(diffHours / 24);
    relativeText = `Vor ${days} Tag(en) (Kein Empfang > ${thresholdHours}h)`;
  }

  return { isOnline, relativeText, formattedDate };
}

/**
 * Helper to find field index by configured name or auto-detect heuristic.
 */
function findFieldIndex(
  fields: Field[],
  configuredName?: string,
  heuristicRegexes: RegExp[] = []
): number {
  if (configuredName) {
    const idx = fields.findIndex(
      (f) =>
        f.name.toLowerCase() === configuredName.toLowerCase() ||
        (f.labels && Object.values(f.labels).some((l) => l.toLowerCase() === configuredName.toLowerCase()))
    );
    if (idx !== -1) {
      return idx;
    }
  }

  // Fallback to heuristic
  for (const regex of heuristicRegexes) {
    const idx = fields.findIndex((f) => regex.test(f.name) || (f.labels && Object.values(f.labels).some((l) => regex.test(l))));
    if (idx !== -1) {
      return idx;
    }
  }

  return -1;
}

/**
 * Resolve target URL for a dashboard link, interpolating both template variables and well attributes.
 */
export function buildWellUrl(
  wellId: string,
  dashboardUid: string,
  options: CustomDashboardListOptions,
  replaceVariables?: (str: string) => string
): string {
  let pattern = options.wellLinks.wellUrlPattern || '/d/${dashboardUid}?var-device_id=${wellId}&from=${from}&to=${to}';
  if (replaceVariables) {
    pattern = replaceVariables(pattern);
  }

  const targetUid = dashboardUid || (replaceVariables ? replaceVariables(options.wellLinks.targetDashboardUid || '') : options.wellLinks.targetDashboardUid) || '';
  const from = encodeURIComponent(options.wellLinks.defaultTimeFrom || 'now-7d');
  const to = encodeURIComponent(options.wellLinks.defaultTimeTo || 'now');

  return pattern
    .replace(/\${wellId}/g, encodeURIComponent(wellId))
    .replace(/\${id_raw}/g, encodeURIComponent(wellId))
    .replace(/\${id}/g, encodeURIComponent(wellId))
    .replace(/\${dashboardUid}/g, encodeURIComponent(targetUid))
    .replace(/\${from}/g, from)
    .replace(/\${to}/g, to);
}

/**
 * Parse and merge rows from Grafana DataFrames with support for dashboard template variables.
 */
export function extractWellRows(
  series: DataFrame[],
  options: CustomDashboardListOptions,
  replaceVariables?: (str: string) => string
): {
  rows: WellRow[];
  detectedRole?: 'authority' | 'operator' | 'admin';
  detectedAuthority?: string;
  detectedBetreiberkennzahl?: string;
  detectedUserName?: string;
} {
  if (!series || series.length === 0) {
    return { rows: [] };
  }

  const mappings: FieldMappings = options.fieldMappings || {};
  const rowsMap = new Map<string, Partial<WellRow>>();

  // Variable fallbacks if fields are configured as dashboard variables (e.g. ${operator}, ${id}, ${bzk})
  const resolveVar = (val?: string): string => {
    if (!val) {
      return '';
    }
    if (replaceVariables && (val.includes('$') || val.includes('{'))) {
      const res = replaceVariables(val);
      return res !== val ? res : '';
    }
    return '';
  };

  const varOperator = resolveVar(mappings.operatorField);
  const varWellId = resolveVar(mappings.wellIdField);
  const varWellName = resolveVar(mappings.wellNameField);
  const varBzk = resolveVar(mappings.betreiberkennzahlField);
  const varAuth = resolveVar(mappings.authorityNameField);
  const varRole = resolveVar(mappings.roleField);
  const varUser = resolveVar(mappings.userNameField);

  let detectedRole: 'authority' | 'operator' | 'admin' | undefined = varRole
    ? (varRole.toLowerCase().includes('admin')
        ? 'admin'
        : varRole.toLowerCase().includes('author') || varRole.toLowerCase().includes('regulat')
        ? 'authority'
        : 'operator')
    : undefined;
  let detectedAuthority: string | undefined = varAuth || undefined;
  let detectedBetreiberkennzahl: string | undefined = varBzk || undefined;
  let detectedUserName: string | undefined = varUser || undefined;

  for (const frame of series) {
    const fields = frame.fields;
    if (!fields || fields.length === 0) {
      continue;
    }

    const rowCount = frame.length;
    const nameIdx = findFieldIndex(fields, mappings.wellNameField, [/title/i, /brunnenbezeichnung/i, /brunnen/i, /station/i, /anlage/i, /messstelle/i, /^name$/i]);
    const idIdx = findFieldIndex(fields, mappings.wellIdField, [/well_id/i, /objektkennzahl/i, /id_raw/i, /device_id/i, /station_id/i, /meter_id/i, /^id$/i]);
    const operatorIdx = findFieldIndex(fields, mappings.operatorField, [/operator/i, /betreiber/i, /company/i, /vendor/i]);
    const readingIdx = findFieldIndex(fields, mappings.meterReadingField, [/reading/i, /meter/i, /zaehlerstand/i, /value/i, /total/i]);
    const c12hIdx = findFieldIndex(fields, mappings.consumption12hField, [/12h/i, /12_h/i, /consumption_12h/i, /letzte_12/i]);
    const cYearIdx = findFieldIndex(fields, mappings.consumptionYearField, [/year/i, /jahr/i, /annual/i, /gesamt/i]);
    const lastSeenIdx = findFieldIndex(fields, mappings.lastSeenField, [/time/i, /timestamp/i, /last_seen/i, /status_time/i]);
    const statusIdx = findFieldIndex(fields, mappings.statusField, [/status/i, /online/i]);
    const uidIdx = findFieldIndex(fields, mappings.dashboardUidField, [/uid/i, /dashboard/i]);
    const bzkIdx = findFieldIndex(fields, mappings.betreiberkennzahlField, [
      /betreiberkennzahl/i,
      /numerical_id/i,
      /operator_id/i,
      /betreiber_id/i,
      /kennzahl/i,
      /bzk/i,
      /account_id/i,
    ]);
    const authIdx = findFieldIndex(fields, mappings.authorityNameField, [
      /authority/i,
      /regulator/i,
      /agency/i,
      /leitstelle/i,
      /behoerde/i,
      /amt/i,
    ]);
    const roleIdx = findFieldIndex(fields, mappings.roleField, [/role/i, /user_role/i, /user_type/i]);
    const userIdx = findFieldIndex(fields, mappings.userNameField, [/user_name/i, /username/i, /^user$/i, /benutzer/i]);

    const isDefinitionFrame = nameIdx !== -1 || operatorIdx !== -1;

    for (let r = 0; r < rowCount; r++) {
      const rawId = idIdx !== -1 ? String(fields[idIdx].values[r] ?? '') : (varWellId || '');
      const rawName = nameIdx !== -1 && fields[nameIdx].values[r] != null ? String(fields[nameIdx].values[r]).trim() : '';
      const key = rawId || rawName || `row-${r}`;

      if (!key) {
        continue;
      }

      // If this frame contains a well name column (e.g. joined table or metadata query)
      // and this row has no name/title, it means it's an unmatched outer-join row from telemetry.
      // We must skip it to preserve user access permissions.
      if (nameIdx !== -1 && !rawName) {
        continue;
      }

      let existing = rowsMap.get(key);

      // If this is a telemetry-only frame (no name, no operator) and we already have defined wells,
      // do not create phantom wells for unauthorized IDs.
      if (!existing && !isDefinitionFrame && rowsMap.size > 0) {
        continue;
      }

      if (!existing) {
        existing = {
          id: rawId || key,
          name: rawName || rawId || 'Messstelle',
          operator: varOperator || 'Allgemein',
        };
      }

      if (rawId) {
        existing.id = rawId;
      }
      if (rawName) {
        existing.name = rawName;
      }
      if (operatorIdx !== -1 && fields[operatorIdx].values[r] != null && String(fields[operatorIdx].values[r]).trim() !== '') {
        existing.operator = String(fields[operatorIdx].values[r]).trim();
      } else if (varOperator && (!existing.operator || existing.operator === 'Allgemein')) {
        existing.operator = varOperator;
      }

      if (bzkIdx !== -1 && fields[bzkIdx].values[r] != null) {
        const bVal = String(fields[bzkIdx].values[r]).trim();
        if (bVal && bVal !== 'null' && bVal !== 'undefined') {
          existing.betreiberkennzahl = bVal;
          if (!detectedBetreiberkennzahl) {
            detectedBetreiberkennzahl = bVal;
          }
        }
      } else if (varBzk && !existing.betreiberkennzahl) {
        existing.betreiberkennzahl = varBzk;
      }

      if (readingIdx !== -1 && fields[readingIdx].values[r] != null) {
        const val = Number(fields[readingIdx].values[r]);
        if (!isNaN(val)) {
          existing.meterReading = val;
        }
      }
      if (c12hIdx !== -1 && fields[c12hIdx].values[r] != null) {
        const val = Number(fields[c12hIdx].values[r]);
        if (!isNaN(val)) {
          existing.consumption12h = val;
        }
      }
      if (cYearIdx !== -1 && fields[cYearIdx].values[r] != null) {
        const val = Number(fields[cYearIdx].values[r]);
        if (!isNaN(val)) {
          existing.consumptionYear = val;
        }
      }
      if (lastSeenIdx !== -1 && fields[lastSeenIdx].values[r] != null) {
        existing.lastSeen = fields[lastSeenIdx].values[r];
      }
      if (statusIdx !== -1 && fields[statusIdx].values[r] != null) {
        const sVal = fields[statusIdx].values[r];
        if (typeof sVal === 'boolean') {
          existing.isOnline = sVal;
        } else if (typeof sVal === 'number') {
          existing.isOnline = sVal === 1;
        } else if (typeof sVal === 'string') {
          existing.isOnline = sVal.toLowerCase() === 'green' || sVal.toLowerCase() === 'online' || sVal === '1';
        }
      }
      if (uidIdx !== -1 && fields[uidIdx].values[r] != null) {
        existing.dashboardUid = String(fields[uidIdx].values[r]);
      }

      if (authIdx !== -1 && fields[authIdx].values[r] != null && !detectedAuthority) {
        detectedAuthority = String(fields[authIdx].values[r]);
      }
      if (userIdx !== -1 && fields[userIdx].values[r] != null && !detectedUserName) {
        const uVal = String(fields[userIdx].values[r]).trim();
        if (uVal) {
          detectedUserName = uVal;
        }
      }
      if (roleIdx !== -1 && fields[roleIdx].values[r] != null && !detectedRole) {
        const rVal = String(fields[roleIdx].values[r]).toLowerCase();
        if (rVal.includes('admin')) {
          detectedRole = 'admin';
        } else if (rVal.includes('author') || rVal.includes('regulat') || rVal.includes('supervis')) {
          detectedRole = 'authority';
        } else if (rVal.includes('operat') || rVal.includes('client') || rVal.includes('user')) {
          detectedRole = 'operator';
        }
      }

      rowsMap.set(key, existing);
    }
  }

  const excludedList = (options.excludedOperators ?? 'Hauptbetreiber')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const shouldExclude = (op: string) => {
    if (!op) return false;
    const lower = op.toLowerCase();
    return excludedList.some((ex) => lower.includes(ex));
  };

  const rows: WellRow[] = Array.from(rowsMap.values())
    .filter((p) => !shouldExclude(p.operator || ''))
    .map((p) => {
    const id = p.id || 'unbekannt';
    const name = p.name || id;
    const operator = p.operator || varOperator || 'Allgemein';
    const freshness = evaluateFreshness(p.lastSeen, options.freshnessHoursThreshold || 24);
    const isOnline = p.isOnline !== undefined ? p.isOnline : freshness.isOnline;
    const targetUrl = buildWellUrl(id, p.dashboardUid || '', options, replaceVariables);

    return {
      id,
      name,
      operator,
      betreiberkennzahl: p.betreiberkennzahl || varBzk,
      meterReading: p.meterReading ?? null,
      consumption12h: p.consumption12h ?? null,
      consumptionYear: p.consumptionYear ?? null,
      lastSeen: p.lastSeen,
      lastSeenFormatted: freshness.formattedDate,
      isOnline,
      dashboardUid: p.dashboardUid,
      targetUrl,
    };
  });

  return { rows, detectedRole, detectedAuthority, detectedBetreiberkennzahl, detectedUserName };
}

/**
 * Group flat rows by operator.
 */
export function groupWellsByOperator(rows: WellRow[], excludedOperators?: string): BetreiberGroup[] {
  const groupsMap = new Map<string, BetreiberGroup>();

  const excludedList = (excludedOperators ?? 'Hauptbetreiber')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const shouldExclude = (op: string) => {
    if (!op) return false;
    const lower = op.toLowerCase();
    return excludedList.some((ex) => lower.includes(ex));
  };

  for (const row of rows) {
    const op = row.operator || 'Allgemein';
    if (shouldExclude(op)) {
      continue;
    }
    let group = groupsMap.get(op);
    if (!group) {
      group = {
        operatorName: op,
        betreiberkennzahl: row.betreiberkennzahl,
        wells: [],
        totalConsumption12h: 0,
        totalConsumptionYear: 0,
        onlineCount: 0,
        offlineCount: 0,
      };
      groupsMap.set(op, group);
    }

    group.wells.push(row);
    if (row.betreiberkennzahl && !group.betreiberkennzahl) {
      group.betreiberkennzahl = row.betreiberkennzahl;
    }
    if (row.consumption12h) {
      group.totalConsumption12h += row.consumption12h;
    }
    if (row.consumptionYear) {
      group.totalConsumptionYear += row.consumptionYear;
    }
    if (row.isOnline) {
      group.onlineCount += 1;
    } else {
      group.offlineCount += 1;
    }
  }

  // Sort groups alphabetically by operator name
  return Array.from(groupsMap.values()).sort((a, b) => a.operatorName.localeCompare(b.operatorName, 'de-DE'));
}

/**
 * Built-in generic sample dataset for utility & smart microgrid monitoring.
 */
export const SAMPLE_WELL_ROWS: WellRow[] = [
  {
    id: 'FL-101',
    name: 'Einspeisestation Node-Alpha (FL-101)',
    operator: 'Stadtwerke Sektor Nord (GmbH)',
    betreiberkennzahl: 'OPS-DE-1044',
    meterReading: 245890,
    consumption12h: 124,
    consumptionYear: 245890,
    lastSeen: Date.now() - 1.5 * 3600 * 1000,
    lastSeenFormatted: new Date(Date.now() - 1.5 * 3600 * 1000).toLocaleString('de-DE'),
    isOnline: true,
    targetUrl: '/d/telemetry-detail?var-device_id=FL-101&from=now-7d&to=now',
  },
  {
    id: 'FL-102',
    name: 'Druckminderstation Beta (FL-102)',
    operator: 'Stadtwerke Sektor Nord (GmbH)',
    betreiberkennzahl: 'OPS-DE-1044',
    meterReading: 68420,
    consumption12h: 35,
    consumptionYear: 68420,
    lastSeen: Date.now() - 3.8 * 3600 * 1000,
    lastSeenFormatted: new Date(Date.now() - 3.8 * 3600 * 1000).toLocaleString('de-DE'),
    isOnline: true,
    targetUrl: '/d/telemetry-detail?var-device_id=FL-102&from=now-7d&to=now',
  },
  {
    id: 'FL-103',
    name: 'Verteilerknoten Nord 03 (FL-103)',
    operator: 'Stadtwerke Sektor Nord (GmbH)',
    betreiberkennzahl: 'OPS-DE-1044',
    meterReading: 512300,
    consumption12h: 0,
    consumptionYear: 512300,
    lastSeen: Date.now() - 8 * 3600 * 1000,
    lastSeenFormatted: new Date(Date.now() - 8 * 3600 * 1000).toLocaleString('de-DE'),
    isOnline: true,
    targetUrl: '/d/telemetry-detail?var-device_id=FL-103&from=now-7d&to=now',
  },
  {
    id: 'FL-104',
    name: 'Pumpwerk Zentral 04 (FL-104)',
    operator: 'Stadtwerke Sektor Nord (GmbH)',
    betreiberkennzahl: 'OPS-DE-1044',
    meterReading: 389140,
    consumption12h: null,
    consumptionYear: 389140,
    lastSeen: Date.now() - 34 * 3600 * 1000, // > 24h offline
    lastSeenFormatted: new Date(Date.now() - 34 * 3600 * 1000).toLocaleString('de-DE'),
    isOnline: false,
    targetUrl: '/d/telemetry-detail?var-device_id=FL-104&from=now-7d&to=now',
  },
  {
    id: 'DS-201',
    name: 'Hauptübergabestation Süd (DS-201)',
    operator: 'Industriepark Süd Betriebsgesellschaft',
    betreiberkennzahl: 'OPS-DE-2088',
    meterReading: 780450,
    consumption12h: 210,
    consumptionYear: 780450,
    lastSeen: Date.now() - 40 * 60 * 1000,
    lastSeenFormatted: new Date(Date.now() - 40 * 60 * 1000).toLocaleString('de-DE'),
    isOnline: true,
    targetUrl: '/d/telemetry-detail?var-device_id=DS-201&from=now-7d&to=now',
  },
  {
    id: 'DS-202',
    name: 'Kühlkreislaufmesspunkt 02 (DS-202)',
    operator: 'Industriepark Süd Betriebsgesellschaft',
    betreiberkennzahl: 'OPS-DE-2088',
    meterReading: 142800,
    consumption12h: 45,
    consumptionYear: 142800,
    lastSeen: Date.now() - 52 * 3600 * 1000, // > 24h offline
    lastSeenFormatted: new Date(Date.now() - 52 * 3600 * 1000).toLocaleString('de-DE'),
    isOnline: false,
    targetUrl: '/d/telemetry-detail?var-device_id=DS-202&from=now-7d&to=now',
  },
  {
    id: 'SP-301',
    name: 'Speicherbecken Zulauf 01 (SP-301)',
    operator: 'Energie- & Wasserverbund West',
    betreiberkennzahl: 'OPS-DE-3099',
    meterReading: 94600,
    consumption12h: 18,
    consumptionYear: 94600,
    lastSeen: Date.now() - 2.5 * 3600 * 1000,
    lastSeenFormatted: new Date(Date.now() - 2.5 * 3600 * 1000).toLocaleString('de-DE'),
    isOnline: true,
    targetUrl: '/d/telemetry-detail?var-device_id=SP-301&from=now-7d&to=now',
  },
];
