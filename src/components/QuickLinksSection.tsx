import React from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2, Icon } from '@grafana/ui';
import { CustomDashboardListOptions } from '../types';

interface QuickLinksSectionProps {
  options: CustomDashboardListOptions;
  isAuthority: boolean;
  isNarrow?: boolean;
}

export const QuickLinksSection: React.FC<QuickLinksSectionProps> = ({
  options,
  isAuthority,
  isNarrow = false,
}) => {
  const styles = useStyles2(getStyles);
  const ql = options.quickLinks;

  const showGroundwater = isAuthority && ql.showGroundwaterLink;
  const showWeather = ql.showWeatherLink;

  if (!showGroundwater && !showWeather) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.sectionHeading}>
        Weitere Messstellen & Messwerte
      </h3>

      <div className={isNarrow ? styles.cardsGridNarrow : styles.cardsGrid}>
        {/* Card 1: Zentrale Netzüberwachung (Only for Authorities) */}
        {showGroundwater && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTextWrapper}>
                <h4 className={styles.cardTitle}>{ql.groundwaterTitle || 'Zentrale Netz- & Pegelüberwachung'}</h4>
              </div>
            </div>

            <div className={styles.linkList}>
              <a
                href={ql.groundwaterUrl || '/d/grid-telemetry'}
                className={styles.primaryLink}
              >
                <Icon name="arrow-right" size="sm" />
                <span>{ql.groundwaterLinkLabel || 'Zu den Netzmesswerten'}</span>
              </a>
            </div>
          </div>
        )}

        {/* Card 2: Meteorologische Station */}
        {showWeather && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTextWrapper}>
                <h4 className={styles.cardTitle}>{ql.weatherTitle || 'Meteorologische Referenzstation'}</h4>
              </div>
            </div>

            <div className={styles.linkList}>
              {/* Internal Telemetry Link */}
              {isAuthority && ql.weatherInternalUrl && (
                <a
                  href={ql.weatherInternalUrl}
                  className={styles.primaryLink}
                >
                  <Icon name="database" size="sm" />
                  <span>{ql.weatherInternalLinkLabel || 'Zu den meteorologischen Stationsdaten'}</span>
                </a>
              )}

              {/* External Link */}
              {ql.weatherExternalUrl && (
                <a
                  href={ql.weatherExternalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.externalLink}
                >
                  <Icon name="external-link-alt" size="sm" />
                  <span>{ql.weatherExternalLinkLabel || 'Nationaler Wetterdienst (DWD)'}</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.5)};
    margin-top: ${theme.spacing(1)};
    padding-top: ${theme.spacing(1.5)};
    border-top: 1px solid ${theme.colors.border.weak};
  `,
  sectionHeading: css`
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 15px;
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.colors.text.primary};
  `,
  cardsGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: ${theme.spacing(1.5)};
  `,
  cardsGridNarrow: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.5)};
    width: 100%;
  `,
  card: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(1.5)};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: ${theme.spacing(1.25)};
    box-shadow: ${theme.shadows.z1};
  `,
  cardHeader: css`
    display: flex;
    align-items: flex-start;
    gap: ${theme.spacing(1.25)};
  `,
  cardTextWrapper: css`
    min-width: 0;
    flex: 1;
  `,
  cardIconWater: css`
    width: 36px;
    height: 36px;
    border-radius: 6px;
    background: ${theme.colors.primary.transparent};
    color: ${theme.colors.primary.text};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  `,
  cardIconWeather: css`
    width: 36px;
    height: 36px;
    border-radius: 6px;
    background: ${theme.colors.warning.transparent};
    color: ${theme.colors.warning.text};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  `,
  cardTitle: css`
    margin: 0 0 3px 0;
    font-size: 15px;
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.colors.text.primary};
    line-height: 1.3;
  `,
  cardDescription: css`
    margin: 0;
    font-size: ${theme.typography.bodySmall.fontSize};
    color: ${theme.colors.text.secondary};
    line-height: 1.3;
  `,
  linkList: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(0.75)};
    padding-top: ${theme.spacing(1)};
    border-top: 1px solid ${theme.colors.border.weak};
  `,
  primaryLink: css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: ${theme.typography.body.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.colors.primary.text};
    text-decoration: none;
    line-height: 1.3;
    &:hover {
      text-decoration: underline;
    }
  `,
  externalLink: css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: ${theme.typography.body.fontSize};
    color: ${theme.colors.text.secondary};
    text-decoration: none;
    line-height: 1.3;
    &:hover {
      color: ${theme.colors.primary.text};
      text-decoration: underline;
    }
  `,
});
