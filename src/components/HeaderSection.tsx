import React from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2, Icon } from '@grafana/ui';
import { CustomDashboardListOptions } from '../types';

interface HeaderSectionProps {
  options: CustomDashboardListOptions;
  isAuthority: boolean;
  detectedAuthority?: string;
  detectedBetreiberkennzahl?: string;
  detectedUserName?: string;
  currentUsername?: string;
  isNarrow?: boolean;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  options,
  isAuthority,
  detectedAuthority,
  detectedBetreiberkennzahl,
  detectedUserName,
  currentUsername,
  isNarrow = false,
}) => {
  const styles = useStyles2(getStyles);

  if (!options.header.showHeader) {
    return null;
  }

  const title = options.header.headerTitle;
  // If configured userName is just a numeric ID (e.g. "38"), ignore it in favor of detected name or fallback
  const rawOptionUser = (options.header.userName || '').trim();
  const isOptionUserAnId = /^\d+$/.test(rawOptionUser);
  const displayUser =
    detectedUserName ||
    (!isOptionUserAnId && rawOptionUser ? rawOptionUser : undefined) ||
    currentUsername ||
    'Benutzer';

  const authority = detectedAuthority || options.header.authorityName;
  const bzk = detectedBetreiberkennzahl || options.header.betreiberkennzahl;

  return (
    <div className={styles.container}>
      {/* Header Title Banner - only shown if a custom title is explicitly given */}
      {title && title !== 'Smart Utility & Grid Operations' && (
        <div className={isNarrow ? styles.titleRowNarrow : styles.titleRow}>
          <div className={styles.titleGroup}>
            <div className={styles.titleTextWrapper}>
              <h1 className={isNarrow ? styles.mainTitleNarrow : styles.mainTitle}>{title}</h1>
            </div>
          </div>

          <div className={styles.roleBadge}>
            <Icon name={isAuthority ? 'shield' : 'user'} size="sm" />
            <span>{isAuthority ? 'Aufsichtsansicht' : 'Betreiberansicht'}</span>
          </div>
        </div>
      )}

      {/* User Greeting Card matching exact layout specifications */}
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeText}>
          {isAuthority ? (
            <div className={styles.greetingLine}>
              <span className={styles.welcomeTitle}>Willkommen {displayUser}</span>
              {authority && (
                <span className={styles.authorityTag}> ({authority})</span>
              )}
            </div>
          ) : (
            <div>
              <div className={styles.greetingLine}>
                <span className={styles.welcomeTitle}>Willkommen {displayUser}</span>
              </div>
              {bzk && (
                <div className={styles.bzkLine}>
                  <span className={styles.bzkLabel}>Betreiberkennzahl:</span>{' '}
                  <span className={styles.bzkValue}>{bzk}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
    margin-bottom: ${theme.spacing(1.5)};
  `,
  titleRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: ${theme.spacing(1.5)};
    padding-bottom: ${theme.spacing(1)};
    border-bottom: 1px solid ${theme.colors.border.weak};
  `,
  titleRowNarrow: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing(1)};
    padding-bottom: ${theme.spacing(1)};
    border-bottom: 1px solid ${theme.colors.border.weak};
  `,
  titleGroup: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1.5)};
    width: 100%;
    min-width: 0;
  `,
  titleTextWrapper: css`
    min-width: 0;
    flex: 1;
  `,
  mainTitle: css`
    margin: 0;
    font-size: ${theme.typography.h3.fontSize};
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.colors.text.primary};
    line-height: 1.2;
    word-break: break-word;
  `,
  mainTitleNarrow: css`
    margin: 0;
    font-size: 18px;
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.colors.text.primary};
    line-height: 1.25;
    word-break: break-word;
  `,
  roleBadge: css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: ${theme.shape.radius.pill};
    font-size: ${theme.typography.bodySmall.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.medium};
    color: ${theme.colors.text.primary};
    white-space: nowrap;
  `,
  welcomeCard: css`
    padding: ${theme.spacing(0.5)} 0;
    margin-bottom: ${theme.spacing(0.5)};
    display: inline-flex;
    flex-direction: column;
    border-right: 2px solid ${theme.colors.border.medium};
    padding-right: ${theme.spacing(3)};
  `,
  welcomeText: css`
    color: ${theme.colors.text.primary};
  `,
  greetingLine: css`
    line-height: 1.35;
    word-break: break-word;
  `,
  welcomeTitle: css`
    font-size: clamp(20px, 1.4vw, 26px);
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.colors.text.primary};
  `,
  authorityTag: css`
    font-size: clamp(20px, 1.4vw, 26px);
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.colors.text.primary};
  `,
  bzkLine: css`
    margin-top: 6px;
    font-size: clamp(15px, 1vw, 18px);
    line-height: 1.4;
    color: ${theme.colors.text.primary};
  `,
  bzkLabel: css`
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.colors.text.primary};
  `,
  bzkValue: css`
    font-weight: ${theme.typography.fontWeightRegular};
    color: ${theme.colors.text.primary};
  `,
});
