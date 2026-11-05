import React, { useMemo } from 'react';
import { PanelProps } from '@grafana/data';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2, Icon } from '@grafana/ui';
import { CustomDashboardListOptions } from '../types';
import { extractWellRows, groupWellsByOperator, SAMPLE_WELL_ROWS } from '../utils';
import { HeaderSection } from './HeaderSection';
import { WellTable } from './WellTable';
import { BetreiberAccordion } from './BetreiberAccordion';
import { QuickLinksSection } from './QuickLinksSection';

interface Props extends PanelProps<CustomDashboardListOptions> {}

export const CustomDashboardListPanel: React.FC<Props> = ({
  options,
  data,
  width,
  height,
  replaceVariables,
}) => {
  const styles = useStyles2(getStyles);

  // Responsive breakpoint: narrow panel (mobile screen or narrow column < 720px)
  const isNarrow = width < 720;

  // Resolve template variables in options
  const interpolatedOptions = useMemo<CustomDashboardListOptions>(() => {
    if (!replaceVariables) {
      return options;
    }
    return {
      ...options,
      header: {
        ...options.header,
        headerTitle: replaceVariables(options.header.headerTitle || ''),
        userName: replaceVariables(options.header.userName || ''),
        authorityName: replaceVariables(options.header.authorityName || ''),
        betreiberkennzahl: replaceVariables(options.header.betreiberkennzahl || ''),
      },
      quickLinks: {
        ...options.quickLinks,
        groundwaterTitle: replaceVariables(options.quickLinks.groundwaterTitle || ''),
        groundwaterLinkLabel: replaceVariables(options.quickLinks.groundwaterLinkLabel || ''),
        groundwaterUrl: replaceVariables(options.quickLinks.groundwaterUrl || ''),
        weatherTitle: replaceVariables(options.quickLinks.weatherTitle || ''),
        weatherInternalLinkLabel: replaceVariables(options.quickLinks.weatherInternalLinkLabel || ''),
        weatherInternalUrl: replaceVariables(options.quickLinks.weatherInternalUrl || ''),
        weatherExternalLinkLabel: replaceVariables(options.quickLinks.weatherExternalLinkLabel || ''),
        weatherExternalUrl: replaceVariables(options.quickLinks.weatherExternalUrl || ''),
      },
      wellLinks: {
        ...options.wellLinks,
        wellUrlPattern: replaceVariables(options.wellLinks.wellUrlPattern || ''),
        targetDashboardUid: replaceVariables(options.wellLinks.targetDashboardUid || ''),
      },
    };
  }, [options, replaceVariables]);

  // Extract and merge rows from all query data frames, resolving any mapped dashboard variables
  const { extractedRows, detectedRole, detectedAuthority, detectedBetreiberkennzahl, detectedUserName } = useMemo(() => {
    const res = extractWellRows(data.series || [], interpolatedOptions, replaceVariables);
    return {
      extractedRows: res.rows,
      detectedRole: res.detectedRole,
      detectedAuthority: res.detectedAuthority,
      detectedBetreiberkennzahl: res.detectedBetreiberkennzahl,
      detectedUserName: res.detectedUserName,
    };
  }, [data.series, interpolatedOptions, replaceVariables]);

  const showSample = interpolatedOptions.showSampleDataOnEmpty ?? true;
  const isUsingSampleData = extractedRows.length === 0 && showSample;
  const rows = isUsingSampleData ? SAMPLE_WELL_ROWS : extractedRows;

  // Group devices by operator
  const groups = useMemo(() => {
    return groupWellsByOperator(rows, options.excludedOperators);
  }, [rows, options.excludedOperators]);

  // Determine whether to display Authority or Operator layout
  const isAuthority = useMemo(() => {
    if (interpolatedOptions.viewMode === 'authority') {
      return true;
    }
    if (interpolatedOptions.viewMode === 'operator') {
      return false;
    }

    // Auto mode
    if (detectedRole === 'authority' || detectedRole === 'admin') {
      return true;
    }
    if (detectedRole === 'operator') {
      return false;
    }

    // Heuristic: If more than 1 operator is present in data, this is an authority / multi-operator overview
    return groups.length > 1;
  }, [interpolatedOptions.viewMode, detectedRole, groups.length]);

  return (
    <div
      className={isNarrow ? styles.containerNarrow : styles.container}
      style={{
        width: '100%',
        maxWidth: `${width}px`,
        height: `${height}px`,
        maxHeight: `${height}px`,
        overflowY: 'auto',
        overflowX: isNarrow ? 'hidden' : 'auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Sample Data Banner */}
      {isUsingSampleData && (
        <div className={styles.sampleDataBanner}>
          <Icon name="info-circle" size="sm" />
          <span>Vorschau-Modus mit Demodaten für Versorgungsnetze. Sobald eine Datenabfrage konfiguriert ist, wird diese Ansicht automatisch ersetzt.</span>
        </div>
      )}

      {/* Header & Greeting Banner */}
      <HeaderSection
        options={interpolatedOptions}
        isAuthority={isAuthority}
        detectedRole={detectedRole}
        detectedAuthority={detectedAuthority}
        detectedBetreiberkennzahl={detectedBetreiberkennzahl || rows.find((r) => Boolean(r.betreiberkennzahl))?.betreiberkennzahl}
        detectedUserName={detectedUserName}
        operatorName={rows.length > 0 ? rows[0].operator : undefined}
        isNarrow={isNarrow}
      />

      {/* Overview */}
      {rows.length === 0 ? (
        <div className={styles.noDataCard}>
          <div className={styles.noDataIcon}>
            <Icon name="info-circle" size="xl" />
          </div>
          <div className={styles.noDataTitle}>Keine Telemetriedaten verfügbar</div>
          <div className={styles.noDataDescription}>
            Fügen Sie eine Datenquellenabfrage hinzu und ordnen Sie die Spalten in den
            Panel-Einstellungen unter &quot;Spaltenzuordnung (Queries)&quot; zu.
          </div>
        </div>
      ) : isAuthority ? (
        <BetreiberAccordion groups={groups} options={interpolatedOptions} isNarrow={isNarrow} />
      ) : (
        <div className={styles.operatorWellSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              <Icon name="database" size="md" />
              Anlagenübersicht ({rows.length} {rows.length === 1 ? 'Station' : 'Stationen'})
            </h3>
          </div>
          <WellTable wells={rows} options={interpolatedOptions} showOperatorColumn={false} isNarrow={isNarrow} />
        </div>
      )}

      {/* Quick Links & Weather */}
      <QuickLinksSection options={interpolatedOptions} isAuthority={isAuthority} isNarrow={isNarrow} />
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    padding: ${theme.spacing(2)};
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: auto;
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    scrollbar-color: ${theme.isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.35)'} ${theme.isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.05)'};
    &::-webkit-scrollbar {
      width: 10px;
      height: 8px;
    }
    &::-webkit-scrollbar-track {
      background: ${theme.isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.05)'};
      border-radius: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${theme.isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.35)'};
      border-radius: 5px;
      border: 2px solid transparent;
      background-clip: padding-box;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${theme.isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'};
    }
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.5)};
    font-family: ${theme.typography.fontFamily};
    color: ${theme.colors.text.primary};
  `,
  containerNarrow: css`
    padding: ${theme.spacing(1)};
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    scrollbar-color: ${theme.isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.35)'} ${theme.isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.05)'};
    &::-webkit-scrollbar {
      width: 8px;
      height: 0px;
    }
    &::-webkit-scrollbar-track {
      background: ${theme.isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.05)'};
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${theme.isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.35)'};
      border-radius: 4px;
      border: 1px solid transparent;
      background-clip: padding-box;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: ${theme.isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'};
    }
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
    font-family: ${theme.typography.fontFamily};
    color: ${theme.colors.text.primary};
  `,
  sampleDataBanner: css`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: ${theme.spacing(0.75)} ${theme.spacing(1.5)};
    background: ${theme.colors.info.transparent};
    border: 1px solid ${theme.colors.info.border};
    border-radius: ${theme.shape.radius.default};
    color: ${theme.colors.info.text};
    font-size: ${theme.typography.bodySmall.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
  `,
  operatorWellSection: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
  `,
  sectionHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: ${theme.spacing(0.5)};
  `,
  sectionTitle: css`
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 15px;
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.colors.text.primary};
  `,
  noDataCard: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing(4)};
    background: ${theme.colors.background.secondary};
    border: 1px dashed ${theme.colors.border.medium};
    border-radius: ${theme.shape.radius.default};
    text-align: center;
    gap: ${theme.spacing(1)};
  `,
  noDataIcon: css`
    color: ${theme.colors.text.secondary};
  `,
  noDataTitle: css`
    font-size: ${theme.typography.h5.fontSize};
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.colors.text.primary};
  `,
  noDataDescription: css`
    font-size: ${theme.typography.body.fontSize};
    color: ${theme.colors.text.secondary};
    max-width: 520px;
    line-height: 1.4;
  `,
});
