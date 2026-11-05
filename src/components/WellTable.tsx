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
  // Mobile / Narrow Card View (Ultra-Compact High Density)
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
              {/* Row 1: Well Name Link + Funkstatus Dot */}
              <div className={styles.mobileRowTop}>
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

              {/* Row 2: Zählerstand & Optional Operator */}
              <div className={styles.mobileRowMiddle}>
                <div className={styles.mobileMeterGroup}>
                  <span className={styles.mobileLabel}>Zählerstand:</span>
                  <span className={styles.mobileValBold}>
                    {formatMetricValue(well.meterReading, format, readingDecimals, options.meterReadingUnit || 'm³')}
                  </span>
                </div>
                {showOperatorColumn && well.operator && (
                  <span className={styles.mobileOperatorTag} title="Betreiber">
                    {well.operator}
                  </span>
                )}
              </div>

              {/* Row 3: Secondary Metrics (12h, Jahr, Last Transmission) */}
              <div className={styles.mobileRowBottom}>
                <span>
                  12h: <strong>{formatMetricValue(well.consumption12h, format, consumptionDecimals, options.consumption12hUnit || 'm³')}</strong>
                </span>
                <span className={styles.mobileBullet}>•</span>
                <span>
                  Jahr: <strong>{formatMetricValue(well.consumptionYear, format, consumptionDecimals, options.consumptionYearUnit || 'm³')}</strong>
                </span>
                {well.lastSeenFormatted && well.lastSeenFormatted !== '-' && (
                  <>
                    <span className={styles.mobileBullet}>•</span>
                    <span className={styles.mobileTimestamp} title="Letzter Datentransfer">
                      {well.lastSeenFormatted}
                    </span>
                  </>
                )}
              </div>
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
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    scrollbar-color: ${theme.colors.border.strong} ${theme.colors.background.secondary};
    &::-webkit-scrollbar {
      height: 8px;
    }
    &::-webkit-scrollbar-track {
      background: ${theme.colors.background.secondary};
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${theme.colors.border.strong};
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${theme.colors.text.secondary};
    }
  `,
  table: css`
    width: 100%;
    min-width: 680px;
    border-collapse: collapse;
    font-size: clamp(13px, 0.9vw, 15px);
    text-align: left;
  `,
  thWell: css`
    padding: ${theme.spacing(0.75)} ${theme.spacing(1.25)};
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.secondary};
    font-size: clamp(12px, 0.85vw, 14px);
    font-weight: ${theme.typography.fontWeightBold};
    border-bottom: 2px solid ${theme.colors.border.medium};
    min-width: 220px;
  `,
  thOperator: css`
    padding: ${theme.spacing(0.75)} ${theme.spacing(1.25)};
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.secondary};
    font-size: clamp(12px, 0.85vw, 14px);
    font-weight: ${theme.typography.fontWeightBold};
    border-bottom: 2px solid ${theme.colors.border.medium};
    min-width: 140px;
  `,
  thNumber: css`
    padding: ${theme.spacing(0.75)} ${theme.spacing(1.25)};
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.secondary};
    font-size: clamp(12px, 0.85vw, 14px);
    font-weight: ${theme.typography.fontWeightBold};
    border-bottom: 2px solid ${theme.colors.border.medium};
    text-align: right;
    white-space: nowrap;
    min-width: 140px;
  `,
  thStatus: css`
    padding: ${theme.spacing(0.75)} ${theme.spacing(1.25)};
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.secondary};
    font-size: clamp(12px, 0.85vw, 14px);
    font-weight: ${theme.typography.fontWeightBold};
    border-bottom: 2px solid ${theme.colors.border.medium};
    text-align: center;
    width: 100px;
  `,
  row: css`
    border-bottom: 1px solid ${theme.colors.border.weak};
    transition: background 0.15s ease-in-out;
    &:hover {
      background: ${theme.colors.action.hover};
    }
  `,
  tdWell: css`
    padding: ${theme.spacing(0.75)} ${theme.spacing(1.25)};
    font-size: clamp(13px, 0.9vw, 15px);
    font-weight: ${theme.typography.fontWeightMedium};
  `,
  tdOperator: css`
    padding: ${theme.spacing(0.75)} ${theme.spacing(1.25)};
    font-size: clamp(13px, 0.85vw, 15px);
    color: ${theme.colors.text.secondary};
  `,
  tdNumber: css`
    padding: ${theme.spacing(0.75)} ${theme.spacing(1.25)};
    text-align: right;
    font-size: clamp(13px, 0.9vw, 15px);
    font-family: ${theme.typography.fontFamilyMonospace};
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.colors.text.primary};
  `,
  tdStatus: css`
    padding: ${theme.spacing(0.75)} ${theme.spacing(1.25)};
    text-align: center;
  `,
  wellLink: css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: clamp(13px, 0.9vw, 15px);
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
    width: 24px;
    height: 24px;
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
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${theme.colors.error.transparent};
    cursor: help;
    transition: transform 0.15s ease-in-out;
    &:hover {
      transform: scale(1.2);
    }
  `,
  dotOnline: css`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${theme.colors.success.text};
    box-shadow: 0 0 6px ${theme.colors.success.text};
  `,
  dotOffline: css`
    width: 10px;
    height: 10px;
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
  // Compact Mobile Card Styles (Space-Saving)
  // -------------------------------------------------------------
  cardList: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(0.75)};
    width: 100%;
  `,
  mobileCard: css`
    background: ${theme.colors.background.primary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(0.75)} ${theme.spacing(1)};
    display: flex;
    flex-direction: column;
    gap: 3px;
    transition: background 0.15s ease-in-out, border-color 0.15s ease-in-out;
    &:hover {
      background: ${theme.colors.action.hover};
      border-color: ${theme.colors.border.medium};
    }
  `,
  mobileRowTop: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(1)};
  `,
  mobileRowMiddle: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing(1)};
    margin-top: 1px;
  `,
  mobileMeterGroup: css`
    display: flex;
    align-items: baseline;
    gap: 6px;
  `,
  mobileLabel: css`
    font-size: 11px;
    color: ${theme.colors.text.secondary};
  `,
  mobileValBold: css`
    font-size: 14px;
    font-weight: ${theme.typography.fontWeightBold};
    font-family: ${theme.typography.fontFamilyMonospace};
    color: ${theme.colors.text.primary};
  `,
  mobileOperatorTag: css`
    font-size: 11px;
    color: ${theme.colors.text.secondary};
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.pill};
    padding: 1px 6px;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  mobileRowBottom: css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    font-size: 11px;
    color: ${theme.colors.text.secondary};
    margin-top: 1px;
    strong {
      color: ${theme.colors.text.primary};
      font-family: ${theme.typography.fontFamilyMonospace};
      font-weight: ${theme.typography.fontWeightMedium};
    }
  `,
  mobileBullet: css`
    color: ${theme.colors.text.disabled};
    font-size: 9px;
  `,
  mobileTimestamp: css`
    color: ${theme.colors.text.secondary};
    font-size: 11px;
  `,
});
