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
}) => {
  const styles = useStyles2(getStyles);

  // Responsive breakpoint: narrow panel (mobile screen or narrow column < 680px)
  const isNarrow = width < 680;

  // Extract and merge rows from all query data frames
  const { extractedRows, detectedRole, detectedAuthority, detectedBetreiberkennzahl } = useMemo(() => {
    const res = extractWellRows(data.series || [], options);
    return {
      extractedRows: res.rows,
      detectedRole: res.detectedRole,
      detectedAuthority: res.detectedAuthority,
      detectedBetreiberkennzahl: res.detectedBetreiberkennzahl,
    };
  }, [data.series, options]);

  const showSample = options.showSampleDataOnEmpty ?? true;
  const isUsingSampleData = extractedRows.length === 0 && showSample;
  const rows = isUsingSampleData ? SAMPLE_WELL_ROWS : extractedRows;

  // Group devices by operator
  const groups = useMemo(() => {
    return groupWellsByOperator(rows);
  }, [rows]);

  // Determine whether to display Authority or Operator layout
  const isAuthority = useMemo(() => {
    if (options.viewMode === 'authority') {
      return true;
    }
    if (options.viewMode === 'operator') {
      return false;
    }

    // Auto mode
    if (detectedRole === 'authority') {
      return true;
    }
    if (detectedRole === 'operator') {
      return false;
    }

    // Heuristic: If more than 1 operator is present in data, this is an authority / multi-operator overview
    return groups.length > 1;
  }, [options.viewMode, detectedRole, groups.length]);

  return (
    <div
      className={isNarrow ? styles.containerNarrow : styles.container}
      style={{
        width: `${width}px`,
        minHeight: `${height}px`,
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
        options={options}
        isAuthority={isAuthority}
        detectedAuthority={detectedAuthority}
        detectedBetreiberkennzahl={detectedBetreiberkennzahl}
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
        <BetreiberAccordion groups={groups} options={options} isNarrow={isNarrow} />
      ) : (
        <div className={styles.operatorWellSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              <Icon name="database" size="md" />
              Anlagenübersicht ({rows.length} {rows.length === 1 ? 'Station' : 'Stationen'})
            </h3>
          </div>
          <WellTable wells={rows} options={options} showOperatorColumn={false} isNarrow={isNarrow} />
        </div>
      )}

      {/* Quick Links & Weather */}
      <QuickLinksSection options={options} isAuthority={isAuthority} isNarrow={isNarrow} />
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    padding: ${theme.spacing(2)};
    box-sizing: border-box;
    overflow-y: auto;
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
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.25)};
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
