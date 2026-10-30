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
                  <span className={well.isOnline ? styles.dotContainerOnline : styles.dotContainerOffline}>
                    <span className={well.isOnline ? styles.dotOnline : styles.dotOffline} />
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
                  <span className={styles.metricLabel}>Letzter Zählerstand</span>
                  <span className={styles.metricVal}>
                    {formatMetricValue(well.meterReading, format, readingDecimals, options.meterReadingUnit || 'm³')}
                  </span>
                </div>

                <div className={styles.mobileMetricBox}>
                  <span className={styles.metricLabel}>Wasserentnahme 12h</span>
                  <span className={styles.metricVal}>
                    {formatMetricValue(well.consumption12h, format, consumptionDecimals, options.consumption12hUnit || 'm³')}
                  </span>
                </div>

                <div className={styles.mobileMetricBox}>
                  <span className={styles.metricLabel}>Entnahme lfd. Jahr</span>
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
            <th className={styles.thWell}>Brunnen</th>
            {showOperatorColumn && <th className={styles.thOperator}>Betreiber</th>}
            <th className={styles.thNumber}>Letzter Zählerstand</th>
            <th className={styles.thNumber}>Wasserentnahmen letzte 12 Std.</th>
            <th className={styles.thNumber}>Entnahme im laufenden Kalenderjahr</th>
            <th className={styles.thStatus}>Funkstatus</th>
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
                    <span className={well.isOnline ? styles.dotContainerOnline : styles.dotContainerOffline}>
                      <span className={well.isOnline ? styles.dotOnline : styles.dotOffline} />
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
    scrollbar-width: thin;
    scrollbar-color: ${theme.colors.border.medium} transparent;
    &::-webkit-scrollbar {
      height: 6px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: ${theme.colors.border.medium};
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${theme.colors.border.strong};
    }
  `,
  table: css`
    width: 100%;
    min-width: 680px;
    border-collapse: collapse;
    font-size: clamp(14px, 0.95vw, 17px);
    text-align: left;
  `,
  thWell: css`
    padding: ${theme.spacing(1.25)} ${theme.spacing(1.75)};
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.secondary};
    font-size: clamp(13px, 0.9vw, 16px);
    font-weight: ${theme.typography.fontWeightBold};
    border-bottom: 2px solid ${theme.colors.border.medium};
    min-width: 240px;
  `,
  thOperator: css`
    padding: ${theme.spacing(1.25)} ${theme.spacing(1.75)};
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.secondary};
    font-size: clamp(13px, 0.9vw, 16px);
    font-weight: ${theme.typography.fontWeightBold};
    border-bottom: 2px solid ${theme.colors.border.medium};
    min-width: 150px;
  `,
  thNumber: css`
    padding: ${theme.spacing(1.25)} ${theme.spacing(1.75)};
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.secondary};
    font-size: clamp(13px, 0.9vw, 16px);
    font-weight: ${theme.typography.fontWeightBold};
    border-bottom: 2px solid ${theme.colors.border.medium};
    text-align: right;
    white-space: nowrap;
    min-width: 150px;
  `,
  thStatus: css`
    padding: ${theme.spacing(1.25)} ${theme.spacing(1.75)};
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.secondary};
    font-size: clamp(13px, 0.9vw, 16px);
    font-weight: ${theme.typography.fontWeightBold};
    border-bottom: 2px solid ${theme.colors.border.medium};
    text-align: center;
    width: 120px;
  `,
  row: css`
    border-bottom: 1px solid ${theme.colors.border.weak};
    transition: background 0.15s ease-in-out;
    &:hover {
      background: ${theme.colors.action.hover};
    }
  `,
  tdWell: css`
    padding: ${theme.spacing(1.25)} ${theme.spacing(1.75)};
    font-size: clamp(14px, 1vw, 17px);
    font-weight: ${theme.typography.fontWeightMedium};
  `,
  tdOperator: css`
    padding: ${theme.spacing(1.25)} ${theme.spacing(1.75)};
    font-size: clamp(14px, 0.95vw, 16px);
    color: ${theme.colors.text.secondary};
  `,
  tdNumber: css`
    padding: ${theme.spacing(1.25)} ${theme.spacing(1.75)};
    text-align: right;
    font-size: clamp(14px, 1vw, 17px);
    font-family: ${theme.typography.fontFamilyMonospace};
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.colors.text.primary};
  `,
  tdStatus: css`
    padding: ${theme.spacing(1.25)} ${theme.spacing(1.75)};
    text-align: center;
  `,
  wellLink: css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: clamp(14px, 1vw, 17px);
    color: ${theme.colors.primary.text};
    text-decoration: none;
    cursor: pointer;
    line-height: 1.35;
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
  dotContainerOnline: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: ${theme.colors.success.transparent};
    cursor: help;
    transition: transform 0.15s ease-in-out;
    &:hover {
      transform: scale(1.2);
    }
  `,
  dotContainerOffline: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: ${theme.colors.error.transparent};
    cursor: help;
    transition: transform 0.15s ease-in-out;
    &:hover {
      transform: scale(1.2);
    }
  `,
  dotOnline: css`
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: ${theme.colors.success.text};
    box-shadow: 0 0 8px ${theme.colors.success.text};
  `,
  dotOffline: css`
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: ${theme.colors.error.text};
    box-shadow: 0 0 8px ${theme.colors.error.text};
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
