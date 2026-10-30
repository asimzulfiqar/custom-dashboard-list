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
  const displayUser = detectedUserName || options.header.userName || currentUsername || 'Benutzer';
  const bzk = detectedBetreiberkennzahl || options.header.betreiberkennzahl;

  return (
    <div className={styles.container}>
      {/* Header Title Banner - without logo and without subtitle */}
      {title && (
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

      {/* User Greeting Card */}
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeText}>
          <div className={styles.greetingLine}>
            <span className={styles.welcomeLabel}>Willkommen </span>
            <span className={styles.userName}>{displayUser}</span>
          </div>
          {!isAuthority && bzk && (
            <div className={styles.bzkLine}>
              <span className={styles.bzkLabel}>Betreiber-ID: </span>
              <span className={styles.bzkValue}>{bzk}</span>
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
    gap: ${theme.spacing(1.5)};
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
  iconWrapper: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 8px;
    background: ${theme.colors.primary.transparent};
    color: ${theme.colors.primary.text};
    flex-shrink: 0;
  `,
  headerIcon: css`
    color: ${theme.colors.primary.text};
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
  subtitle: css`
    font-size: ${theme.typography.bodySmall.fontSize};
    color: ${theme.colors.text.secondary};
    margin-top: 2px;
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
    background: ${theme.colors.background.secondary};
    border-left: 4px solid ${theme.colors.primary.border};
    border-radius: 0 ${theme.shape.radius.default} ${theme.shape.radius.default} 0;
    padding: ${theme.spacing(1.25)} ${theme.spacing(1.5)};
    box-shadow: ${theme.shadows.z1};
  `,
  welcomeText: css`
    font-size: 15px;
    color: ${theme.colors.text.primary};
  `,
  greetingLine: css`
    line-height: 1.4;
    word-break: break-word;
  `,
  welcomeLabel: css`
    color: ${theme.colors.text.secondary};
  `,
  userName: css`
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.colors.text.primary};
  `,
  authorityTag: css`
    color: ${theme.colors.text.secondary};
    font-weight: ${theme.typography.fontWeightMedium};
  `,
  bzkLine: css`
    margin-top: 4px;
    font-size: ${theme.typography.body.fontSize};
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  `,
  bzkLabel: css`
    color: ${theme.colors.text.secondary};
    font-weight: ${theme.typography.fontWeightRegular};
  `,
  bzkValue: css`
    font-family: ${theme.typography.fontFamilyMonospace};
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.colors.text.primary};
    background: ${theme.colors.background.canvas};
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid ${theme.colors.border.weak};
  `,
});
