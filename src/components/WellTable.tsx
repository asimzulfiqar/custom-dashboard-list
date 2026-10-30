import React from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2, Icon, Tooltip } from '@grafana/ui';
import { CustomDashboardListOptions, WellRow } from '../types';
import { formatMetricValue } from '../utils';

interface WellTableProps {
  wells: WellRow[];
  options: CustomDashboardListOptions;
  showOperatorColumn?: boolean;
  isNarrow?: boolean;
}

export const WellTable: React.FC<WellTableProps> = ({
  wells,
  options,
  showOperatorColumn = false,
  isNarrow = false,
}) => {
  const styles = useStyles2(getStyles);

  if (wells.length === 0) {
    return (
      <div className={styles.emptyState}>
        Keine Messstellen oder Anlagen für diesen Betreiber gefunden.
      </div>
    );
  }

  const readingDecimals = options.readingDecimals ?? 0;
  const consumptionDecimals = options.consumptionDecimals ?? 0;
  const format = options.numberFormat || 'de-grouped';
  const openNewTab = options.wellLinks.openInNewTab;

  // -------------------------------------------------------------
  // Mobile / Narrow Card View
  // -------------------------------------------------------------
  if (isNarrow) {
    return (
      <div className={styles.cardList}>
        {wells.map((well) => {
          const statusTooltip = well.isOnline
            ? `Online: Letzte Datenübertragung am ${well.lastSeenFormatted || 'vor kurzem'}`
            : `Offline: Keine Datenübertragung seit mehr als ${options.freshnessHoursThreshold || 24} Stunden! (${well.lastSeenFormatted || 'unbekannt'})`;

          return (
            <div key={well.id} className={styles.mobileCard}>
              {/* Card Header: Device Name & Status Pill */}
              <div className={styles.mobileCardHeader}>
                <a
                  href={well.targetUrl}
                  target={openNewTab ? '_blank' : '_self'}
                  rel={openNewTab ? 'noopener noreferrer' : undefined}
                  className={styles.wellLink}
                  title="Zum Detail-Dashboard"
                >
                  <Icon name="link" size="sm" className={styles.linkIcon} />
                  <span className={styles.wellTitle}>{well.name}</span>
                </a>

                <Tooltip content={statusTooltip} placement="top">
                  <span className={well.isOnline ? styles.statusPillOnline : styles.statusPillOffline}>
                    <span className={well.isOnline ? styles.dotOnline : styles.dotOffline} />
                    {well.isOnline ? 'Online' : (well.lastSeen ? `> ${options.freshnessHoursThreshold || 24}h` : 'Keine Daten')}
                  </span>
                </Tooltip>
              </div>

              {/* Sub-info if operator or ID available */}
              {(showOperatorColumn && well.operator) && (
                <div className={styles.mobileCardSub}>
                  <Icon name="user" size="xs" /> {well.operator}
                </div>
              )}

              {/* Responsive Metrics Grid */}
              <div className={styles.mobileMetricsGrid}>
                <div className={styles.mobileMetricBox}>
                  <span className={styles.metricLabel}>Zählerstand</span>
                  <span className={styles.metricVal}>
                    {formatMetricValue(well.meterReading, format, readingDecimals, options.meterReadingUnit || 'm³')}
                  </span>
                </div>

                <div className={styles.mobileMetricBox}>
                  <span className={styles.metricLabel}>Verbrauch 12h</span>
                  <span className={styles.metricVal}>
                    {formatMetricValue(well.consumption12h, format, consumptionDecimals, options.consumption12hUnit || 'm³')}
                  </span>
                </div>

                <div className={styles.mobileMetricBox}>
                  <span className={styles.metricLabel}>Verbrauch Jahr</span>
                  <span className={styles.metricVal}>
                    {formatMetricValue(well.consumptionYear, format, consumptionDecimals, options.consumptionYearUnit || 'm³')}
                  </span>
                </div>
              </div>

              {/* Footer Timestamp */}
              {well.lastSeenFormatted && well.lastSeenFormatted !== '-' && (
                <div className={styles.mobileCardFooter}>
                  <span>Letzter Datentransfer: {well.lastSeenFormatted}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // -------------------------------------------------------------
  // Desktop / Wide Table View
  // -------------------------------------------------------------
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thWell}>Messstelle / Station</th>
            {showOperatorColumn && <th className={styles.thOperator}>Betreiber</th>}
            <th className={styles.thNumber}>Aktueller Zählerstand</th>
            <th className={styles.thNumber}>Verbrauch letzte 12 Std.</th>
            <th className={styles.thNumber}>Gesamtverbrauch laufendes Jahr</th>
            <th className={styles.thStatus}>Übertragungsstatus</th>
          </tr>
        </thead>
        <tbody>
          {wells.map((well) => {
            const statusTooltip = well.isOnline
              ? `Online: Letzte Datenübertragung am ${well.lastSeenFormatted || 'vor kurzem'}`
              : `Offline: Keine Datenübertragung seit mehr als ${options.freshnessHoursThreshold || 24} Stunden! (Letzter Stand: ${well.lastSeenFormatted || 'unbekannt'})`;

            return (
              <tr key={well.id} className={styles.row}>
                <td className={styles.tdWell}>
                  <a
                    href={well.targetUrl}
                    target={openNewTab ? '_blank' : '_self'}
                    rel={openNewTab ? 'noopener noreferrer' : undefined}
                    className={styles.wellLink}
                    title="Zum Detail-Dashboard"
                  >
                    <Icon name="link" size="sm" className={styles.linkIcon} />
                    <span className={styles.wellTitle}>{well.name}</span>
                  </a>
                </td>

                {showOperatorColumn && (
                  <td className={styles.tdOperator}>{well.operator}</td>
                )}

                <td className={styles.tdNumber}>
                  {formatMetricValue(well.meterReading, format, readingDecimals, options.meterReadingUnit || 'm³')}
                </td>

                <td className={styles.tdNumber}>
                  {formatMetricValue(well.consumption12h, format, consumptionDecimals, options.consumption12hUnit || 'm³')}
                </td>

                <td className={styles.tdNumber}>
                  {formatMetricValue(well.consumptionYear, format, consumptionDecimals, options.consumptionYearUnit || 'm³')}
                </td>

                <td className={styles.tdStatus}>
                  <Tooltip content={statusTooltip} placement="top">
                    <span className={well.isOnline ? styles.statusPillOnline : styles.statusPillOffline}>
                      <span className={well.isOnline ? styles.dotOnline : styles.dotOffline} />
                      {well.isOnline ? 'Online' : (well.lastSeen ? `> ${options.freshnessHoursThreshold || 24}h` : 'Keine Daten')}
                    </span>
                  </Tooltip>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  tableWrapper: css`
    width: 100%;
    overflow-x: auto;
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    background: ${theme.colors.background.primary};
  `,
  table: css`
    width: 100%;
    border-collapse: collapse;
    font-size: ${theme.typography.bodySmall.fontSize};
    text-align: left;
  `,
  thWell: css`
    padding: ${theme.spacing(1)} ${theme.spacing(1.5)};
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.secondary};
    font-weight: ${theme.typography.fontWeightBold};
    border-bottom: 2px solid ${theme.colors.border.medium};
    min-width: 240px;
  `,
  thOperator: css`
    padding: ${theme.spacing(1)} ${theme.spacing(1.5)};
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.secondary};
    font-weight: ${theme.typography.fontWeightBold};
    border-bottom: 2px solid ${theme.colors.border.medium};
    min-width: 150px;
  `,
  thNumber: css`
    padding: ${theme.spacing(1)} ${theme.spacing(1.5)};
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.secondary};
    font-weight: ${theme.typography.fontWeightBold};
    border-bottom: 2px solid ${theme.colors.border.medium};
    text-align: right;
    white-space: nowrap;
    min-width: 140px;
  `,
  thStatus: css`
    padding: ${theme.spacing(1)} ${theme.spacing(1.5)};
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.secondary};
    font-weight: ${theme.typography.fontWeightBold};
    border-bottom: 2px solid ${theme.colors.border.medium};
    text-align: center;
    width: 110px;
  `,
  row: css`
    border-bottom: 1px solid ${theme.colors.border.weak};
    transition: background 0.15s ease-in-out;
    &:hover {
      background: ${theme.colors.action.hover};
    }
  `,
  tdWell: css`
    padding: ${theme.spacing(1)} ${theme.spacing(1.5)};
    font-weight: ${theme.typography.fontWeightMedium};
  `,
  tdOperator: css`
    padding: ${theme.spacing(1)} ${theme.spacing(1.5)};
    color: ${theme.colors.text.secondary};
  `,
  tdNumber: css`
    padding: ${theme.spacing(1)} ${theme.spacing(1.5)};
    text-align: right;
    font-family: ${theme.typography.fontFamilyMonospace};
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.colors.text.primary};
  `,
  tdStatus: css`
    padding: ${theme.spacing(1)} ${theme.spacing(1.5)};
    text-align: center;
  `,
  wellLink: css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: ${theme.colors.primary.text};
    text-decoration: none;
    cursor: pointer;
    line-height: 1.3;
    &:hover {
      text-decoration: underline;
    }
  `,
  linkIcon: css`
    color: ${theme.colors.text.secondary};
    flex-shrink: 0;
  `,
  wellTitle: css`
    word-break: break-word;
  `,
  statusPillOnline: css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 8px;
    border-radius: ${theme.shape.radius.pill};
    font-size: ${theme.typography.bodySmall.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
    background: ${theme.colors.success.transparent};
    color: ${theme.colors.success.text};
    border: 1px solid ${theme.colors.success.border};
    cursor: help;
    white-space: nowrap;
  `,
  statusPillOffline: css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 8px;
    border-radius: ${theme.shape.radius.pill};
    font-size: ${theme.typography.bodySmall.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
    background: ${theme.colors.error.transparent};
    color: ${theme.colors.error.text};
    border: 1px solid ${theme.colors.error.border};
    cursor: help;
    white-space: nowrap;
  `,
  dotOnline: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${theme.colors.success.text};
    box-shadow: 0 0 6px ${theme.colors.success.text};
  `,
  dotOffline: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${theme.colors.error.text};
    box-shadow: 0 0 6px ${theme.colors.error.text};
  `,
  emptyState: css`
    padding: ${theme.spacing(2)};
    text-align: center;
    color: ${theme.colors.text.secondary};
    background: ${theme.colors.background.secondary};
    border-radius: ${theme.shape.radius.default};
    border: 1px dashed ${theme.colors.border.medium};
  `,

  // -------------------------------------------------------------
  // Mobile Card Styles
  // -------------------------------------------------------------
  cardList: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.25)};
    width: 100%;
  `,
  mobileCard: css`
    background: ${theme.colors.background.primary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(1.5)};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
    box-shadow: ${theme.shadows.z1};
  `,
  mobileCardHeader: css`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${theme.spacing(1)};
  `,
  mobileCardSub: css`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: ${theme.typography.bodySmall.fontSize};
    color: ${theme.colors.text.secondary};
  `,
  mobileMetricsGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    gap: ${theme.spacing(1)};
    padding: ${theme.spacing(1)};
    background: ${theme.colors.background.secondary};
    border-radius: 4px;
  `,
  mobileMetricBox: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
  `,
  metricLabel: css`
    font-size: 11px;
    color: ${theme.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.3px;
  `,
  metricVal: css`
    font-size: 14px;
    font-family: ${theme.typography.fontFamilyMonospace};
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.colors.text.primary};
  `,
  mobileCardFooter: css`
    font-size: 11px;
    color: ${theme.colors.text.secondary};
    border-top: 1px solid ${theme.colors.border.weak};
    padding-top: 4px;
  `,
});
